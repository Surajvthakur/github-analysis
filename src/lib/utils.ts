export function getBaseUrl(): string {
  // In production (Vercel), use the VERCEL_URL or detect from headers
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback for local development
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  
  // Last resort - this should not happen in production
  return "";
}

export function getApiUrl(path: string): string {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    // In server components, we can try using relative URLs as fallback
    // But this should not happen if env vars are set correctly
    throw new Error("Base URL is not configured. Please set NEXT_PUBLIC_BASE_URL or deploy to Vercel.");
  }
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
