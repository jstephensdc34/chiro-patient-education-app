
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryType, MAIN_CATEGORIES, ReportItem, Category, Subcategory } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthContext";
import { ItemForm } from "@/components/library/ItemForm";
import { ItemsList } from "@/components/library/ItemsList";
import { 
  fetchCategories, 
  fetchSubcategories, 
  fetchItemsByCategory,
  createItem,
  updateItem,
  deleteItem
} from "@/services/libraryService";
import { Loader2 } from "lucide-react";

const Library = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("diagnosis");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>("general_diagnosis");
  const [items, setItems] = useState<ReportItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [newItem, setNewItem] = useState<Partial<ReportItem>>({ categoryId: activeCategory });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReportItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [fetchedCategories, fetchedSubcategories] = await Promise.all([
          fetchCategories(),
          fetchSubcategories()
        ]);
        
        setCategories(fetchedCategories);
        setSubcategories(fetchedSubcategories);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast({
          title: "Error",
          description: "Failed to load categories and subcategories.",
          variant: "destructive",
        });
      }
    };
    
    loadInitialData();
  }, [toast]);

  // Reset subcategory selection when category changes
  useEffect(() => {
    if (activeCategory === "diagnosis") {
      setActiveSubcategory("general_diagnosis");
    } else if (activeCategory === "extremity") {
      setActiveSubcategory("shoulder");
    } else if (activeCategory === "treatment") {
      setActiveSubcategory("care_plan_type");
    } else if (activeCategory === "homecare") {
      setActiveSubcategory("home_therapy");
    } else if (activeCategory === "exercises") {
      setActiveSubcategory("cervical_exercises");
    } else {
      setActiveSubcategory(null);
    }
  }, [activeCategory]);

  // Fetch items when category or subcategory changes
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const fetchedItems = await fetchItemsByCategory(activeCategory, activeSubcategory || undefined);
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast({
          title: "Error",
          description: "Failed to load library items.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (activeCategory && categories.length > 0) {
      loadItems();
    }
  }, [activeCategory, activeSubcategory, categories, toast]);

  const handleSaveItem = async (item: Partial<ReportItem> | ReportItem) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save items to the library.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if ('id' in item && item.id) {
        // Update existing item
        const updatedItem = await updateItem(item as ReportItem);
        setItems(items.map(existingItem => 
          existingItem.id === updatedItem.id ? updatedItem : existingItem
        ));
        
        toast({
          title: "Item Updated",
          description: `${updatedItem.name} has been updated successfully.`
        });
      } else if (item.name && item.description) {
        // Create new item
        const newItemData: Omit<ReportItem, "id"> = {
          name: item.name,
          description: item.description,
          infoLink: item.infoLink,
          categoryId: activeCategory,
          subcategoryId: (activeCategory === "diagnosis" || activeCategory === "extremity" || 
                          activeCategory === "treatment" || activeCategory === "homecare" ||
                          activeCategory === "exercises") 
            ? item.subcategoryId || activeSubcategory || undefined
            : undefined
        };
        
        const createdItem = await createItem(newItemData);
        setItems([...items, createdItem]);
        
        toast({
          title: "Item Added",
          description: `${createdItem.name} has been added to ${getCategoryName(activeCategory)}.`
        });
      }
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        title: "Error",
        description: "Failed to save the item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setNewItem({ categoryId: activeCategory });
      setEditingItem(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete items from the library.",
        variant: "destructive",
      });
      return;
    }
    
    const itemToDelete = items.find(item => item.id === id);
    
    try {
      await deleteItem(id);
      setItems(items.filter(item => item.id !== id));
      
      toast({
        title: "Item Deleted",
        description: `${itemToDelete?.name} has been removed.`,
        variant: "destructive"
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete the item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (item: ReportItem) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to edit items in the library.",
        variant: "destructive",
      });
      return;
    }
    
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
    return subcategories.filter(subcat => subcat.parentCategoryId === categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Report Library</h1>
          <Button 
            className="bg-medical-600 hover:bg-medical-700"
            onClick={() => {
              if (!isAuthenticated) {
                toast({
                  title: "Authentication Required",
                  description: "Please log in to add items to the library.",
                  variant: "destructive",
                });
                return;
              }
              
              setEditingItem(null);
              setNewItem({ 
                categoryId: activeCategory,
                subcategoryId: (activeCategory === "diagnosis" || activeCategory === "extremity" || 
                               activeCategory === "treatment" || activeCategory === "homecare" ||
                               activeCategory === "exercises") 
                  ? activeSubcategory 
                  : undefined 
              });
              setIsDialogOpen(true);
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add New Item"
            )}
          </Button>
        </div>

        {categories.length > 0 ? (
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
                {(category === "diagnosis" || category === "extremity" || 
                  category === "treatment" || category === "homecare" ||
                  category === "exercises") && (
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
                
                {isLoading ? (
                  <div className="flex justify-center items-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-medical-600" />
                    <span className="ml-2 text-lg text-medical-600">Loading items...</span>
                  </div>
                ) : (
                  <ItemsList 
                    items={items}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    categoryName={getCategoryName(category)}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-medical-600" />
            <span className="ml-2 text-lg text-medical-600">Loading categories...</span>
          </div>
        )}

        <ItemForm 
          activeCategory={activeCategory}
          onSaveItem={handleSaveItem}
          editingItem={editingItem}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          isSubmitting={isSubmitting}
          availableSubcategories={getSubcategoriesForCategory(activeCategory)}
        />
      </div>
    </div>
  );
};

export default Library;
