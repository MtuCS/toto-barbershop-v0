import { createBrowserClient } from "@supabase/ssr";

// Supabase chỉ dùng cho Realtime listener (profile page)
// Nếu không có env var, trả về null-safe client giả để không crash build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) return null as any;
  return createBrowserClient(supabaseUrl, supabaseKey);
};
