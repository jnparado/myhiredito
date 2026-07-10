import { getSupabaseClient } from "@/app/lib/supabaseClient";
import { ensureProfileForUser } from "./profiles";
import type {
  AvailabilityType,
  OnboardingStepId,
  PaymentOnboardingInput,
  ProfileOnboardingInput,
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

export async function ensureWorkerProfile(
  workerId: string,
  email: string,
): Promise<void> {
  await ensureProfileForUser({
    userId: workerId,
    email: email.trim().toLowerCase(),
    role: "worker",
  });
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
    personal: current?.personal ?? null,
    location_skills: current?.location_skills ?? null,
    payment: current?.payment ?? null,
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

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
    })
    .eq("id", workerId);

  if (profileError) throw profileError;

  const current = await fetchWorkerOnboardingFromDb(workerId);
  await saveWorkerOnboardingToDb(workerId, {
    completed_steps: current?.completed_steps ?? [],
    dismissed: current?.dismissed ?? false,
    personal: {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: input.phone.trim(),
      location: input.location.trim(),
      availability: input.availability,
      displayName: displayNameFromParts(input.firstName, input.lastName),
    },
    location_skills: current?.location_skills ?? null,
    payment: current?.payment ?? null,
  });

  await markOnboardingStepCompleteInDb(workerId, "profile");
}

export async function saveSkillsCertificatesOnboarding(
  workerId: string,
  input: SkillsCertificatesOnboardingInput,
): Promise<void> {
  const cert = input.certificate;
  let filePath: string | null = null;

  if (cert.certificateFile) {
    filePath = await uploadWorkerFile(
      workerId,
      cert.certificateFile,
      "certificate",
    );
  }

  const current = await fetchWorkerOnboardingFromDb(workerId);
  await saveWorkerOnboardingToDb(workerId, {
    completed_steps: current?.completed_steps ?? [],
    dismissed: current?.dismissed ?? false,
    personal: current?.personal ?? null,
    location_skills: {
      yearsExperience: input.yearsExperience.trim(),
      skills: parseSkills(input.skills),
      workHistory: input.workHistory.trim(),
      certificate: {
        certificateName: cert.certificateName.trim(),
        issuingBody: cert.issuingBody.trim(),
        issueDate: cert.issueDate || null,
        expiryDate: cert.expiryDate || null,
        licenseNumber: cert.licenseNumber.trim(),
        filePath,
      },
    },
    payment: current?.payment ?? null,
  });

  await markOnboardingStepCompleteInDb(workerId, "skills-certificates");
}

export async function savePaymentOnboarding(
  workerId: string,
  input: PaymentOnboardingInput,
): Promise<void> {
  const current = await fetchWorkerOnboardingFromDb(workerId);
  await saveWorkerOnboardingToDb(workerId, {
    completed_steps: current?.completed_steps ?? [],
    dismissed: current?.dismissed ?? false,
    personal: current?.personal ?? null,
    location_skills: current?.location_skills ?? null,
    payment: {
      paymentMethod: input.paymentMethod,
      accountHolder: input.accountHolder.trim(),
      accountLast4: input.accountLast4.trim(),
    },
  });

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
