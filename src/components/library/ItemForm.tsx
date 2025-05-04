
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ReportItem, CategoryType } from "@/types";
import { Loader2 } from "lucide-react";

interface Subcategory {
  id: string;
  name: string;
  parentCategoryId?: string;
  description?: string;
}

interface ItemFormProps {
  activeCategory: CategoryType;
  onSaveItem: (item: Partial<ReportItem> | ReportItem) => void;
  editingItem: ReportItem | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  isSubmitting?: boolean;
  availableSubcategories: Subcategory[];
}

export const ItemForm = ({
  activeCategory,
  onSaveItem,
  editingItem,
  isDialogOpen,
  setIsDialogOpen,
  isSubmitting = false,
  availableSubcategories,
}: ItemFormProps) => {
  const [item, setItem] = useState<Partial<ReportItem>>({ categoryId: activeCategory });
  
  // Update the item when editingItem changes or when activeCategory changes and not editing
  useEffect(() => {
    if (editingItem) {
      setItem(editingItem);
    } else {
      setItem({ categoryId: activeCategory });
    }
  }, [editingItem, activeCategory]);

  const handleChange = (field: keyof ReportItem, value: string) => {
    setItem(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // For categories with subcategories, ensure there's a subcategory
    if ((activeCategory === "diagnosis" || activeCategory === "extremity" || 
         activeCategory === "treatment" || activeCategory === "homecare" ||
         activeCategory === "exercises") && 
        !item.subcategoryId && 
        availableSubcategories.length > 0) {
      setItem(prev => ({ 
        ...prev, 
        subcategoryId: availableSubcategories[0].id 
      }));
    }
    
    onSaveItem(item);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={item.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          {availableSubcategories.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select
                value={item.subcategoryId}
                onValueChange={(value) => handleChange("subcategoryId", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={item.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="infoLink">Information Link (Optional)</Label>
            <Input
              id="infoLink"
              type="url"
              placeholder="https://example.com"
              value={item.infoLink || ""}
              onChange={(e) => handleChange("infoLink", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              className="bg-medical-600" 
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingItem ? "Saving..." : "Adding..."}
                </>
              ) : (
                editingItem ? "Save Changes" : "Add Item"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
