
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportItem } from "@/types";
import { sanitizeHtml } from "@/components/ui/rich-text-editor";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface ItemCardProps {
  item: ReportItem;
  onEdit: (item: ReportItem) => void;
  onDelete: (id: string) => void;
}

export const ItemCard = ({ item, onEdit, onDelete }: ItemCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      console.log("ItemCard: Deleting item with ID:", item.id);
      await onDelete(item.id);
      console.log("ItemCard: Delete completed successfully");
      
      toast({
        title: "Item Deleted",
        description: `${item.name} has been removed.`,
      });
    } catch (error) {
      console.error("Error in handleDelete:", error);
      
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className="overflow-hidden border-border hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/50 border-b border-border/60">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          {item.subcategoryId && (
            <Badge variant="outline" className="bg-primary-soft text-primary border-primary/20">
              {/* The subcategory name will come directly from the server */}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {item.definition && (
          <div className="mb-3 pb-3 border-b border-border/60">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Definition</p>
            <p className="text-sm text-foreground/80 italic">{item.definition}</p>
          </div>
        )}
        <div className="mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Description</p>
          <div
            className="text-muted-foreground prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description) }}
          />
        </div>
        {item.infoLink && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Info Link</p>
            <a
              href={item.infoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-accent hover:text-primary underline break-all"
            >
              {item.infoLink}
            </a>
          </div>
        )}
        <div className="flex space-x-2">
          {item.infoLink && (
            <Button variant="outline" size="sm" className="text-primary-accent" asChild>
              <a href={item.infoLink} target="_blank" rel="noopener noreferrer">
                Info Link
              </a>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-warning"
            onClick={() => onEdit(item)}
          >
            Edit
          </Button>
          
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete "{item.name}" 
                  from your library.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
