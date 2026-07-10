export type UserRole = "worker" | "employer" | "admin";
export type AvailabilityType = "full-time" | "part-time" | "weekends" | "flexible";
export type OnboardingStepId = "profile" | "government-id" | "certificates";
export type IdDocumentType =
  | "drivers-license"
  | "passport"
  | "national-id"
  | "state-id";
export type VerificationStatus = "pending" | "approved" | "rejected";

export type ProfileRow = {
  id: string;
  role: UserRole;
  email: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  phone: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  skills: string[] | null;
  seeking: string[] | null;
  availability: AvailabilityType | null;
  avatar_url: string | null;
  is_verified: boolean;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OnboardingProgressRow = {
  worker_id: string;
  completed_steps: OnboardingStepId[];
  dismissed: boolean;
  updated_at: string;
};

export type IdentityDocumentRow = {
  id: string;
  worker_id: string;
  id_type: IdDocumentType;
  id_number: string;
  expiry_date: string | null;
  front_file_url: string | null;
  back_file_url: string | null;
  verification_status: VerificationStatus;
};

export type WorkerCertificateRow = {
  id: string;
  worker_id: string;
  certificate_name: string;
  issuing_body: string;
  issue_date: string | null;
  expiry_date: string | null;
  license_number: string | null;
  file_url: string | null;
  verification_status: VerificationStatus;
};

export type ProfileOnboardingInput = {
  firstName: string;
  lastName: string;
  phone: string;
  skills: string;
  availability: AvailabilityType;
};

export type IdentityOnboardingInput = {
  idType: IdDocumentType;
  idNumber: string;
  idExpiry: string;
  idFront?: File | null;
  idBack?: File | null;
};

export type CertificateOnboardingInput = {
  certificateName: string;
  issuingBody: string;
  issueDate: string;
  expiryDate?: string;
  licenseNumber: string;
  certificateFile?: File | null;
};
