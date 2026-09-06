
import { reportColors } from "@/utils/reportColorTokens";

const sectionColors = reportColors;

export const getSectionColors = (categoryId: string) => sectionColors[categoryId] || sectionColors.diagnosis;

export const getReportStyles = (): string => {
  return `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.5; color: ${reportColors.foreground}; margin: 0; padding: 0; }
      
      .page-container {
        width: 210mm;
        min-height: 297mm;
        padding: 15mm 15mm 20mm 15mm;
        margin: 0 auto 5mm auto;
        background-color: ${reportColors.card};
        box-shadow: 0 0 10px hsl(0 0% 0% / 0.1);
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
        page-break-after: always;
        break-after: page;
      }
      
      @media screen {
        body { background: ${reportColors.background}; padding: 20px 0; }
        .page-container { border: 1px solid ${reportColors.border}; }
      }
      
      @media print {
        .page-container { box-shadow: none; margin: 0; page-break-after: always; break-after: page; }
      }
      
      .page-number { position: absolute; bottom: 10mm; width: 100%; left: 0; text-align: center; font-size: 10px; color: ${reportColors.mutedForeground}; }
      
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid ${reportColors.border}; padding-bottom: 10px; }
      .header-content { flex-grow: 1; margin-left: 20px; }
      .clinic-name { font-size: 20px; margin: 0; color: ${reportColors.foreground}; font-weight: bold; }
      .clinic-info { font-size: 14px; margin: 5px 0; color: ${reportColors.mutedForeground}; }
      .patient-name { font-size: 18px; margin-bottom: 10px; font-weight: bold; }
      .patient-info { font-size: 14px; margin-bottom: 20px; color: ${reportColors.mutedForeground}; }
      .logo { max-height: 80px; max-width: 200px; }

      /* Section header bar */
      .section-header {
        border-radius: 8px;
        padding: 10px 16px;
        margin-bottom: 12px;
      }
      .section-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
        color: ${reportColors.primaryForeground};
      }

      /* Item card */
      .item-card {
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 10px;
        box-shadow: 0 1px 2px hsl(0 0% 0% / 0.05);
      }
      .item-card-header {
        padding: 8px 16px;
      }
      .item-card-header h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: ${reportColors.primaryForeground};
        display: inline;
      }
      .item-card-body {
        padding: 12px 16px;
      }
      .item-card-body .definition {
        margin: 0 0 6px 0;
        font-size: 13px;
        color: ${reportColors.foreground};
      }
      .item-card-body .description {
        font-size: 13px;
        color: ${reportColors.mutedForeground};
        margin: 0 0 6px 0;
      }

      .category-section { margin-bottom: 24px; }

      .info-link { font-size: 11px; color: ${reportColors.primaryForeground}; text-decoration: none; margin-left: 5px; opacity: 0.9; }
      .info-link:hover { text-decoration: underline; }

      .notes-section { margin-top: 20px; }
      .notes-title { font-size: 16px; color: ${reportColors.primaryAccent}; margin-bottom: 10px; font-weight: bold; }
      .notes-content { white-space: pre-wrap; font-size: 14px; }

      a { color: ${reportColors.primaryAccent}; text-decoration: none; }
      a[target="_blank"]::after { content: ""; margin-left: 3px; }
    </style>
  `;
};
