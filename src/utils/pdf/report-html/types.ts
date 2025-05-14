
import { PatientInfo, ReportItem } from '@/types';
import { ReportSetting } from '@/services/reportSettingsService';

export interface GenerateReportHtmlParams {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes: string;
  settings: ReportSetting[];
  subcategories: any[];
}

export interface ReportSection {
  categoryId: string;
  categoryName: string;
  items: ReportItem[];
}

export interface ReportContext {
  categoryNames: Record<string, string>;
  subcategories: any[];
  getSubcategoryName: (subcategoryId: string) => string;
}
