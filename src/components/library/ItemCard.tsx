
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportItem } from "@/types";
import { sanitizeHtml } from "@/components/ui/rich-text-editor";

interface ItemCardProps {
  item: ReportItem;
  onEdit: (item: ReportItem) => void;
  onDelete: (id: string) => void;
}

export const ItemCard = ({ item, onEdit, onDelete }: ItemCardProps) => {
  return (
    <Card className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="bg-gray-50 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          {item.subcategoryId && (
            <Badge variant="outline" className="bg-medical-50 text-medical-700 border-medical-200">
              {/* The subcategory name will come directly from the server */}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div 
          className="text-gray-600 mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description) }}
        />
        <div className="flex space-x-2">
          {item.infoLink && (
            <Button variant="outline" size="sm" className="text-medical-600" asChild>
              <a href={item.infoLink} target="_blank" rel="noopener noreferrer">
                Info Link
              </a>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-amber-600"
            onClick={() => onEdit(item)}
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600"
            onClick={() => onDelete(item.id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
