"use server";

import { revalidatePath } from "next/cache";
import { fetchWithAuth } from "./auth";
import { API_ENDPOINTS } from "@/constants/api/endpoints";
import type { InstrumentSetBuild, InstrumentSet } from "@/types/assembly";

/**
 * Get recent builds (last 30 days)
 */
export async function getRecentBuilds(): Promise<InstrumentSetBuild[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateOnly = thirtyDaysAgo.toISOString().slice(0, 10);

  const response = await fetchWithAuth(
    `${API_ENDPOINTS.ASSEMBLY.GET_BUILDS}?since=${dateOnly}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch builds");
  }

  return response.json();
}

/**
 * Get a single build by ID
 */
export async function getBuild(buildId: string): Promise<InstrumentSetBuild> {
  const response = await fetchWithAuth(API_ENDPOINTS.ASSEMBLY.GET_BUILD(buildId));

  if (!response.ok) {
    throw new Error("Failed to fetch build");
  }

  return response.json();
}

/**
 * Get the latest build for a barcode
 */
export async function getLatestBuildForBarcode(
  barcode: string
): Promise<InstrumentSetBuild | null> {
  const response = await fetchWithAuth(
    `${API_ENDPOINTS.ASSEMBLY.GET_BUILDS}?barcode=${barcode}&count=1`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch build");
  }

  const builds: InstrumentSetBuild[] = await response.json();
  return builds[0] ?? null;
}

/**
 * Get instrument set by barcode
 */
export async function getInstrumentSetByBarcode(
  barcode: string
): Promise<InstrumentSet | null> {
  const response = await fetchWithAuth(`${API_ENDPOINTS.ASSEMBLY.GET_INSTRUMENTSET}?barcode=${barcode}`);

  if (!response.ok) {
    throw new Error("Failed to fetch instrument set");
  }

  const sets: InstrumentSet[] = await response.json();
  return sets[0] ?? null;
}

/**
 * Start a new build for an instrument set
 */
export async function startNewBuild(
  instrumentSetId: string,
  userId: string = "37",
  locationId: string = "1"
): Promise<InstrumentSetBuild> {
  const response = await fetchWithAuth(API_ENDPOINTS.ASSEMBLY.START_NEW_BUILD, {
    method: "POST",
    body: JSON.stringify({
      userId,
      locationId,
      type: 0,
      itemId: instrumentSetId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to start build");
  }

  revalidatePath("/assembly");
  return response.json();
}

/**
 * Update included quantity for an item in a build
 */
export async function updateIncludedQuantity(
  buildId: string,
  instrumentId: string,
  newQuantity: number
): Promise<InstrumentSetBuild> {
  const response = await fetchWithAuth(
    API_ENDPOINTS.ASSEMBLY.UPDATE_INCLUDED_QUANTITY(buildId, instrumentId),
    {
      method: "PUT",
      body: JSON.stringify(newQuantity),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update included quantity");
  }

  revalidatePath(`/build-screen/${buildId}`);
  return response.json();
}

/**
 * Update missing quantity for an item in a build
 */
export async function updateMissingQuantity(
  buildId: string,
  instrumentId: string,
  newQuantity: number
): Promise<InstrumentSetBuild> {
  const response = await fetchWithAuth(
    API_ENDPOINTS.ASSEMBLY.UPDATE_MISSING_QUANTITY(buildId, instrumentId),
    {
      method: "PUT",
      body: JSON.stringify(newQuantity),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update missing quantity");
  }

  revalidatePath(`/build-screen/${buildId}`);
  return response.json();
}

/**
 * Pause a build
 */
export async function pauseBuild(buildId: string): Promise<void> {
  const response = await fetchWithAuth(
    API_ENDPOINTS.ASSEMBLY.PAUSE_BUILD(buildId),
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to pause build");
  }

  revalidatePath("/assembly");
}

/**
 * Resume a build
 */
export async function resumeBuild(buildId: string): Promise<void> {
  const response = await fetchWithAuth(
    API_ENDPOINTS.ASSEMBLY.RESUME_BUILD(buildId),
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to resume build");
  }
}

/**
 * Complete a build
 */
export async function completeBuild(buildId: string): Promise<void> {
  const response = await fetchWithAuth(
    API_ENDPOINTS.ASSEMBLY.COMPLETE_BUILD(buildId),
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to complete build");
  }

  revalidatePath("/assembly");
}
