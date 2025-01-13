import { LandingComponent } from "@/lib/types/landing";

interface MarginPropertiesProps {
  component: Extract<LandingComponent, { type: "margin" }>;
  onChange: (component: LandingComponent) => void;
}

export function MarginProperties({ component, onChange }: MarginPropertiesProps) {
  return (
    <div>
      <label className="block text-sm mb-1">여백 높이</label>
      <select
        value={component.tailwindClasses?.match(/h-\d+/)?.[0] || "h-10"}
        onChange={(e) =>
          onChange({
            ...component,
            tailwindClasses: `w-full ${e.target.value}`,
          })
        }
        className="select select-bordered w-full"
      >
        <option value="h-4">16px</option>
        <option value="h-10">40px</option>
        <option value="h-16">64px</option>
        <option value="h-20">80px</option>
        <option value="h-24">96px</option>
      </select>
    </div>
  );
}
