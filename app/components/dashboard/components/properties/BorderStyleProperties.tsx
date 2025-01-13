import { LandingComponent } from "@/lib/types/landing";
import { ColorProperties } from "./ColorProperties";

type BorderStyleType = "none" | "solid" | "dotted" | "dashed" | "double";

interface BorderStylePropertiesProps {
  component: LandingComponent;
  onChange: (updatedComponent: LandingComponent) => void;
}

export default function BorderStyleProperties({ component, onChange }: BorderStylePropertiesProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">선 스타일</label>
        <select
          value={component.borderStyle || "none"}
          onChange={(e) => onChange({ ...component, borderStyle: e.target.value as BorderStyleType })}
          className="w-full p-2 border rounded bg-white dark:text-white dark:bg-gray-600 dark:border-gray-400"
        >
          <option value="none">없음</option>
          <option value="solid">실선</option>
          <option value="dotted">점선</option>
          <option value="dashed">긴점선</option>
          <option value="double">두줄선</option>
        </select>
      </div>

      {component.borderStyle && component.borderStyle !== "none" && (
        <>
          <div>
            <label className="block text-sm mb-1">선 두께</label>
            <input
              type="number"
              min="0"
              max="10"
              value={component.borderWidth || 1}
              onChange={(e) => onChange({ ...component, borderWidth: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)) })}
              className="w-full p-2 border rounded bg-white dark:text-white dark:bg-gray-600 dark:border-gray-400"
            />
          </div>

          <ColorProperties
            label="선 색상"
            color={component.borderColor}
            opacity={typeof component.borderOpacity === "string" ? parseFloat(component.borderOpacity) : component.borderOpacity ?? 1}
            componentId={`border-${component.id}`}
            onChange={(color, opacity) =>
              onChange({
                ...component,
                borderColor: color,
                borderOpacity: opacity,
              })
            }
          />
        </>
      )}
    </div>
  );
}
