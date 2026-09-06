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
          className="text-xs text-primary-foreground/90 hover:text-primary-foreground underline ml-1 cursor-pointer"
        >
          [info]
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>Open more information ({link})</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
