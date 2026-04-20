import { auth, state } from "@/config/constants";
import { setCookie } from "@/lib/cookies";
import type { AuthPayload } from "./types";

const DAY_MS = 1000 * 60 * 60 * 24;

function parseExpiry(iso: string | undefined, fallbackDays: number): Date {
  if (iso) {
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date(Date.now() + fallbackDays * DAY_MS);
}

export function persistAuthPayload(payload: AuthPayload) {
  const accessExp = parseExpiry(payload.tokens.expires_at, 1);
  const refreshExp = parseExpiry(payload.tokens.refresh_expires_at, 30);
  const sessionExp = new Date(Date.now() + 30 * DAY_MS);

  setCookie(auth.token, payload.tokens.access_token, accessExp);
  setCookie(auth.refresh_token, payload.tokens.refresh_token, refreshExp);
  setCookie(auth.logged_in, state.loggedIn, refreshExp);

  if (payload.session?.id) {
    setCookie(auth.session_id, payload.session.id, sessionExp);
  }

  const activeBranch =
    payload.session?.active_branch_id ||
    payload.user?.active_branch_id ||
    payload.user?.home_branch_id ||
    payload.user?.branches?.[0]?.id;

  if (activeBranch) {
    setCookie(auth.active_branch_id, activeBranch, refreshExp);
  }
}
