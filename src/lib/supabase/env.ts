export interface SupabasePublicEnv {
  url: string;
  publishableKey: string;
}

export function parseSupabasePublicEnv(
  urlValue: string | undefined,
  publishableKeyValue: string | undefined,
): SupabasePublicEnv {
  if (!urlValue || !publishableKeyValue) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.",
    );
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(urlValue);
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid absolute URL.");
  }

  const isLocalDevelopment =
    parsedUrl.hostname === "localhost" ||
    parsedUrl.hostname === "127.0.0.1" ||
    parsedUrl.hostname === "[::1]";

  if (parsedUrl.protocol !== "https:" && !isLocalDevelopment) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must use HTTPS, except for localhost development.",
    );
  }

  return {
    url: urlValue.replace(/\/+$/, ""),
    publishableKey: publishableKeyValue,
  };
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  return parseSupabasePublicEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function getSupabasePublicEnvOrNull(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url && !key) {
    return null;
  }

  return parseSupabasePublicEnv(url, key);
}
