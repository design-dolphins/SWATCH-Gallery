import { sampleGalleries } from "./sample-data";
import { isSupabaseConfigured, supabase } from "./supabase";

export async function getGalleries() {
  if (!isSupabaseConfigured || !supabase) {
    return sampleGalleries;
  }

  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return sampleGalleries;
  }

  return data?.length ? data : sampleGalleries;
}
