
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InfoLinkProps {
  link: string;
}

export const InfoLink = ({ link }: InfoLinkProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-xs text-medical-600 cursor-pointer ml-1">[info]</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>View more information</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
