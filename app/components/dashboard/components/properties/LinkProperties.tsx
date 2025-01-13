import { LandingComponent } from "@/lib/types/landing";
import { Checkbox } from "./Checkbox";

interface LinkPropertiesProps {
  component: LandingComponent;
  onChange: (updatedComponent: LandingComponent) => void;
}

export default function LinkProperties({ component, onChange }: LinkPropertiesProps) {
  if (component.type !== "text") return null;

  const handleLinkTypeChange = (type: "none" | "url" | "tel" | "email") => {
    onChange({
      ...component,
      linkType: type,
      linkValue: type === "none" ? undefined : component.linkValue,
    });
  };

  const handleLinkValueChange = (value: string) => {
    onChange({
      ...component,
      linkValue: value,
    });
  };

  const getPlaceholder = () => {
    switch (component.linkType) {
      case "url":
        return "https://example.com";
      case "tel":
        return "010-1234-5678";
      case "email":
        return "example@email.com";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">링크 종류</label>
        <select
          value={component.linkType ?? "none"}
          onChange={(e) => handleLinkTypeChange(e.target.value as "none" | "url" | "tel" | "email")}
          className="w-full p-2 border rounded bg-white dark:text-white dark:bg-gray-600 dark:border-gray-400"
        >
          <option value="none">없음</option>
          <option value="url">링크</option>
          <option value="tel">전화걸기</option>
          <option value="email">이메일</option>
        </select>
      </div>

      {component.linkType && component.linkType !== "none" && (
        <div>
          <label className="block text-sm mb-1">{component.linkType === "url" ? "URL" : component.linkType === "tel" ? "전화번호" : "이메일 주소"}</label>
          <input
            type="text"
            value={component.linkValue ?? ""}
            onChange={(e) => handleLinkValueChange(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full p-2 border rounded bg-white dark:text-white dark:bg-gray-600 dark:border-gray-400"
          />
        </div>
      )}
      {component.linkValue && (
        <div>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={component.openInNewTab || false}
              onChange={(checked) =>
                onChange({
                  ...component,
                  openInNewTab: checked,
                })
              }
              id="button-open-in-new-tab"
              label="새창으로 열기"
            />
          </label>
        </div>
      )}
    </div>
  );
}
