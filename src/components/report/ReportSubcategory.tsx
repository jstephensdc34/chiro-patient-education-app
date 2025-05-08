
import { ReportItem as ReportItemType } from "@/types";
import { ReportItem } from "./ReportItem";

interface ReportSubcategoryProps {
  title: string;
  items: ReportItemType[];
}

export const ReportSubcategory = ({ title, items }: ReportSubcategoryProps) => {
  if (items.length === 0) return null;
  
  return (
    <div className="ml-2">
      <h4 className="font-medium text-medical-600 mb-2">
        {title}
      </h4>
      <ul className="space-y-3 ml-4">
        {items.map(item => (
          <ReportItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
};
