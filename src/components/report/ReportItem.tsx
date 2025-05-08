
import { ReportItem as ReportItemType } from "@/types";
import { InfoLink } from "./InfoLink";
import { sanitizeHtml } from "@/components/ui/rich-text-editor";

interface ReportItemProps {
  item: ReportItemType;
}

export const ReportItem = ({ item }: ReportItemProps) => {
  return (
    <li key={item.id} className="ml-4">
      <div className="font-medium">
        • {item.name}
        {item.infoLink && <InfoLink link={item.infoLink} />}
      </div>
      {item.description && (
        <div 
          className="prose prose-sm text-gray-600 mt-1 ml-4 text-sm"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description) }}
        />
      )}
      {item.infoLink && (
        <div className="text-xs text-medical-500 italic mt-1 ml-4">
          For more detailed information go to: {item.infoLink}
        </div>
      )}
    </li>
  );
};
