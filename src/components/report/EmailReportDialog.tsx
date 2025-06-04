
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmailDeliveryStatus } from "@/types";
import { EmailDeliveryProgress } from "./EmailDeliveryProgress";

interface EmailReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  defaultEmail?: string;
  emailStatus: EmailDeliveryStatus;
  onSendEmail: (emailData: {
    recipientEmail: string;
    subject: string;
    message: string;
  }) => void;
}

export const EmailReportDialog = ({
  open,
  onOpenChange,
  patientName,
  defaultEmail = "",
  emailStatus,
  onSendEmail
}: EmailReportDialogProps) => {
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState(`Medical Report for ${patientName}`);
  const [message, setMessage] = useState(`Dear Patient,

Please find your medical report below. This report contains important information about your consultation and treatment plan.

If you have any questions about this report, please don't hesitate to contact our office.

Best regards,
Your Healthcare Team`);

  const handleSendEmail = () => {
    onSendEmail({
      recipientEmail,
      subject,
      message
    });
  };

  const isLoading = emailStatus.status === 'preparing' || emailStatus.status === 'sending';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Email Report</DialogTitle>
        </DialogHeader>
        
        {emailStatus.status === 'idle' || emailStatus.status === 'error' ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="recipientEmail">Recipient Email*</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="patient@example.com"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            
            {emailStatus.status === 'error' && (
              <div className="text-red-600 text-sm">
                {emailStatus.error}
              </div>
            )}
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendEmail}
                disabled={!recipientEmail || !recipientEmail.includes('@')}
              >
                Send Email Report
              </Button>
            </div>
          </div>
        ) : (
          <EmailDeliveryProgress status={emailStatus} />
        )}
      </DialogContent>
    </Dialog>
  );
};
