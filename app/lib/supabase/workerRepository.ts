import { getSupabaseClient } from "@/app/lib/supabaseClient";
import type {
  AvailabilityType,
  OnboardingStepId,
  PaymentOnboardingInput,
  ProfileOnboardingInput,
  ProfileRow,
  SkillsCertificatesOnboardingInput,
} from "./types";
import {
  ensureWorkerOnboardingInDb,
  fetchWorkerOnboardingFromDb,
  markWorkerOnboardingStepCompleteInDb,
  saveWorkerOnboardingToDb,
  type WorkerOnboardingRow,
} from "./workerOnboardingDb";

function parseSkills(skills: string): string[] {
  return skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function displayNameFromParts(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}

async function uploadWorkerFile(
  workerId: string,
  file: File,
  label: string,
): Promise<string | null> {
  try {
    const supabase = getSupabaseClient();
    const extension = file.name.split(".").pop() ?? "bin";
    const path = `${workerId}/${label}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage.from("certificates").upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
    });

    if (error) return null;
    return path;
  } catch {
    return null;
  }
}

export async function fetchProfile(workerId: string): Promise<ProfileRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", workerId)
    .maybeSingle();

  if (error) throw error;
  return data as ProfileRow | null;
}

export async function ensureWorkerProfile(
  workerId: string,
  email: string,
): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: workerId,
      email: email.trim().toLowerCase(),
      role: "worker",
      display_name: email.split("@")[0],
    },
    { onConflict: "id" },
  );

  if (error) throw error;
}

export async function ensureOnboardingProgress(workerId: string): Promise<void> {
  await ensureWorkerOnboardingInDb(workerId);
}

export async function fetchOnboardingProgress(
  workerId: string,
): Promise<WorkerOnboardingRow | null> {
  return fetchWorkerOnboardingFromDb(workerId);
}

export async function updateOnboardingProgressRow(
  workerId: string,
  updates: Partial<Pick<WorkerOnboardingRow, "completed_steps" | "dismissed">>,
): Promise<WorkerOnboardingRow> {
  const current = await fetchWorkerOnboardingFromDb(workerId);
  return saveWorkerOnboardingToDb(workerId, {
    completed_steps: updates.completed_steps ?? current?.completed_steps ?? [],
    dismissed: updates.dismissed ?? current?.dismissed ?? false,
  });
}

export async function markOnboardingStepCompleteInDb(
  workerId: string,
  stepId: OnboardingStepId,
): Promise<WorkerOnboardingRow> {
  return markWorkerOnboardingStepCompleteInDb(workerId, stepId);
}

export async function saveProfileOnboarding(
  workerId: string,
  input: ProfileOnboardingInput,
): Promise<void> {
  const supabase = getSupabaseClient();
  const displayName = displayNameFromParts(input.firstName, input.lastName);

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      display_name: displayName,
      phone: input.phone.trim(),
      location: input.location.trim() || null,
      availability: input.availability as AvailabilityType,
      last_active_at: new Date().toISOString(),
    })
    .eq("id", workerId);

  if (profileError) throw profileError;

  await markOnboardingStepCompleteInDb(workerId, "profile");
}

export async function saveSkillsCertificatesOnboarding(
  workerId: string,
  input: SkillsCertificatesOnboardingInput,
): Promise<void> {
  const supabase = getSupabaseClient();
  const cert = input.certificate;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      skills: parseSkills(input.skills),
      headline: `${input.yearsExperience.trim()} years experience`,
      bio: input.workHistory.trim(),
      last_active_at: new Date().toISOString(),
    })
    .eq("id", workerId);

  if (profileError) throw profileError;

  let filePath: string | null = null;
  if (cert.certificateFile) {
    filePath = await uploadWorkerFile(
      workerId,
      cert.certificateFile,
      "certificate",
    );
  }

  const { error } = await supabase.from("worker_certificates").insert({
    worker_id: workerId,
    certificate_name: cert.certificateName.trim(),
    issuing_body: cert.issuingBody.trim(),
    issue_date: cert.issueDate || null,
    expiry_date: cert.expiryDate || null,
    license_number: cert.licenseNumber.trim(),
    file_url: filePath,
    verification_status: "pending",
  });

  if (error) throw error;

  await markOnboardingStepCompleteInDb(workerId, "skills-certificates");
}

export async function savePaymentOnboarding(
  workerId: string,
  input: PaymentOnboardingInput,
): Promise<void> {
  const supabase = getSupabaseClient();
  const profile = await fetchProfile(workerId);
  const seeking = profile?.seeking ?? [];
  const withoutPayout = seeking.filter((item) => !item.startsWith("payout"));

  const { error } = await supabase
    .from("profiles")
    .update({
      seeking: [
        ...withoutPayout,
        `payout:${input.paymentMethod}`,
        `payout-holder:${input.accountHolder.trim()}`,
        `payout-last4:${input.accountLast4.trim()}`,
      ],
      last_active_at: new Date().toISOString(),
    })
    .eq("id", workerId);

  if (error) throw error;

  await markOnboardingStepCompleteInDb(workerId, "payment-method");
}

export function formDataToProfileInput(formData: FormData): ProfileOnboardingInput {
  const availability = formData.get("availability") as AvailabilityType;
  return {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    location: String(formData.get("location") ?? ""),
    availability,
  };
}

export function formDataToSkillsCertificatesInput(
  formData: FormData,
): SkillsCertificatesOnboardingInput {
  const certificateFile = formData.get("certificateFile");

  return {
    yearsExperience: String(formData.get("yearsExperience") ?? ""),
    skills: String(formData.get("skills") ?? ""),
    workHistory: String(formData.get("workHistory") ?? ""),
    certificate: {
      certificateName: String(formData.get("certificateName") ?? ""),
      issuingBody: String(formData.get("issuingBody") ?? ""),
      issueDate: String(formData.get("issueDate") ?? ""),
      expiryDate: String(formData.get("expiryDate") ?? "") || undefined,
      licenseNumber: String(formData.get("licenseNumber") ?? ""),
      certificateFile:
        certificateFile instanceof File && certificateFile.size > 0
          ? certificateFile
          : null,
    },
  };
}

export function formDataToPaymentInput(formData: FormData): PaymentOnboardingInput {
  return {
    paymentMethod: String(
      formData.get("paymentMethod") ?? "",
    ) as PaymentOnboardingInput["paymentMethod"],
    accountHolder: String(formData.get("accountHolder") ?? ""),
    accountLast4: String(formData.get("accountLast4") ?? ""),
  };
}
