import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/app/lib/stripe/server";
import type {
  StripeBankDetails,
  StripeBankRole,
  StripeCheckoutMethod,
} from "@/app/lib/stripe/bank";

function originFromRequest(request: Request): string {
  const url = new URL(request.url);
  return process.env.NEXT_PUBLIC_APP_URL ?? url.origin;
}

function safeReturnPath(path: unknown): string {
  if (typeof path !== "string" || !path.startsWith("/")) {
    return "/";
  }
  return path;
}

function detailsFromPaymentMethod(
  method: Stripe.PaymentMethod,
): StripeBankDetails | null {
  if (method.us_bank_account) {
    return {
      paymentMethodId: method.id,
      bankName: method.us_bank_account.bank_name?.trim() || "Bank account",
      last4: method.us_bank_account.last4 ?? "0000",
      accountHolder:
        method.billing_details.name?.trim() ||
        method.billing_details.email?.trim() ||
        "Account holder",
      kind: "bank",
    };
  }

  if (method.card) {
    return {
      paymentMethodId: method.id,
      bankName: method.card.brand
        ? `Stripe ${method.card.brand}`
        : "Stripe card",
      last4: method.card.last4 ?? "0000",
      accountHolder:
        method.billing_details.name?.trim() ||
        method.billing_details.email?.trim() ||
        "Account holder",
      kind: "stripe",
    };
  }

  return null;
}

async function findOrCreateCustomer(
  stripe: Stripe,
  email: string,
  role: StripeBankRole,
): Promise<string> {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data[0]?.id) return existing.data[0].id;

  const created = await stripe.customers.create({
    email,
    metadata: { role },
  });
  return created.id;
}

export async function GET(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ configured: false });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ configured: true });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["setup_intent.payment_method"],
    });

    const setupIntent = session.setup_intent;
    const paymentMethod =
      setupIntent && typeof setupIntent !== "string"
        ? setupIntent.payment_method
        : null;
    const method =
      paymentMethod && typeof paymentMethod !== "string" ? paymentMethod : null;

    const details = method ? detailsFromPaymentMethod(method) : null;
    if (!details) {
      return NextResponse.json(
        { error: "No payment method was connected." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      configured: true,
      bank: details,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load Stripe bank session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  try {
    const body = (await request.json()) as {
      role?: StripeBankRole;
      email?: string;
      returnPath?: string;
      method?: StripeCheckoutMethod;
    };

    const role: StripeBankRole =
      body.role === "employer" ? "employer" : "worker";
    const email = body.email?.trim().toLowerCase();
    const returnPath = safeReturnPath(body.returnPath);
    const origin = originFromRequest(request);

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const method: StripeCheckoutMethod =
      body.method === "card" ? "card" : "bank";
    const stripe = getStripe();
    const customer = await findOrCreateCustomer(stripe, email, role);
    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      currency: "usd",
      customer,
      payment_method_types: [method === "card" ? "card" : "us_bank_account"],
      setup_intent_data: {
        metadata: { role, purpose: method === "card" ? "card" : "bank" },
      },
      success_url: `${origin}${returnPath}?stripe=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${returnPath}?stripe=cancel`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({ configured: true, url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start Stripe bank setup.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
