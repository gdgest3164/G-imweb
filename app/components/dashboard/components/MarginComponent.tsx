import { MarginComponent as MarginComponentType } from "@/lib/types/landing";

interface MarginComponentProps {
  component: MarginComponentType;
  isSelected: boolean;
}

export function MarginComponent({ component, isSelected }: MarginComponentProps) {
  return (
    <div
      className={`
        ${component.tailwindClasses || "w-full h-10"}
        ${isSelected ? "outline outline-1 outline-dashed outline-gray-800" : ""}
        hover:outline hover:outline-1 hover:outline-dashed hover:outline-gray-400
      `}
    />
  );
}
