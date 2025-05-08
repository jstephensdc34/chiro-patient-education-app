
import { ReportItem } from '@/types';
import { sanitizeHtml } from '@/components/ui/rich-text-editor';

export const renderReportItem = (item: ReportItem): string => {
  // Add a specific class to track and ensure links are working properly
  return `
    <li>
      <div class="item-name">
        ${item.name}
        ${item.infoLink ? `<a href="${item.infoLink}" class="info-link" target="_blank" rel="noopener">[info]</a>` : ''}
      </div>
      ${item.description ? `<div class="item-description">${sanitizeHtml(item.description)}</div>` : ''}
      ${item.infoLink ? `<div class="item-link">For more detailed information go to: <a href="${item.infoLink}" target="_blank" rel="noopener">${item.infoLink}</a> or click the info link above</div>` : ''}
    </li>
  `;
};
