import { LandingComponent } from "@/lib/types/landing";
import { ImageUpload } from "@/components/ImageUpload";
import { Input } from "@/app/components/ui/Input";
import { Checkbox } from "@/app/components/ui/Checkbox";
import BorderRadiusProperties from "./BorderRadiusProperties";
import { ColorProperties } from "./ColorProperties";
import { ImageDescriptionProperties } from "./ImageDescriptionProperties";
import { PropertyAccordion } from "./PropertyAccordion";
import { useState } from "react";

interface ImagePropertiesProps {
  component: Extract<LandingComponent, { type: "image" }>;
  onChange: (component: LandingComponent) => void;
  hasActiveImage: (component: LandingComponent) => boolean;
  deleteImage: () => void;
  cancelImageDelete: () => void;
}

const ImageUploadSection = ({ component, onChange, hasActiveImage, deleteImage, cancelImageDelete }: ImagePropertiesProps) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm mb-1">이미지</label>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <ImageUpload
            onUploadComplete={(url) => {
              onChange({
                ...component,
                src: url,
                _imageMeta: {
                  deleteState: "none",
                },
              });
            }}
          />
        </div>
        {hasActiveImage(component) && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 border rounded overflow-hidden">
              <img src={component.src} alt="Image preview" className="w-full h-full object-cover" />
            </div>
            <button onClick={deleteImage} className="btn btn-error btn-sm text-white">
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
        <div className="flex items-center gap-2 mt-2">
          <div className="text-sm text-warning">저장 시 이미지가 삭제됩니다</div>
          <button onClick={cancelImageDelete} className="btn btn-info btn-sm">
            취소
          </button>
        </div>
      )}
    </div>
    <div>
      <label className="block text-sm mb-1">이미지 URL</label>
      <input
        type="text"
        value={component.src}
        onChange={(e) => onChange({ ...component, src: e.target.value })}
        className="w-full p-2 border rounded bg-white dark:text-white dark:bg-gray-600 dark:border-gray-400"
      />
    </div>
  </div>
);

const SizeSettings = ({ component, onChange }: Pick<ImagePropertiesProps, "component" | "onChange">) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm mb-1">높이 (px)</label>
      <Input
        type="number"
        disabled={component.keepOriginalRatio}
        min="1"
        value={component.isCircle ? component.height : component.height || 300}
        onChange={(e) =>
          onChange({
            ...component,
            height: Math.max(1, parseInt(e.target.value) || 1),
          })
        }
      />
    </div>
    <div>
      <Checkbox
        checked={!!component.fixedHeight}
        onChange={(checked) =>
          onChange({
            ...component,
            fixedHeight: checked,
            keepOriginalRatio: false,
            isCircle: false,
          })
        }
        label="높이 고정"
      />
      <p className="text-xs text-gray-500 mt-1">이 옵션을 사용하면 기기의 화면크기에 관계 없이 항상 설정한 값으로 높이가 유지됩니다.</p>
    </div>
    <div>
      <Checkbox
        checked={!!component.keepOriginalRatio}
        onChange={(checked) =>
          onChange({
            ...component,
            keepOriginalRatio: checked,
            fixedHeight: false,
            isCircle: false,
          })
        }
        label="원본 사이즈"
      />
      <p className="text-xs text-gray-500 mt-1">이 옵션을 사용하면 이미지의 원본 비율이 유지되며, 높이 제한이 없어집니다.</p>
    </div>
  </div>
);

const StyleSettings = ({ component, onChange }: Pick<ImagePropertiesProps, "component" | "onChange">) => (
  <div className="space-y-4">
    <div>
      <Checkbox
        checked={!!component.isCircle}
        onChange={(checked) =>
          onChange({
            ...component,
            isCircle: checked,
            keepOriginalRatio: false,
            fixedHeight: false,
            fillMode: "cover",
            borderRadius: 0,
            height: component.height || 300,
          })
        }
        label="원형 이미지"
      />
    </div>
    <div>
      <Checkbox
        checked={component.fillMode === "cover"}
        disabled={component.isCircle}
        onChange={(checked) =>
          onChange({
            ...component,
            fillMode: checked ? "cover" : "contain",
          })
        }
        label="채우기"
      />
    </div>
    <BorderRadiusProperties
      component={component}
      onChange={(updatedComponent) => {
        if (updatedComponent.type === "image") {
          onChange({
            ...updatedComponent,
            isCircle: false,
          });
        } else {
          onChange(updatedComponent);
        }
      }}
    />
    <ColorProperties
      label="배경색"
      color={component.backgroundColor}
      opacity={component.backgroundOpacity ?? 0}
      componentId={`background-${component.id}`}
      onChange={(color, opacity) =>
        onChange({
          ...component,
          backgroundColor: color,
          backgroundOpacity: opacity,
        })
      }
    />
  </div>
);

export function ImageProperties({ component, onChange, hasActiveImage, deleteImage, cancelImageDelete }: ImagePropertiesProps) {
  const [openSection, setOpenSection] = useState<string | null>("image-upload");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="space-y-4">
      <PropertyAccordion title="이미지 업로드" isOpen={openSection === "image-upload"} onToggle={() => toggleSection("image-upload")}>
        <ImageUploadSection component={component} onChange={onChange} hasActiveImage={hasActiveImage} deleteImage={deleteImage} cancelImageDelete={cancelImageDelete} />
      </PropertyAccordion>

      <PropertyAccordion title="크기 및 비율 설정" isOpen={openSection === "size-settings"} onToggle={() => toggleSection("size-settings")}>
        <SizeSettings component={component} onChange={onChange} />
      </PropertyAccordion>

      <PropertyAccordion title="스타일 설정" isOpen={openSection === "style-settings"} onToggle={() => toggleSection("style-settings")}>
        <StyleSettings component={component} onChange={onChange} />
      </PropertyAccordion>

      <PropertyAccordion title="이미지 설명" isOpen={openSection === "description"} onToggle={() => toggleSection("description")}>
        <ImageDescriptionProperties component={component} onChange={onChange} />
      </PropertyAccordion>
    </div>
  );
}
