import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyAccordionProps {
  title: string;
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function PropertyAccordion({ title, children, className = "", isOpen, onToggle }: PropertyAccordionProps) {
  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <button className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors" onClick={onToggle}>
        <h3 className="text-sm font-medium">{title}</h3>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen ? "transform rotate-180" : "")} />
      </button>
      {isOpen && <div className="p-4 border-t">{children}</div>}
    </div>
  );
}
