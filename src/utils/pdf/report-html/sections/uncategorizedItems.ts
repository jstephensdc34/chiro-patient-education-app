
import { ReportItem } from '@/types';
import { renderReportItem } from './reportItem';

export const renderUncategorizedItems = (items: ReportItem[]): string => {
  return `
    <div class="subcategory">
      <h4 class="subcategory-title">
        Other
      </h4>
      <ul>
        ${items.map(item => renderReportItem(item)).join('')}
      </ul>
    </div>
  `;
};
