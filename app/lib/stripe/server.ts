import Stripe from "stripe";
import { getStripeSecretKey, isStripeConfigured } from "./env";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const key = getStripeSecretKey();
  if (!key) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local.");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export { isStripeConfigured };
