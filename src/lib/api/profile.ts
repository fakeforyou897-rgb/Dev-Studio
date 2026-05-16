import { apiFetch } from "./base";

export async function getProfile() {
  try {
    const r = await fetch("/api/profile");
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function updateProfile(profile: {
  displayName?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
}) {
  return apiFetch<any>("/api/profile", { method: "POST", body: JSON.stringify(profile) });
}
