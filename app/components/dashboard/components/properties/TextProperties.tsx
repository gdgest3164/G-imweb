import { LandingComponent } from "@/lib/types/landing";
import { CommonProperties } from "./CommonProperties";
import BorderRadiusProperties from "./BorderRadiusProperties";
import BorderStyleProperties from "./BorderStyleProperties";
import LinkProperties from "./LinkProperties";
import { BackgroundProperties } from "./BackgroundProperties";
import { PropertyAccordion } from "./PropertyAccordion";
import { useState } from "react";

interface TextPropertiesProps {
  component: Extract<LandingComponent, { type: "text" }>;
  onChange: (component: LandingComponent) => void;
  onOpenEditor: (content: string) => void;
  hasActiveBackgroundImage: (component: LandingComponent) => boolean;
  deleteBackgroundImage: () => void;
  cancelBackgroundImageDelete: () => void;
}

export function TextProperties({ component, onChange, onOpenEditor, hasActiveBackgroundImage, deleteBackgroundImage, cancelBackgroundImageDelete }: TextPropertiesProps) {
  const [openSection, setOpenSection] = useState<string | null>("content");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="space-y-4">
      <PropertyAccordion title="텍스트 내용" isOpen={openSection === "content"} onToggle={() => toggleSection("content")}>
        <div>
          <div className="relative">
            <div
              className="w-full h-[100px] overflow-auto p-3 border rounded bg-white dark:bg-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-500"
              onClick={() => onOpenEditor(component.content)}
              dangerouslySetInnerHTML={{ __html: component.content }}
            />
          </div>
        </div>
      </PropertyAccordion>

      <PropertyAccordion title="여백 및 정렬" isOpen={openSection === "common"} onToggle={() => toggleSection("common")}>
        <CommonProperties component={component} onChange={onChange} />
      </PropertyAccordion>

      <PropertyAccordion title="테두리" isOpen={openSection === "border"} onToggle={() => toggleSection("border")}>
        <div className="space-y-4">
          <BorderRadiusProperties component={component} onChange={onChange} max={50} />
          <BorderStyleProperties component={component} onChange={onChange} />
        </div>
      </PropertyAccordion>

      <PropertyAccordion title="링크" isOpen={openSection === "link"} onToggle={() => toggleSection("link")}>
        <LinkProperties component={component} onChange={onChange} />
      </PropertyAccordion>

      <PropertyAccordion title="배경" isOpen={openSection === "background"} onToggle={() => toggleSection("background")}>
        <BackgroundProperties
          component={component}
          onChange={onChange}
          hasActiveBackgroundImage={hasActiveBackgroundImage}
          deleteBackgroundImage={deleteBackgroundImage}
          cancelBackgroundImageDelete={cancelBackgroundImageDelete}
        />
      </PropertyAccordion>
    </div>
  );
}
