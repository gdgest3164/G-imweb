import { ImageComponent } from "@/lib/types/landing";
import { ColorProperties } from "./ColorProperties";
import { Input } from "@/app/components/ui/Input";

interface ImageDescriptionPropertiesProps {
  component: ImageComponent;
  onChange: (updatedComponent: ImageComponent) => void;
}

export function ImageDescriptionProperties({ component, onChange }: ImageDescriptionPropertiesProps) {
  const positions = [
    ["top-left", "top-center", "top-right"],
    ["center-left", "center", "center-right"],
    ["bottom-left", "bottom-center", "bottom-right"],
  ] as const;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">이미지 설명</label>
        <Input
          type="text"
          value={component.description || ""}
          onChange={(e) =>
            onChange({
              ...component,
              description: e.target.value,
            })
          }
          placeholder="이미지에 대한 설명을 입력하세요"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">설명 표시 방식</label>
        <select
          value={component.descriptionDisplay || "hidden"}
          onChange={(e) =>
            onChange({
              ...component,
              descriptionDisplay: e.target.value as "hidden" | "below" | "overlay",
            })
          }
          className="w-full p-2 border rounded bg-white dark:text-white dark:bg-gray-600 dark:border-gray-400"
        >
          <option value="hidden">감추기</option>
          <option value="below">이미지 아래에 표시</option>
          <option value="overlay">이미지 위에 겹치기</option>
        </select>
        {component.descriptionDisplay === "overlay" && <p className="text-xs text-gray-500 mt-1">이미지와 겹치기를 선택하면 텍스트가 이미지 내부에만 표시됩니다.</p>}
      </div>
      {component.descriptionDisplay === "overlay" && (
        <div>
          <label className="block text-sm mb-1">텍스트 위치</label>
          <div className="grid grid-cols-3 gap-1 w-[80px] mx-auto">
            {positions.map((row) =>
              row.map((pos) => (
                <button
                  key={pos}
                  onClick={() =>
                    onChange({
                      ...component,
                      descriptionPosition: pos,
                    })
                  }
                  className={`w-6 h-6 border rounded flex items-center justify-center transition-colors
                        ${component.descriptionPosition === pos ? "bg-blue-500 text-white border-blue-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                ></button>
              ))
            )}
          </div>
        </div>
      )}

      {component.descriptionDisplay !== "hidden" && (
        <>
          <div>
            <label className="block text-sm mb-1">텍스트 크기 (px)</label>
            <Input
              type="number"
              min="1"
              value={component.descriptionFontSize ?? 14}
              onChange={(e) =>
                onChange({
                  ...component,
                  descriptionFontSize: Math.max(1, parseInt(e.target.value) || 1),
                })
              }
              className="w-full"
            />
          </div>

          <ColorProperties
            label="텍스트 색상"
            color={component.descriptionColor || "#000000"}
            opacity={component.descriptionOpacity ?? 1}
            componentId={`description-${component.id}`}
            onChange={(color, opacity) =>
              onChange({
                ...component,
                descriptionColor: color,
                descriptionOpacity: opacity,
              })
            }
          />
        </>
      )}
    </div>
  );
}
