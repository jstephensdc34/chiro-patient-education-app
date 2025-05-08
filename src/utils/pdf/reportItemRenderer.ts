
import { ReportItem } from '@/types';
import { sanitizeHtml } from '@/components/ui/rich-text-editor';

export const renderReportItem = (item: ReportItem): string => {
  return `
    <li>
      <div class="item-name">${item.name}</div>
      ${item.description ? `<div class="item-description">${sanitizeHtml(item.description)}</div>` : ''}
    </li>
  `;
};
