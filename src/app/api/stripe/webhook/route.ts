import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

const PLAN_CREDITS: Record<string, number> = {
  starter: 10000,
  pro: 40000,
  agency: 999999,
};

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        const credits = parseInt(session.metadata?.credits || "0");

        if (!userId || !plan) break;

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            subscriptionStatus: "active",
            stripeSubscriptionId: session.subscription as string,
            credits: { increment: credits },
          },
        });

        await prisma.creditTransaction.create({
          data: {
            userId,
            amount: credits,
            type: "subscription_grant",
            description: `${plan} plan activated — ${credits.toLocaleString()} credits added`,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await prisma.user.update({
          where: { id: userId },
          data: { subscriptionStatus: sub.status },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "trial",
            subscriptionStatus: "canceled",
            stripeSubscriptionId: null,
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string; billing_reason?: string };
        const subId = invoice.subscription;
        const sub = subId ? await stripe.subscriptions.retrieve(subId) : null;
        const userId = sub?.metadata?.userId;
        const plan = sub?.metadata?.plan;

        // Only grant credits on renewal (not first payment — handled by checkout.session.completed)
        if (userId && plan && invoice.billing_reason === "subscription_cycle") {
          const credits = PLAN_CREDITS[plan] || 0;
          await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: credits } },
          });
          await prisma.creditTransaction.create({
            data: {
              userId,
              amount: credits,
              type: "subscription_renewal",
              description: `${plan} plan renewed — ${credits.toLocaleString()} credits added`,
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
        const subId = invoice.subscription;
        const sub = subId ? await stripe.subscriptions.retrieve(subId) : null;
        const userId = sub?.metadata?.userId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { subscriptionStatus: "past_due" },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
