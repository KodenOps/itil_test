import { NextResponse } from "next/server";
import { getViewer } from "@/lib/supabase/profile";
import type { Notification, NotificationType } from "@/types/app";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

export async function GET(request: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json(
      { notifications: [], unread: 0 },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const unreadOnly = new URL(request.url).searchParams.get("unread") === "1";

  let query = viewer.supabase
    .from("notifications")
    .select("id, user_id, actor_id, type, title, body, link, read_at, created_at")
    .eq("user_id", viewer.userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (unreadOnly) query = query.is("read_at", null);

  const { data, error } = await query.returns<Row[]>();

  if (error) {
    console.error("Could not load notifications:", error.message);
    return NextResponse.json(
      { notifications: [], unread: 0 },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }

  const notifications: Notification[] = (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    actorId: row.actor_id,
    actorName: null,
    type: (row.type as NotificationType) ?? "announcement",
    title: row.title,
    body: row.body,
    link: row.link,
    readAt: row.read_at,
    createdAt: row.created_at,
  }));

  const unread = notifications.filter((item) => !item.readAt).length;

  return NextResponse.json(
    { notifications, unread },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let id: string | null = null;

  try {
    const body = (await request.json()) as { id?: string };
    id = typeof body.id === "string" ? body.id : null;
  } catch {
    id = null;
  }

  let query = viewer.supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", viewer.userId)
    .is("read_at", null);

  if (id) query = query.eq("id", id);

  const { error } = await query;

  if (error) {
    console.error("Could not mark notifications read:", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
