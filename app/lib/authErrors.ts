export function formatAuthError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message: string }).message);

    if (message.includes("Invalid login credentials")) {
      return "Incorrect email or password.";
    }
    if (message.includes("Email not confirmed")) {
      return "Please confirm your email before logging in. Check your inbox for the confirmation link.";
    }
    if (
      message.includes("User already registered") ||
      message.includes("already been registered")
    ) {
      return "An account with this email already exists. Try logging in instead.";
    }
    if (message.includes("Password should be at least")) {
      return "Password must be at least 6 characters.";
    }
    if (message.includes("Unable to validate email address")) {
      return "Please enter a valid email address.";
    }
    if (message.includes("Supabase is not configured")) {
      return message;
    }

    return message;
  }

  return "Something went wrong. Please try again.";
}
