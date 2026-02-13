import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main style={{ padding: 24 }}>
      <h1>Home</h1>

      {!user ? (
        <>
          <p>Not logged in</p>
          <Link href="/login">Go to login</Link>
        </>
      ) : (
        <p>Logged in as: {user.email}</p>
      )}
    </main>
  );
}
