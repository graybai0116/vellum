import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const getCustomerId = (obj: Stripe.Subscription | Stripe.Checkout.Session) =>
    typeof obj.customer === "string" ? obj.customer : obj.customer?.id;

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription") {
        await supabase
          .from("user_data")
          .update({ plan: "pro" })
          .eq("stripe_customer_id", getCustomerId(session));
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from("user_data")
        .update({ plan: "free" })
        .eq("stripe_customer_id", getCustomerId(sub));
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const cid = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
      await supabase.from("user_data").update({ plan: "free" }).eq("stripe_customer_id", cid);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
