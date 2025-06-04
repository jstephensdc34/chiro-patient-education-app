
import { Progress } from "@/components/ui/progress";
import { EmailDeliveryStatus } from "@/types";
import { CheckCircle, AlertCircle, Mail } from "lucide-react";

interface EmailDeliveryProgressProps {
  status: EmailDeliveryStatus;
}

export const EmailDeliveryProgress = ({ status }: EmailDeliveryProgressProps) => {
  const getIcon = () => {
    switch (status.status) {
      case 'preparing':
        return <Mail className="h-6 w-6 text-blue-500 animate-pulse" />;
      case 'sending':
        return <Mail className="h-6 w-6 text-blue-500 animate-pulse" />;
      case 'sent':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Mail className="h-6 w-6 text-gray-400" />;
    }
  };

  const getMessage = () => {
    switch (status.status) {
      case 'preparing':
        return 'Preparing email report...';
      case 'sending':
        return 'Sending email...';
      case 'sent':
        return 'Email sent successfully!';
      case 'error':
        return status.error || 'Failed to send email';
      default:
        return 'Ready to send';
    }
  };

  const getProgressColor = () => {
    switch (status.status) {
      case 'sent':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 py-6">
      {getIcon()}
      
      <div className="text-center">
        <p className="font-medium text-gray-900">{getMessage()}</p>
        {status.message && (
          <p className="text-sm text-gray-600 mt-1">{status.message}</p>
        )}
      </div>
      
      <div className="w-full">
        <Progress 
          value={status.progress} 
          className="h-2"
        />
        <p className="text-xs text-gray-500 text-center mt-1">
          {status.progress}%
        </p>
      </div>
    </div>
  );
};
