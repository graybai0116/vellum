import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("user_data")
    .select("history, saved_ids, saved_uploads")
    .eq("user_id", userId)
    .single();

  if (!data) return NextResponse.json({ history: [], saved_ids: [], saved_uploads: [] });
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { history, saved_ids, saved_uploads } = await req.json();

  await supabase.from("user_data").upsert({
    user_id: userId,
    history: history ?? [],
    saved_ids: saved_ids ?? [],
    saved_uploads: saved_uploads ?? [],
    updated_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
