import { LandingComponent, TextComponent } from "@/lib/types/landing";
import { Input } from "@/app/components/ui/Input";
import { ChangeEvent } from "react";

interface IndividualPaddingPropertiesProps {
  component: TextComponent;
  onChange: (component: LandingComponent) => void;
  disabled?: boolean;
}

export function IndividualPaddingProperties({ component, onChange, disabled = false }: IndividualPaddingPropertiesProps) {
  if (component.type !== "text") return null;

  const handlePaddingChange = (value: number, key: "paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight") => {
    // 기본 여백 사용 시에는 어떤 여백도 적용되지 않음
    if (component.useDefaultPadding) {
      return;
    }

    // 기본 여백 미사용 시에만 모든 여백 적용
    onChange({
      ...component,
      [key]: value,
    });
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <label className="text-sm font-medium">상단</label>
        <Input
          type="number"
          min={0}
          disabled={disabled || component.useDefaultPadding}
          value={component.useDefaultPadding ? 0 : component.paddingTop ?? 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePaddingChange(parseInt(e.target.value) || 0, "paddingTop")}
        />
      </div>
      <div>
        <label className="text-sm font-medium">하단</label>
        <Input
          type="number"
          min={0}
          disabled={disabled || component.useDefaultPadding}
          value={component.useDefaultPadding ? 0 : component.paddingBottom ?? 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePaddingChange(parseInt(e.target.value) || 0, "paddingBottom")}
        />
      </div>
      <div>
        <label className="text-sm font-medium">좌측</label>
        <Input
          type="number"
          min={0}
          disabled={disabled || component.useDefaultPadding}
          value={component.useDefaultPadding ? 0 : component.paddingLeft ?? 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePaddingChange(parseInt(e.target.value) || 0, "paddingLeft")}
        />
      </div>
      <div>
        <label className="text-sm font-medium">우측</label>
        <Input
          type="number"
          min={0}
          disabled={disabled || component.useDefaultPadding}
          value={component.useDefaultPadding ? 0 : component.paddingRight ?? 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePaddingChange(parseInt(e.target.value) || 0, "paddingRight")}
        />
      </div>
    </div>
  );
}
