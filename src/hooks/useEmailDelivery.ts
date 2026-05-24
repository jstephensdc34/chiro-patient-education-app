import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EmailDeliveryStatus } from "@/types";

export interface EmailReportPayload {
  recipientEmail: string;
  subject?: string;
  patientName: string;
  clinicName: string;
  clinicEmail?: string;
  clinicPhone?: string;
  clinicWebsite?: string;
  logoUrl?: string;
  fullReportUrl: string;
  overviewReportUrl: string;
}

export const useEmailDelivery = () => {
  const { toast } = useToast();
  const [emailStatus, setEmailStatus] = useState<EmailDeliveryStatus>({
    status: 'idle',
    progress: 0
  });

  const sendEmailReport = async (emailData: EmailReportPayload) => {
    setEmailStatus({ status: 'preparing', progress: 10 });

    try {
      if (!emailData.recipientEmail || !emailData.recipientEmail.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      setEmailStatus({ status: 'sending', progress: 50 });

      const { data, error } = await supabase.functions.invoke('send-report-email', {
        body: emailData
      });

      if (error) {
        throw error;
      }

      setEmailStatus({ status: 'sent', progress: 100 });

      toast({
        title: "Email Sent Successfully",
        description: `Report for ${emailData.patientName} has been sent to ${emailData.recipientEmail}`,
      });

      return data;
    } catch (error) {
      console.error("Error sending email:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send email";

      setEmailStatus({
        status: 'error',
        progress: 0,
        error: errorMessage
      });

      toast({
        title: "Email Delivery Failed",
        description: errorMessage,
        variant: "destructive"
      });

      throw error;
    }
  };

  const resetEmailStatus = () => {
    setEmailStatus({ status: 'idle', progress: 0 });
  };

  return {
    emailStatus,
    sendEmailReport,
    resetEmailStatus
  };
};
