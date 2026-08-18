const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

export function getGoogleLoginUrl() {
  return `${API_URL}/auth/google`;
}
