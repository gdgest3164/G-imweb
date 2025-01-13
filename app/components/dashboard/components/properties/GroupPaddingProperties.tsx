import { ContainerComponent, LandingComponent } from "@/lib/types/landing";
import { Input } from "@/app/components/ui/Input";
import { ChangeEvent } from "react";

interface GroupPaddingPropertiesProps {
  component: ContainerComponent;
  onChange: (component: LandingComponent) => void;
  disabled?: boolean;
}

export function GroupPaddingProperties({ component, onChange, disabled = false }: GroupPaddingPropertiesProps) {
  const handlePaddingChange = (value: number, key: "verticalPadding" | "horizontalPadding" | "verticalGap" | "horizontalGap") => {
    // 상하 여백의 경우 기본 여백 사용 여부와 관계없이 적용
    if (key === "verticalPadding") {
      onChange({
        ...component,
        [key]: value,
      });
      return;
    }

    // 다른 여백은 기본 여백 미사용 시에만 적용
    if (!component.useDefaultPadding) {
      onChange({
        ...component,
        [key]: value,
      });
    }
  };

  return (
    <div className="grid grid-cols-4 gap-1">
      <div>
        <label className="text-sm font-medium">상하</label>
        <Input
          type="number"
          min={0}
          disabled={disabled}
          value={component.verticalPadding ?? 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePaddingChange(parseInt(e.target.value) || 0, "verticalPadding")}
        />
      </div>
      <div>
        <label className="text-sm font-medium">좌우</label>
        <Input
          type="number"
          min={0}
          disabled={disabled || component.useDefaultPadding}
          value={component.useDefaultPadding ? 0 : component.horizontalPadding ?? 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePaddingChange(parseInt(e.target.value) || 0, "horizontalPadding")}
        />
      </div>
      <div>
        <label className="text-sm font-medium">상하간격</label>
        <Input
          type="number"
          min={0}
          disabled={disabled || component.useDefaultPadding}
          value={component.useDefaultPadding ? 0 : component.verticalGap ?? 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePaddingChange(parseInt(e.target.value) || 0, "verticalGap")}
        />
      </div>
      <div>
        <label className="text-sm font-medium">좌우간격</label>
        <Input
          type="number"
          min={0}
          disabled={disabled || component.useDefaultPadding}
          value={component.useDefaultPadding ? 0 : component.horizontalGap ?? 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePaddingChange(parseInt(e.target.value) || 0, "horizontalGap")}
        />
      </div>
    </div>
  );
}
