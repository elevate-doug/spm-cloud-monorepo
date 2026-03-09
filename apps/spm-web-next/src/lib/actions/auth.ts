"use server";

import { redirect } from "next/navigation";
import { setAuthCookie, clearAuthCookie, getAuthToken } from "../auth/session";
import { API_ENDPOINTS } from "@/constants/api/endpoints";
import type { Tenant } from "@/types/assembly";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5361";

interface LoginResponse {
  access_token: string;
  expires_in: number;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

/**
 * Fetch available tenants for the login form
 */
export async function getTenants(): Promise<Tenant[]> {
  const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.TENANT.GET_TENANTS}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tenants");
  }

  return response.json();
}

/**
 * Login server action - authenticates user and sets HTTP-only cookie
 */
export async function login(
  tenant: string,
  userName: string,
  password: string
): Promise<LoginResult> {
  try {
    const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.USER.LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tenant, userName, password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Invalid credentials" };
      }
      return { success: false, error: "Login failed. Please try again." };
    }

    const data: LoginResponse = await response.json();

    // Set HTTP-only cookie with the JWT token
    await setAuthCookie(data.access_token);

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Logout server action - clears the auth cookie and redirects to login
 */
export async function logout(): Promise<void> {
  await clearAuthCookie();
  redirect("/login");
}

/**
 * Helper to make authenticated API calls from server components/actions
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const fullUrl = url.startsWith("http") ? url : `${BACKEND_URL}${url}`;

  return fetch(fullUrl, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}
