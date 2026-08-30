import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default function SignOutButton({ className }: { className?: string }) {
  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <form action={signOut}>
      <button type='submit' className={className}>
        Sign out
      </button>
    </form>
  );
}
