import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

const AUTH_COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

/**
 * JWT Payload from POC2 backend (Orleans + RavenDB)
 * Note: POC2 sends minimal claims compared to POC1
 */
export interface JWTPayload {
  sub: string;
  unique_name: string;
  TenantId: string; // capital T in POC2
  exp: number;

  // optional: only present in POC1
  name?: string;
  tenant?: string;
  locationId?: string;
  location?: string;
  shiftId?: string;
  shift?: string;
  assignmentId?: string;
  assignment?: string;
}

export interface Session {
  userId: string;
  userName: string;
  displayName: string;
  tenantId: string;
  tenantName: string | null;
  locationId: string | null;
  locationName: string | null;
  shiftId: string | null;
  shiftName: string | null;
  assignmentId: string | null;
  assignmentName: string | null;
  expiresAt: Date;
}

/**
 * Get the current session from the HTTP-only cookie
 * Returns null if not authenticated/token is expired
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode<JWTPayload>(token);

    // Check if token's expired
    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }

    // Map JWT claims to session
    // POC2 sends: sub, unique_name, TenantId
    // POC1 sends more fields: name, tenant, location, shift, assignment
    return {
      userId: decoded.sub,
      userName: decoded.unique_name,
      // Use 'name' if available (POC1), otherwise use userName
      displayName: decoded.name || decoded.unique_name,
      // TenantId is always present, tenant name may not be
      tenantId: decoded.TenantId || "",
      tenantName: decoded.tenant || null,
      // These are only in POC1
      locationId: decoded.locationId || null,
      locationName: decoded.location || null,
      shiftId: decoded.shiftId || null,
      shiftName: decoded.shift || null,
      assignmentId: decoded.assignmentId || null,
      assignmentName: decoded.assignment || null,
      expiresAt: new Date(decoded.exp * 1000),
    };
  } catch {
    return null;
  }
}

/**
 * Get the raw JWT token for API calls
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

/**
 * Set the auth cookie with the JWT token (server-side only)
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/**
 * Clear the auth cookie (logout)
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
