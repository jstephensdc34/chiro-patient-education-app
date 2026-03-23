import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, Check, Loader2, Link } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ShareReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string | null;
  isLoading: boolean;
  onShare: () => void;
}

export const ShareReportDialog = ({
  open,
  onOpenChange,
  shareUrl,
  isLoading,
  onShare,
}: ShareReportDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "The report link has been copied to your clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Report</DialogTitle>
          <DialogDescription>
            Generate a shareable link to send to your patient.
          </DialogDescription>
        </DialogHeader>

        {!shareUrl && !isLoading && (
          <Button onClick={onShare} className="w-full bg-medical-700 hover:bg-medical-800">
            <Link className="mr-2 h-4 w-4" />
            Generate Shareable Link
          </Button>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-medical-700 mr-2" />
            <span>Generating report link...</span>
          </div>
        )}

        {shareUrl && (
          <div className="flex items-center gap-2">
            <Input value={shareUrl} readOnly className="flex-1 text-sm" />
            <Button size="icon" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
