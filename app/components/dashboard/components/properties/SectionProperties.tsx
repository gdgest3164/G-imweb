import { LandingComponent } from "@/lib/types/landing";
import { SectionLayoutSettings } from "../SectionLayoutSettings";
import { BackgroundProperties } from "./BackgroundProperties";
import { ColorProperties } from "./ColorProperties";
import { PropertyAccordion } from "./PropertyAccordion";
import { useState } from "react";

interface SectionPropertiesProps {
  component: Extract<LandingComponent, { type: "section" }>;
  onChange: (component: LandingComponent) => void;
  hasActiveBackgroundImage: (component: LandingComponent) => boolean;
  deleteBackgroundImage: () => void;
  cancelBackgroundImageDelete: () => void;
}

export function SectionProperties({ component, onChange, hasActiveBackgroundImage, deleteBackgroundImage, cancelBackgroundImageDelete }: SectionPropertiesProps) {
  const [openSection, setOpenSection] = useState<string | null>("layout");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="space-y-4">
      <PropertyAccordion title="레이아웃 설정" isOpen={openSection === "layout"} onToggle={() => toggleSection("layout")}>
        <SectionLayoutSettings component={component} onChange={onChange} />
      </PropertyAccordion>

      <PropertyAccordion title="배경 설정" isOpen={openSection === "background"} onToggle={() => toggleSection("background")}>
        <BackgroundProperties
          component={component}
          onChange={onChange}
          hasActiveBackgroundImage={hasActiveBackgroundImage}
          deleteBackgroundImage={deleteBackgroundImage}
          cancelBackgroundImageDelete={cancelBackgroundImageDelete}
        />
      </PropertyAccordion>

      <PropertyAccordion title="텍스트 설정" isOpen={openSection === "text"} onToggle={() => toggleSection("text")}>
        <ColorProperties
          label="글자 색상"
          color={component.textColor}
          opacity={component.textOpacity ?? 1}
          componentId={`text-${component.id}`}
          onChange={(color, opacity) =>
            onChange({
              ...component,
              textColor: color,
              textOpacity: opacity,
            })
          }
        />
      </PropertyAccordion>
    </div>
  );
}
