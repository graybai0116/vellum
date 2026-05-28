import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  // Get or create Stripe customer
  const { data: userData } = await supabase
    .from("user_data")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  let customerId = userData?.stripe_customer_id as string | undefined;

  if (!customerId) {
    const customer = await getStripe().customers.create({ email, metadata: { clerk_user_id: userId } });
    customerId = customer.id;
    await supabase.from("user_data").upsert({ user_id: userId, stripe_customer_id: customerId });
  }

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/workspace?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/workspace`,
  });

  return NextResponse.json({ url: session.url });
}
