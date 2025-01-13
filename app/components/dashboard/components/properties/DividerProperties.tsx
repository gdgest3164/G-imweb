import { useState } from "react";
import { LandingComponent } from "@/lib/types/landing";
import { PropertyAccordion } from "./PropertyAccordion";
import { ColorProperties } from "./ColorProperties";
import * as Select from "@radix-ui/react-select";

interface DividerPropertiesProps {
  component: LandingComponent;
  onChange: (component: LandingComponent) => void;
}

export function DividerProperties({ component, onChange }: DividerPropertiesProps) {
  const [openSection, setOpenSection] = useState<string>("style");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  if (component.type !== "divider") return null;

  return (
    <div className="space-y-4">
      <PropertyAccordion title="스타일 설정" isOpen={openSection === "style"} onToggle={() => toggleSection("style")}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">두께</label>
            <input
              type="number"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={component.thickness}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({
                  ...component,
                  thickness: parseInt(e.target.value) || 1,
                })
              }
              min={1}
              max={20}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">정렬</label>
            <Select.Root
              value={component.alignment}
              onValueChange={(value: "left" | "center" | "right") =>
                onChange({
                  ...component,
                  alignment: value,
                })
              }
            >
              <Select.Trigger className="w-full rounded-md border border-gray-300 px-3 py-2">
                <Select.Value />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content>
                  <Select.Viewport>
                    <Select.Item value="left">
                      <Select.ItemText>왼쪽</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="center">
                      <Select.ItemText>가운데</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="right">
                      <Select.ItemText>오른쪽</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">선 스타일</label>
            <Select.Root
              value={component.lineStyle}
              onValueChange={(value: "solid" | "dashed" | "dotted") =>
                onChange({
                  ...component,
                  lineStyle: value,
                })
              }
            >
              <Select.Trigger className="w-full rounded-md border border-gray-300 px-3 py-2">
                <Select.Value />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content>
                  <Select.Viewport>
                    <Select.Item value="solid">
                      <Select.ItemText>실선</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="dashed">
                      <Select.ItemText>파선</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="dotted">
                      <Select.ItemText>점선</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <ColorProperties
            label="선 색상"
            color={component.color}
            opacity={component.opacity}
            componentId={`divider-${component.id}`}
            onChange={(color, opacity) =>
              onChange({
                ...component,
                color,
                opacity,
              })
            }
          />
        </div>
      </PropertyAccordion>

      <PropertyAccordion title="길이 설정" isOpen={openSection === "width"} onToggle={() => toggleSection("width")}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">길이</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                value={component.width}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChange({
                    ...component,
                    width: parseInt(e.target.value) || 100,
                  })
                }
                min={1}
                max={component.widthUnit === "%" ? 100 : 1000}
              />
              <Select.Root
                value={component.widthUnit}
                onValueChange={(value: "%" | "px") =>
                  onChange({
                    ...component,
                    widthUnit: value,
                  })
                }
              >
                <Select.Trigger className="w-24 rounded-md border border-gray-300 px-3 py-2">
                  <Select.Value />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content>
                    <Select.Viewport>
                      <Select.Item value="%">
                        <Select.ItemText>%</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="px">
                        <Select.ItemText>px</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>
        </div>
      </PropertyAccordion>
    </div>
  );
}
