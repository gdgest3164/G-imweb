import { LandingComponent } from "@/lib/types/landing";

interface BorderRadiusPropertiesProps {
  max?: number;
  component: Extract<LandingComponent, { borderRadius?: number }>;
  onChange: (updatedComponent: LandingComponent) => void;
}

export default function BorderRadiusProperties({ component, onChange, max = 1000 }: BorderRadiusPropertiesProps) {
  return (
    <div>
      <label className="block text-sm mb-1">테두리 둥글기</label>
      <input
        type="number"
        min="0"
        max={max}
        value={component.borderRadius || 0}
        onChange={(e) => onChange({ ...component, borderRadius: Math.min(1000, Math.max(0, parseInt(e.target.value) || 0)) })}
        className="w-full p-2 border rounded bg-white dark:text-white dark:bg-gray-600 dark:border-gray-400"
      />
    </div>
  );
}
