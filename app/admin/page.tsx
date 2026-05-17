"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import AdminGalleryForm from "@/components/AdminGalleryForm";
import LoginForm from "@/components/LoginForm";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-bone">
        <p className="text-sm font-bold text-black/40">Loading...</p>
      </main>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return <AdminGalleryForm />;
}
