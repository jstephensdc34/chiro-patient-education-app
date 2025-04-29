
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReportItem, CategoryType } from "@/types";

interface ItemFormProps {
  activeCategory: CategoryType;
  onSaveItem: (item: Partial<ReportItem> | ReportItem) => void;
  editingItem: ReportItem | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export const ItemForm = ({
  activeCategory,
  onSaveItem,
  editingItem,
  isDialogOpen,
  setIsDialogOpen,
}: ItemFormProps) => {
  const [item, setItem] = useState<Partial<ReportItem>>({ categoryId: activeCategory });

  // Update the item when editingItem changes or when activeCategory changes and not editing
  useState(() => {
    if (editingItem) {
      setItem(editingItem);
    } else {
      setItem({ categoryId: activeCategory });
    }
  });

  const handleChange = (field: keyof ReportItem, value: string) => {
    setItem(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSaveItem(item);
    setItem({ categoryId: activeCategory });
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
              value={editingItem?.name || item.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editingItem?.description || item.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="infoLink">Information Link (Optional)</Label>
            <Input
              id="infoLink"
              type="url"
              placeholder="https://example.com"
              value={editingItem?.infoLink || item.infoLink || ""}
              onChange={(e) => handleChange("infoLink", e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-medical-600" onClick={handleSave}>
              {editingItem ? "Save Changes" : "Add Item"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
