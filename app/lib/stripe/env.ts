export function getStripeSecretKey(): string | undefined {
  return process.env.STRIPE_SECRET_KEY;
}

export function isStripeConfigured(): boolean {
  return Boolean(getStripeSecretKey());
}
