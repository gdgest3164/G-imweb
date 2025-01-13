import { ContainerComponent, LandingComponent } from "@/lib/types/landing";
import { CommonProperties } from "./properties/CommonProperties";
import { Toggle } from "@/app/components/ui/Toggle";
import { Checkbox } from "@/app/components/ui/Checkbox";

interface SectionLayoutSettingsProps {
  component: ContainerComponent;
  onChange: (component: LandingComponent) => void;
}

export function SectionLayoutSettings({ component, onChange }: SectionLayoutSettingsProps) {
  const forceDefaultPadding = component.children.length === 0;

  return (
    <>
      <div className="flex items-center gap-2">
        <Toggle
          checked={component.layout === "horizontal"}
          onChange={(checked: boolean) =>
            onChange({
              ...component,
              layout: checked ? "horizontal" : "vertical",
            })
          }
          leftLabel="세로 정렬"
          rightLabel="가로 정렬"
        />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          checked={component.isFullWidth ?? false}
          onChange={(checked) =>
            onChange({
              ...component,
              isFullWidth: checked,
            })
          }
          label="가로 100% 확장"
        />
      </div>

      <CommonProperties disabled={forceDefaultPadding} component={component} onChange={onChange} />

      <div className="space-y-2 mt-4">
        <Checkbox
          checked={component.isSticky ?? false}
          onChange={(checked) =>
            onChange({
              ...component,
              isSticky: checked,
            })
          }
          label="스크롤 시 화면 상단에 고정 (미리보기만)"
        />
        <p className="text-xs text-gray-500 ml-6">페이지를 스크롤하더라도 이 섹션이 항상 화면 상단에 고정되어 보이도록 합니다. 메뉴나 중요한 정보를 표시할 때 유용합니다.</p>
      </div>
    </>
  );
}
