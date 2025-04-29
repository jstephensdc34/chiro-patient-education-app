
export interface ReportItem {
  id: string;
  name: string;
  description: string;
  infoLink?: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  description?: string;
}

export interface PatientInfo {
  name: string;
  age?: number;
  gender?: string;
  date: string;
}

export interface ReportData {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes?: string;
}

export type CategoryType = 'diagnosis' | 'treatment' | 'homecare' | 'exercises';

export const MAIN_CATEGORIES: CategoryType[] = ['diagnosis', 'treatment', 'homecare', 'exercises'];
