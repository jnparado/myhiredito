import { getSupabaseClient } from "@/app/lib/supabaseClient";
import type {
  AvailabilityType,
  CertificateOnboardingInput,
  IdentityOnboardingInput,
  OnboardingProgressRow,
  OnboardingStepId,
  ProfileOnboardingInput,
  ProfileRow,
} from "./types";

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
  bucket: "identity-documents" | "certificates",
  workerId: string,
  file: File,
  label: string,
): Promise<string> {
  const supabase = getSupabaseClient();
  const extension = file.name.split(".").pop() ?? "bin";
  const path = `${workerId}/${label}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });

  if (error) throw error;
  return path;
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
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("onboarding_progress").upsert(
    {
      worker_id: workerId,
      completed_steps: [],
      dismissed: false,
    },
    { onConflict: "worker_id" },
  );

  if (error) throw error;
}

export async function fetchOnboardingProgress(
  workerId: string,
): Promise<OnboardingProgressRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("onboarding_progress")
    .select("*")
    .eq("worker_id", workerId)
    .maybeSingle();

  if (error) throw error;
  return data as OnboardingProgressRow | null;
}

export async function updateOnboardingProgressRow(
  workerId: string,
  updates: Partial<Pick<OnboardingProgressRow, "completed_steps" | "dismissed">>,
): Promise<OnboardingProgressRow> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("onboarding_progress")
    .upsert(
      {
        worker_id: workerId,
        completed_steps: updates.completed_steps ?? [],
        dismissed: updates.dismissed ?? false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "worker_id" },
    )
    .select("*")
    .single();

  if (error) throw error;
  return data as OnboardingProgressRow;
}

export async function markOnboardingStepCompleteInDb(
  workerId: string,
  stepId: OnboardingStepId,
): Promise<OnboardingProgressRow> {
  const current = await fetchOnboardingProgress(workerId);
  const completed = current?.completed_steps ?? [];

  if (completed.includes(stepId)) {
    return (
      current ??
      (await updateOnboardingProgressRow(workerId, { completed_steps: completed }))
    );
  }

  return updateOnboardingProgressRow(workerId, {
    completed_steps: [...completed, stepId],
    dismissed: current?.dismissed ?? false,
  });
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
      skills: parseSkills(input.skills),
      availability: input.availability as AvailabilityType,
      last_active_at: new Date().toISOString(),
    })
    .eq("id", workerId);

  if (profileError) throw profileError;

  await markOnboardingStepCompleteInDb(workerId, "profile");
}

export async function saveIdentityOnboarding(
  workerId: string,
  input: IdentityOnboardingInput,
): Promise<void> {
  const supabase = getSupabaseClient();

  let frontPath: string | null = null;
  let backPath: string | null = null;

  if (input.idFront) {
    frontPath = await uploadWorkerFile(
      "identity-documents",
      workerId,
      input.idFront,
      "front",
    );
  }

  if (input.idBack) {
    backPath = await uploadWorkerFile(
      "identity-documents",
      workerId,
      input.idBack,
      "back",
    );
  }

  const { error } = await supabase.from("identity_documents").upsert(
    {
      worker_id: workerId,
      id_type: input.idType,
      id_number: input.idNumber.trim(),
      expiry_date: input.idExpiry || null,
      front_file_url: frontPath,
      back_file_url: backPath,
      verification_status: "pending",
    },
    { onConflict: "worker_id" },
  );

  if (error) throw error;

  await markOnboardingStepCompleteInDb(workerId, "government-id");
}

export async function saveCertificateOnboarding(
  workerId: string,
  input: CertificateOnboardingInput,
): Promise<void> {
  const supabase = getSupabaseClient();

  let filePath: string | null = null;
  if (input.certificateFile) {
    filePath = await uploadWorkerFile(
      "certificates",
      workerId,
      input.certificateFile,
      "certificate",
    );
  }

  const { error } = await supabase.from("worker_certificates").insert({
    worker_id: workerId,
    certificate_name: input.certificateName.trim(),
    issuing_body: input.issuingBody.trim(),
    issue_date: input.issueDate || null,
    expiry_date: input.expiryDate || null,
    license_number: input.licenseNumber.trim(),
    file_url: filePath,
    verification_status: "pending",
  });

  if (error) throw error;

  await markOnboardingStepCompleteInDb(workerId, "certificates");
}

export function formDataToProfileInput(formData: FormData): ProfileOnboardingInput {
  const availability = formData.get("availability") as AvailabilityType;
  return {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    skills: String(formData.get("skills") ?? ""),
    availability,
  };
}

export function formDataToIdentityInput(formData: FormData): IdentityOnboardingInput {
  const idFront = formData.get("idFront");
  const idBack = formData.get("idBack");

  return {
    idType: String(formData.get("idType") ?? "") as IdentityOnboardingInput["idType"],
    idNumber: String(formData.get("idNumber") ?? ""),
    idExpiry: String(formData.get("idExpiry") ?? ""),
    idFront: idFront instanceof File && idFront.size > 0 ? idFront : null,
    idBack: idBack instanceof File && idBack.size > 0 ? idBack : null,
  };
}

export function formDataToCertificateInput(
  formData: FormData,
): CertificateOnboardingInput {
  const certificateFile = formData.get("certificateFile");

  return {
    certificateName: String(formData.get("certificateName") ?? ""),
    issuingBody: String(formData.get("issuingBody") ?? ""),
    issueDate: String(formData.get("issueDate") ?? ""),
    expiryDate: String(formData.get("expiryDate") ?? "") || undefined,
    licenseNumber: String(formData.get("licenseNumber") ?? ""),
    certificateFile:
      certificateFile instanceof File && certificateFile.size > 0
        ? certificateFile
        : null,
  };
}
