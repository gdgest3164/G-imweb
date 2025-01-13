import { ImageUpload } from "@/components/ImageUpload";
import { LandingComponent, TextComponent, ContainerComponent } from "@/lib/types/landing";

type ComponentWithBackground = TextComponent | ContainerComponent;

interface BackgroundPropertiesProps {
  component: ComponentWithBackground;
  onChange: (component: ComponentWithBackground) => void;
  hasActiveBackgroundImage: (component: LandingComponent) => boolean;
  deleteBackgroundImage: () => void;
  cancelBackgroundImageDelete: () => void;
}

export function BackgroundProperties({ component, onChange, hasActiveBackgroundImage, deleteBackgroundImage, cancelBackgroundImageDelete }: BackgroundPropertiesProps) {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">배경 이미지</label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ImageUpload
                onUploadComplete={(url) =>
                  onChange({
                    ...component,
                    backgroundImage: url,
                    backgroundRepeat: "no-repeat",
                    _imageMeta: {
                      deleteState: "none",
                    },
                  })
                }
              />
            </div>
            {hasActiveBackgroundImage(component) && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 border rounded overflow-hidden">
                  <img src={component.backgroundImage} alt="Background preview" className="w-full h-full object-cover" />
                </div>
                <button onClick={deleteBackgroundImage} className="btn btn-error btn-sm text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {component._imageMeta?.deleteState === "pending" && (
            <div className="flex items-center gap-2">
              <div className="text-sm text-warning">저장 시 이미지가 삭제됩니다</div>
              <button onClick={cancelBackgroundImageDelete} className="btn btn-info btn-sm">
                취소
              </button>
            </div>
          )}
          {hasActiveBackgroundImage(component) && (
            <>
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">배경 반복</label>
                <select
                  value={component.backgroundRepeat || "no-repeat"}
                  onChange={(e) =>
                    onChange({
                      ...component,
                      backgroundRepeat: e.target.value as "no-repeat" | "repeat" | "repeat-x" | "repeat-y",
                    })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="no-repeat">채우기</option>
                  <option value="repeat">반복</option>
                  <option value="repeat-x">가로 반복</option>
                  <option value="repeat-y">세로 반복</option>
                </select>
              </div>
              <div className="mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={component.backgroundFixed ?? false}
                    onChange={(e) =>
                      onChange({
                        ...component,
                        backgroundFixed: e.target.checked,
                      })
                    }
                    className="checkbox checkbox-sm"
                  />
                  <span className="text-sm">배경 이미지 고정</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">배경색</label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className="w-10 h-10 border rounded overflow-hidden cursor-pointer"
              onClick={() => {
                const colorInput = document.getElementById(`color-${component.id}`) as HTMLInputElement;
                if (colorInput) colorInput.click();
              }}
            >
              <div
                className="w-full h-full rounded overflow-hidden"
                style={{
                  backgroundColor: component.backgroundColor || "#ffffff",
                  opacity: component.backgroundOpacity ?? 0,
                }}
              />
            </div>
            <input
              id={`color-${component.id}`}
              type="color"
              value={component.backgroundColor || "#ffffff"}
              onChange={(e) =>
                onChange({
                  ...component,
                  backgroundColor: e.target.value,
                })
              }
              className="absolute top-full left-0 mt-1 w-8 h-8 p-0 border rounded cursor-pointer opacity-0"
            />
          </div>
          <input
            type="text"
            value={component.backgroundColor || "#ffffff"}
            onChange={(e) =>
              onChange({
                ...component,
                backgroundColor: e.target.value,
              })
            }
            className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="#ffffff"
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">배경색 투명도</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round((component.backgroundOpacity || 0) * 100)}
              onChange={(e) =>
                onChange({
                  ...component,
                  backgroundColor: component.backgroundColor || "#ffffff",
                  backgroundOpacity: parseInt(e.target.value) / 100,
                })
              }
              className="range range-xs flex-1"
            />
            <span className="text-sm w-12 text-center">{Math.round((component.backgroundOpacity || 0) * 100)}%</span>
          </div>
        </div>
      </div>
    </>
  );
}
