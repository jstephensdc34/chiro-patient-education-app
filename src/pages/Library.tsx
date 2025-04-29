
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryType, MAIN_CATEGORIES, ReportItem, Category } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { useToast } from "@/components/ui/use-toast";

// Mock data - would be replaced with Supabase fetch
const mockItems: ReportItem[] = [
  { id: "1", name: "Cervical Sprain/Strain", description: "Stretch injury to the ligaments or muscles of the neck", infoLink: "https://www.spine-health.com/conditions/neck-pain/cervical-sprain-and-strain", categoryId: "diagnosis" },
  { id: "2", name: "Lumbar Disc Herniation", description: "Protrusion of the intervertebral disc material in lumbar spine", infoLink: "https://www.spine-health.com/conditions/herniated-disc/lumbar-herniated-disc", categoryId: "diagnosis" },
  { id: "3", name: "Spinal Manipulation", description: "High-velocity, low-amplitude thrust to spinal joints", infoLink: "https://www.spine-health.com/treatment/chiropractic/spinal-manipulation-and-chiropractic-care", categoryId: "treatment" },
  { id: "4", name: "Ice Therapy", description: "Application of ice to reduce inflammation", infoLink: "https://www.spine-health.com/treatment/pain-management/ice-packs-back-pain-relief", categoryId: "homecare" },
  { id: "5", name: "McKenzie Extensions", description: "Extension-based exercises for disc problems", infoLink: "https://www.spine-health.com/treatment/physical-therapy/mckenzie-therapy-mechanical-diagnosis-and-therapy-back-pain", categoryId: "exercises" }
];

const mockCategories: Category[] = [
  { id: "diagnosis", name: "Spinal Diagnosis", description: "Clinical diagnoses" },
  { id: "treatment", name: "Treatment Plan", description: "In-office procedures" },
  { id: "homecare", name: "Home Care", description: "At-home recommendations" },
  { id: "exercises", name: "Therapeutic Exercises", description: "Rehabilitative movements" }
];

const Library = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("diagnosis");
  const [items, setItems] = useState<ReportItem[]>(mockItems);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [newItem, setNewItem] = useState<Partial<ReportItem>>({ categoryId: activeCategory });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReportItem | null>(null);
  const { toast } = useToast();

  const handleSaveItem = () => {
    if (editingItem) {
      // Update existing item
      const updatedItems = items.map(item => 
        item.id === editingItem.id ? { ...editingItem } : item
      );
      setItems(updatedItems);
      toast({
        title: "Item Updated",
        description: `${editingItem.name} has been updated successfully.`
      });
    } else if (newItem.name && newItem.description) {
      // Create new item
      const newId = Math.random().toString(36).substr(2, 9);
      const itemToAdd: ReportItem = {
        id: newId,
        name: newItem.name,
        description: newItem.description,
        infoLink: newItem.infoLink,
        categoryId: activeCategory
      };
      setItems([...items, itemToAdd]);
      toast({
        title: "Item Added",
        description: `${newItem.name} has been added to ${getCategoryName(activeCategory)}.`
      });
    }
    
    setNewItem({ categoryId: activeCategory });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    setItems(items.filter(item => item.id !== id));
    
    toast({
      title: "Item Deleted",
      description: `${itemToDelete?.name} has been removed.`,
      variant: "destructive"
    });
  };

  const handleEditItem = (item: ReportItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const categoryItems = items.filter(item => item.categoryId === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Report Library</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-medical-600 hover:bg-medical-700"
                onClick={() => {
                  setEditingItem(null);
                  setNewItem({ categoryId: activeCategory });
                }}
              >
                Add New Item
              </Button>
            </DialogTrigger>
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
                    value={editingItem?.name || newItem.name || ""}
                    onChange={(e) => {
                      if (editingItem) {
                        setEditingItem({ ...editingItem, name: e.target.value });
                      } else {
                        setNewItem({ ...newItem, name: e.target.value });
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingItem?.description || newItem.description || ""}
                    onChange={(e) => {
                      if (editingItem) {
                        setEditingItem({ ...editingItem, description: e.target.value });
                      } else {
                        setNewItem({ ...newItem, description: e.target.value });
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="infoLink">Information Link (Optional)</Label>
                  <Input
                    id="infoLink"
                    type="url"
                    placeholder="https://example.com"
                    value={editingItem?.infoLink || newItem.infoLink || ""}
                    onChange={(e) => {
                      if (editingItem) {
                        setEditingItem({ ...editingItem, infoLink: e.target.value });
                      } else {
                        setNewItem({ ...newItem, infoLink: e.target.value });
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-medical-600" onClick={handleSaveItem}>
                    {editingItem ? "Save Changes" : "Add Item"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as CategoryType)}>
          <TabsList className="mb-6 bg-white border border-gray-200">
            {MAIN_CATEGORIES.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-medical-100 data-[state=active]:text-medical-800"
              >
                {getCategoryName(category)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {MAIN_CATEGORIES.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.length === 0 ? (
                  <div className="col-span-3 p-8 bg-white rounded-lg border border-gray-200 text-center">
                    <p className="text-gray-500">No items found in this category. Add a new item to get started.</p>
                  </div>
                ) : (
                  categoryItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gray-50 border-b border-gray-100">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-600 mb-4">{item.description}</p>
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
                            onClick={() => handleEditItem(item)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Library;
