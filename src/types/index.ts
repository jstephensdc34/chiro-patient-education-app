
export interface ReportItem {
  id: string;
  name: string;
  description: string;
  infoLink?: string;
  categoryId: string;
  subcategoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  description?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  parentCategoryId: string;
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

export type CategoryType = 'diagnosis' | 'extremity' | 'treatment' | 'homecare' | 'exercises';

export const MAIN_CATEGORIES: CategoryType[] = ['diagnosis', 'extremity', 'treatment', 'homecare', 'exercises'];

export const DIAGNOSIS_SUBCATEGORIES = [
  'general_diagnosis',
  'cervical_diagnosis',
  'thoracic_diagnosis',
  'lumbopelvic_diagnosis'
];

export const EXTREMITY_SUBCATEGORIES = [
  'shoulder',
  'elbow',
  'wrist_hand',
  'hip',
  'knee',
  'ankle_foot'
];
