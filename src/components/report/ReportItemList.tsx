
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ReportItem } from "@/types";
import { SearchX } from "lucide-react";

interface ReportItemListProps {
  items: ReportItem[];
  selectedItems: string[];
  onToggleItem: (itemId: string) => void;
  activeSearchQuery?: string;
  onClearSearch?: () => void;
}

export const ReportItemList = ({ 
  items, 
  selectedItems, 
  onToggleItem,
  activeSearchQuery = "",
  onClearSearch,
}: ReportItemListProps) => {
  if (items.length === 0) {
    const hasSearch = Boolean(activeSearchQuery.trim());
    return (
      <div className="p-4 text-center text-muted-foreground bg-muted/50 border border-dashed border-border rounded-md space-y-2">
        {hasSearch ? (
          <>
            <SearchX className="h-5 w-5 mx-auto" aria-hidden="true" />
            <p>No {activeSearchQuery.trim() && `"${activeSearchQuery.trim()}"`} matches found here.</p>
            <p className="text-xs">Try a different spelling, or clear the search to see everything in this category.</p>
            {onClearSearch && (
              <Button variant="secondary" size="sm" onClick={onClearSearch}>
                Clear search
              </Button>
            )}
          </>
        ) : (
          <p>No items available in this category. Add items in the Library.</p>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="flex items-center space-x-3 p-3 bg-card border border-border rounded-md">
          <Checkbox
            id={item.id}
            checked={selectedItems.includes(item.id)}
            onCheckedChange={() => onToggleItem(item.id)}
          />
          <Label
            htmlFor={item.id}
            className="font-medium cursor-pointer"
          >
            {item.name}
          </Label>
        </div>
      ))}
    </div>
  );
};
