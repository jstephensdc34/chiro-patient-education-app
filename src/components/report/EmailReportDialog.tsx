import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  }) => void;
}

export const EmailReportDialog = ({
  open,
  onOpenChange,
  patientName,
  defaultEmail = "",
  emailStatus,
  onSendEmail,
}: EmailReportDialogProps) => {
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState(
    `Your Clinical Report of Findings & Care Plan${patientName ? ` – ${patientName}` : ""}`
  );

  const handleSendEmail = () => {
    onSendEmail({ recipientEmail, subject });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Email Report</DialogTitle>
          <DialogDescription>
            The recipient will receive a short email with secure links to view the Overview and Full reports online.
          </DialogDescription>
        </DialogHeader>

        {emailStatus.status === "idle" || emailStatus.status === "error" ? (
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

            {emailStatus.status === "error" && (
              <div className="text-red-600 text-sm">{emailStatus.error}</div>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={!recipientEmail || !recipientEmail.includes("@")}
              >
                Send Email
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
