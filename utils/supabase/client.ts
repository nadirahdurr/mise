import { createBrowserClient } from "@supabase/ssr";

// Client-side Supabase client - currently not used in the app
// For client-side auth or real-time features, you would need public environment variables
// For now, all database operations are handled server-side for security

export function createClient() {
  // This would require NEXT_PUBLIC_ variables for client-side use
  // Currently all Supabase operations are server-side only
  throw new Error(
    "Client-side Supabase operations are not configured for security reasons"
  );
}
