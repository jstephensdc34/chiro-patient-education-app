
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryType, MAIN_CATEGORIES, ReportItem } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { ItemForm } from "@/components/library/ItemForm";
import { ItemsList } from "@/components/library/ItemsList";
import { mockItems, mockCategories, mockSubcategories } from "@/services/libraryService";

const Library = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("diagnosis");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>("general_diagnosis");
  const [items, setItems] = useState<ReportItem[]>(mockItems);
  const [categories] = useState(mockCategories);
  const [newItem, setNewItem] = useState<Partial<ReportItem>>({ categoryId: activeCategory });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReportItem | null>(null);
  const { toast } = useToast();

  // Reset subcategory selection when category changes
  useEffect(() => {
    if (activeCategory === "diagnosis") {
      setActiveSubcategory("general_diagnosis");
    } else {
      setActiveSubcategory(null);
    }
  }, [activeCategory]);

  const handleSaveItem = (item: Partial<ReportItem> | ReportItem) => {
    if ('id' in item && item.id) {
      // Update existing item
      const updatedItems = items.map(existingItem => 
        existingItem.id === item.id ? item as ReportItem : existingItem
      );
      setItems(updatedItems);
      toast({
        title: "Item Updated",
        description: `${item.name} has been updated successfully.`
      });
    } else if (item.name && item.description) {
      // Create new item
      const newId = Math.random().toString(36).substr(2, 9);
      const itemToAdd: ReportItem = {
        id: newId,
        name: item.name,
        description: item.description,
        infoLink: item.infoLink,
        categoryId: activeCategory,
        subcategoryId: activeCategory === "diagnosis" ? item.subcategoryId || activeSubcategory : undefined
      };
      setItems([...items, itemToAdd]);
      toast({
        title: "Item Added",
        description: `${item.name} has been added to ${getCategoryName(activeCategory)}.`
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

  // Handle subcategory selection
  const handleSubcategoryClick = (subcategoryId: string) => {
    setActiveSubcategory(subcategoryId);
  };

  // Get subcategories for the active category
  const getSubcategoriesForCategory = (categoryId: string) => {
    return mockSubcategories.filter(subcat => subcat.parentCategoryId === categoryId);
  };

  // Filter items based on category and subcategory
  const getFilteredItems = () => {
    if (activeCategory === "diagnosis" && activeSubcategory) {
      return items.filter(item => 
        item.categoryId === activeCategory && 
        item.subcategoryId === activeSubcategory
      );
    }
    return items.filter(item => item.categoryId === activeCategory);
  };

  const categoryItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Report Library</h1>
          <Button 
            className="bg-medical-600 hover:bg-medical-700"
            onClick={() => {
              setEditingItem(null);
              setNewItem({ 
                categoryId: activeCategory,
                subcategoryId: activeCategory === "diagnosis" ? activeSubcategory : undefined 
              });
              setIsDialogOpen(true);
            }}
          >
            Add New Item
          </Button>
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
              {category === "diagnosis" && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-md">
                    {getSubcategoriesForCategory(category).map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => handleSubcategoryClick(subcategory.id)}
                        className={`px-4 py-2 text-sm rounded-md transition-colors ${
                          activeSubcategory === subcategory.id 
                            ? 'bg-medical-100 text-medical-700' 
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <ItemsList 
                items={categoryItems}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                categoryName={getCategoryName(category)}
              />
            </TabsContent>
          ))}
        </Tabs>

        <ItemForm 
          activeCategory={activeCategory}
          onSaveItem={handleSaveItem}
          editingItem={editingItem}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
    </div>
  );
};

export default Library;
