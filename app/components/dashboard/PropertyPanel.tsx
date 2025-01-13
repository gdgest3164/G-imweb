import { LandingComponent } from "@/lib/types/landing";
import { MarginProperties } from "./components/properties/MarginProperties";
import { SectionProperties } from "./components/properties/SectionProperties";
import { TextProperties } from "./components/properties/TextProperties";
import { ImageProperties } from "./components/properties/ImageProperties";
import { ButtonProperties } from "./components/properties/ButtonProperties";
import { DividerProperties } from "./components/properties/DividerProperties";

interface PropertyPanelProps {
  component: LandingComponent;
  onChange: (component: LandingComponent) => void;
  onOpenEditor: (content: string) => void;
}

export function PropertyPanel({ component, onChange, onOpenEditor }: PropertyPanelProps) {
  const deleteBackgroundImage = () => {
    if (component.type !== "section" && component.type !== "text") return;

    const updatedComponent = {
      ...component,
      _imageMeta: {
        deleteState: "pending" as const,
        originalUrl: component.backgroundImage,
      },
      backgroundImage: undefined,
      backgroundRepeat: undefined,
      backgroundFixed: undefined,
    };
    onChange(updatedComponent);
  };

  const cancelBackgroundImageDelete = () => {
    if (component.type !== "section" && component.type !== "text") return;

    const updatedComponent = {
      ...component,
      _imageMeta: {
        deleteState: "none" as const,
      },
      backgroundImage: component._imageMeta?.originalUrl,
      backgroundRepeat: "no-repeat" as const,
    };
    onChange(updatedComponent);
  };

  const hasActiveBackgroundImage = (comp: LandingComponent): boolean => {
    if (comp.type !== "section" && comp.type !== "text") return false;
    return Boolean(comp.backgroundImage && (!comp._imageMeta || comp._imageMeta.deleteState === "none"));
  };

  const deleteImage = () => {
    if (component.type !== "image") return;

    const updatedComponent = {
      ...component,
      _imageMeta: {
        deleteState: "pending" as const,
        originalUrl: component.src,
      },
      src: "",
    };
    onChange(updatedComponent);
  };

  const cancelImageDelete = () => {
    if (component.type !== "image") return;

    const updatedComponent = {
      ...component,
      _imageMeta: {
        deleteState: "none" as const,
      },
      src: component._imageMeta?.originalUrl,
    };
    onChange(updatedComponent);
  };

  const hasActiveImage = (comp: LandingComponent): boolean => {
    if (comp.type !== "image") return false;
    return Boolean(comp.src && (!comp._imageMeta || comp._imageMeta.deleteState === "none"));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold">속성</h3>

      {/* 여백 */}
      {component.type === "margin" && <MarginProperties component={component} onChange={onChange} />}
      {/* 섹션 */}
      {component.type === "section" && (
        <SectionProperties
          component={component}
          onChange={onChange}
          hasActiveBackgroundImage={hasActiveBackgroundImage}
          deleteBackgroundImage={deleteBackgroundImage}
          cancelBackgroundImageDelete={cancelBackgroundImageDelete}
        />
      )}
      {/* 텍스트 */}
      {component.type === "text" && (
        <TextProperties
          component={component}
          onChange={onChange}
          onOpenEditor={onOpenEditor}
          hasActiveBackgroundImage={hasActiveBackgroundImage}
          deleteBackgroundImage={deleteBackgroundImage}
          cancelBackgroundImageDelete={cancelBackgroundImageDelete}
        />
      )}
      {/* 이미지 */}
      {component.type === "image" && <ImageProperties component={component} onChange={onChange} hasActiveImage={hasActiveImage} deleteImage={deleteImage} cancelImageDelete={cancelImageDelete} />}
      {/* 버튼 */}
      {component.type === "button" && <ButtonProperties component={component} onChange={onChange} />}
      {/* 가로선 */}
      {component.type === "divider" && <DividerProperties component={component} onChange={onChange} />}

      <style jsx global>{`
        .property-panel-select {
          z-index: 20 !important;
        }
      `}</style>
    </div>
  );
}
