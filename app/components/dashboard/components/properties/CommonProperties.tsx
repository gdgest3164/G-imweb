import { Checkbox } from "@/app/components/ui/Checkbox";
import { LandingComponent } from "@/lib/types/landing";
import { useState } from "react";
import { IndividualPaddingProperties } from "./IndividualPaddingProperties";
import { GroupPaddingProperties } from "./GroupPaddingProperties";

interface CommonPropertiesProps {
  component: LandingComponent;
  onChange: (component: LandingComponent) => void;
  disabled?: boolean;
}

export function CommonProperties({ component, onChange, disabled = false }: CommonPropertiesProps) {
  const [paddingMode, setPaddingMode] = useState<"individual" | "group">("individual");

  if (component.type !== "section" && component.type !== "text") return null;

  // 컴포넌트 타입에 따라 초기 패딩 모드 설정
  if (paddingMode === "individual" && component.type === "section") {
    setPaddingMode("group");
  } else if (paddingMode === "group" && component.type === "text") {
    setPaddingMode("individual");
  }

  return (
    <div className="mb-4 space-y-4">
      <div className="flex items-center justify-between">
        <Checkbox
          disabled={disabled}
          checked={component.useDefaultPadding ?? true}
          onChange={(checked) => {
            if (component.type === "text") {
              onChange({
                ...component,
                useDefaultPadding: checked,
                ...(checked
                  ? {
                      paddingLeft: 0,
                      paddingRight: 0,
                    }
                  : {}),
              });
            } else if (component.type === "section") {
              onChange({
                ...component,
                useDefaultPadding: checked,
                ...(checked
                  ? {
                      horizontalPadding: 0,
                      horizontalGap: 0,
                      verticalGap: 0,
                    }
                  : {}),
              });
            }
          }}
          label="기본 여백 사용"
        />
      </div>

      {paddingMode === "individual"
        ? component.type === "text" && <IndividualPaddingProperties component={component} onChange={onChange} disabled={disabled} />
        : component.type === "section" && <GroupPaddingProperties component={component} onChange={onChange} disabled={disabled} />}
    </div>
  );
}
