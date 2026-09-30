import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Call this at the top of any Server Component, Server Action, or Route
 * Handler that touches user-specific data. Middleware keeps unauthenticated
 * *page* requests out, but middleware has had real bypass vulnerabilities
 * across the ecosystem (header-spoofing tricks, matcher misconfigurations).
 * The data layer should never assume the request in front of it was
 * actually vetted — so it verifies again, independently.
 *
 * This is also why Row Level Security (see supabase/schema.sql) is the
 * real backstop: even if every layer of app code were bypassed, Postgres
 * itself won't return rows without a valid, verified Supabase session.
 */
export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  return { supabase, claims: data.claims };
}
