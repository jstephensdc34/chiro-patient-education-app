
import { ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InfoLinkProps {
  link: string;
}

export const InfoLink = ({ link }: InfoLinkProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center ml-2 text-medical-600 hover:text-medical-800"
        >
          <ExternalLink size={14} />
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>View more information</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
