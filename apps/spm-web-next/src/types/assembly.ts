/**
 * Assembly Types
 * TypeScript interfaces for Assembly API responses
 */

export interface Location {
  name: string | null;
}

export interface UserInfo {
  id?: string | null;
  name?: string | null;
  user?: string | null;
}

export interface ItemInfo {
  id?: string | null;
  name?: string | null;
  description?: string | null;
}

export interface ProcessAction {
  id?: string | null;
  processStage?: string | null;
  timestamp?: string | null;
}

export interface RecentScan {
  id: string | null;
  barcode: string;
  userInfo: UserInfo | null;
  itemInfo: ItemInfo | null;
  date: string;
  location: Location | null;
  processAction: ProcessAction | null;
  stage: string | null;
}

export interface InstrumentSetBuildItem {
  instrumentId: string;
  instrumentName: string;
  manufacturer?: string;
  barcode: string;
  expectedQuantity: number;
  includedQuantity: number;
  missingQuantity: number;
  groupName: string | null;
}

export interface InstrumentSet {
  id: string;
  name: string;
  barcode: string;
}

export interface InstrumentSetBuild {
  id: string;
  instrumentSetJourneyId: string | null;
  items: InstrumentSetBuildItem[];
  name: string;
  buildDate: Date | string | null;
  barcode: string;
  user: string;
  location: string;
  status: number;
  currentStage: number;
}

export interface StartBuildResponse {
  buildId: string;
  status: string;
}

export interface Tenant {
  id: string;
  name: string;
  displayName: string;
}
