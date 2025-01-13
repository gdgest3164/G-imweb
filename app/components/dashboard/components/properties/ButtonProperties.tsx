import React, { useState } from "react";
import { LandingComponent } from "@/lib/types/landing";
import { Input } from "@/app/components/ui/Input";
import { Checkbox } from "./Checkbox";
import { IconPicker, type IconName } from "@/app/components/ui/IconPicker";
import { ColorProperties } from "./ColorProperties";
import BorderStyleProperties from "./BorderStyleProperties";
import { PropertyAccordion } from "./PropertyAccordion";

// 스타일 저장을 위한 로컬 스토리지 키
const SAVED_BUTTON_STYLE_KEY = "saved_button_style";

interface ButtonPropertiesProps {
  component: Extract<LandingComponent, { type: "button" }>;
  onChange: (component: LandingComponent) => void;
}

// 저장할 스타일 타입 정의
interface SavedButtonStyle {
  default: {
    backgroundColor: string;
    backgroundOpacity: number;
    textColor: string;
    textOpacity: number;
    borderColor: string;
    borderOpacity: number;
    borderWidth: number;
    borderStyle: string;
  };
  hover: {
    backgroundColor: string;
    backgroundOpacity: number;
    textColor: string;
    textOpacity: number;
    borderColor: string;
    borderOpacity: number;
    borderWidth: number;
    borderStyle: string;
  };
}

// 스타일 저장 함수
const saveButtonStyle = (component: Extract<LandingComponent, { type: "button" }>) => {
  const styleToSave: SavedButtonStyle = {
    default: {
      backgroundColor: component.backgroundColor || "#ffffff",
      backgroundOpacity: component.backgroundOpacity ?? 1,
      textColor: component.textColor || "#000000",
      textOpacity: component.textOpacity ?? 1,
      borderColor: component.borderColor || "#000000",
      borderOpacity: component.borderOpacity ?? 1,
      borderWidth: component.borderWidth || 0,
      borderStyle: component.borderStyle || "solid",
    },
    hover: {
      backgroundColor: component.hoverBackgroundColor || component.backgroundColor || "#ffffff",
      backgroundOpacity: component.hoverBackgroundOpacity ?? component.backgroundOpacity ?? 1,
      textColor: component.hoverTextColor || component.textColor || "#000000",
      textOpacity: component.hoverTextOpacity ?? component.textOpacity ?? 1,
      borderColor: component.hoverBorderColor || component.borderColor || "#000000",
      borderOpacity: component.hoverBorderOpacity ?? component.borderOpacity ?? 1,
      borderWidth: component.hoverBorderWidth || component.borderWidth || 0,
      borderStyle: component.hoverBorderStyle || component.borderStyle || "solid",
    },
  };
  localStorage.setItem(SAVED_BUTTON_STYLE_KEY, JSON.stringify(styleToSave));
};

type ButtonSize = "small" | "medium" | "large" | "custom";

interface ButtonSizeConfig {
  fontSize: number;
  paddingX: number;
  paddingY: number;
  letterSpacing: number;
}

const BUTTON_SIZE_PRESETS: Record<Exclude<ButtonSize, "custom">, ButtonSizeConfig> = {
  small: {
    fontSize: 14,
    paddingX: 16,
    paddingY: 8,
    letterSpacing: 0,
  },
  medium: {
    fontSize: 16,
    paddingX: 24,
    paddingY: 12,
    letterSpacing: 0,
  },
  large: {
    fontSize: 18,
    paddingX: 32,
    paddingY: 16,
    letterSpacing: 0,
  },
};

export function ButtonProperties({ component, onChange }: ButtonPropertiesProps) {
  const [activeTab, setActiveTab] = useState<"default" | "hover">("default");
  const [openSection, setOpenSection] = useState<string | null>("style");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const checkIfPreset = () => {
    const { fontSize, paddingX, paddingY, letterSpacing } = component;
    return Object.values(BUTTON_SIZE_PRESETS).some((config) => fontSize === config.fontSize && paddingX === config.paddingX && paddingY === config.paddingY && letterSpacing === config.letterSpacing);
  };

  const [isCustomMode, setIsCustomMode] = React.useState(!checkIfPreset());

  const handleSizeChange = (size: ButtonSize) => {
    setIsCustomMode(size === "custom");
    if (size === "custom") {
      return;
    } else {
      const config = BUTTON_SIZE_PRESETS[size];
      onChange({
        ...component,
        fontSize: config.fontSize,
        paddingX: config.paddingX,
        paddingY: config.paddingY,
        letterSpacing: config.letterSpacing,
      });
    }
  };

  const currentSize = isCustomMode
    ? "custom"
    : (() => {
        const { fontSize, paddingX, paddingY, letterSpacing } = component;
        for (const [size, config] of Object.entries(BUTTON_SIZE_PRESETS)) {
          if (fontSize === config.fontSize && paddingX === config.paddingX && paddingY === config.paddingY && letterSpacing === config.letterSpacing) {
            return size as ButtonSize;
          }
        }
        return "custom" as ButtonSize;
      })();

  return (
    <div className="space-y-4">
      <PropertyAccordion title="텍스트 설정" isOpen={openSection === "text"} onToggle={() => toggleSection("text")}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">버튼 텍스트</label>
            <Input
              type="text"
              value={component.text}
              onChange={(e) =>
                onChange({
                  ...component,
                  text: e.target.value,
                })
              }
              placeholder="버튼 텍스트를 입력하세요"
              className="w-full"
            />
          </div>
        </div>
      </PropertyAccordion>
      <PropertyAccordion title="스타일 설정" isOpen={openSection === "style"} onToggle={() => toggleSection("style")}>
        <div className="space-y-4">
          <div className="flex items-center border-b border-gray-200 mb-4">
            <div className="flex-1 flex space-x-2">
              <button className={`px-2 py-2 ${activeTab === "default" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`} onClick={() => setActiveTab("default")}>
                기본
              </button>
              <button className={`px-2 py-2 ${activeTab === "hover" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`} onClick={() => setActiveTab("hover")}>
                마우스 오버
              </button>
            </div>
            <button
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => {
                saveButtonStyle(component);
                alert("스타일이 저장되었습니다.");
              }}
            >
              스타일 저장
            </button>
          </div>

          {activeTab === "default" ? (
            <>
              <ColorProperties
                label="배경색"
                color={component.backgroundColor || "#ffffff"}
                opacity={component.backgroundOpacity}
                componentId={`${component.id}-bg`}
                onChange={(color, opacity) => {
                  onChange({
                    ...component,
                    backgroundColor: color,
                    backgroundOpacity: opacity,
                  });
                }}
              />
              <ColorProperties
                label="텍스트 색상"
                color={component.textColor || "#ffffff"}
                opacity={component.textOpacity}
                componentId={`${component.id}-text`}
                onChange={(color, opacity) => {
                  onChange({
                    ...component,
                    textColor: color,
                    textOpacity: opacity,
                  });
                }}
              />
              <BorderStyleProperties component={component} onChange={onChange} />
            </>
          ) : (
            <>
              <ColorProperties
                label="배경색 (마우스 오버)"
                color={component.hoverBackgroundColor || component.backgroundColor || "#ffffff"}
                opacity={component.hoverBackgroundOpacity || component.backgroundOpacity}
                componentId={`${component.id}-hover-bg`}
                onChange={(color, opacity) => {
                  onChange({
                    ...component,
                    hoverBackgroundColor: color,
                    hoverBackgroundOpacity: opacity,
                  });
                }}
              />
              <ColorProperties
                label="텍스트 색상 (마우스 오버)"
                color={component.hoverTextColor || component.textColor || "#ffffff"}
                opacity={component.hoverTextOpacity || component.textOpacity}
                componentId={`${component.id}-hover-text`}
                onChange={(color, opacity) => {
                  onChange({
                    ...component,
                    hoverTextColor: color,
                    hoverTextOpacity: opacity,
                  });
                }}
              />
              <BorderStyleProperties
                component={{
                  ...component,
                  borderColor: component.hoverBorderColor || component.borderColor,
                  borderOpacity: component.hoverBorderOpacity || component.borderOpacity,
                  borderWidth: component.hoverBorderWidth || component.borderWidth,
                  borderStyle: component.hoverBorderStyle || component.borderStyle,
                }}
                onChange={(updatedComponent) => {
                  onChange({
                    ...component,
                    hoverBorderColor: updatedComponent.borderColor,
                    hoverBorderOpacity: updatedComponent.borderOpacity,
                    hoverBorderWidth: updatedComponent.borderWidth,
                    hoverBorderStyle: updatedComponent.borderStyle,
                  });
                }}
              />
            </>
          )}
        </div>
      </PropertyAccordion>

      <PropertyAccordion title="크기 및 정렬" isOpen={openSection === "size"} onToggle={() => toggleSection("size")}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">정렬</label>
            <select
              disabled={component.fullWidth}
              value={component.align || "left"}
              onChange={(e) => onChange({ ...component, align: e.target.value as "left" | "center" | "right" })}
              className="select select-bordered w-full select-sm"
            >
              <option value="left">왼쪽</option>
              <option value="center">가운데</option>
              <option value="right">오른쪽</option>
            </select>
          </div>

          <div>
            <Checkbox checked={component.fullWidth || false} onChange={(check) => onChange({ ...component, fullWidth: check })} id={"button-width-full"} label={"너비 채우기"} />
          </div>

          <div>
            <label className="block text-sm mb-1">크기</label>
            <select value={currentSize} onChange={(e) => handleSizeChange(e.target.value as ButtonSize)} className="select select-bordered w-full select-sm">
              <option value="small">소형</option>
              <option value="medium">중형</option>
              <option value="large">대형</option>
              <option value="custom">사용자 정의</option>
            </select>
          </div>

          {currentSize === "custom" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">텍스트 크기 (px)</label>
                <Input
                  type="number"
                  min="1"
                  value={component.fontSize || 16}
                  onChange={(e) =>
                    onChange({
                      ...component,
                      fontSize: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">좌우 여백 (px)</label>
                <Input
                  type="number"
                  min="0"
                  value={component.paddingX || 0}
                  onChange={(e) =>
                    onChange({
                      ...component,
                      paddingX: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">상하 여백 (px)</label>
                <Input
                  type="number"
                  min="0"
                  value={component.paddingY || 0}
                  onChange={(e) =>
                    onChange({
                      ...component,
                      paddingY: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">자간 (px)</label>
                <Input
                  type="number"
                  value={component.letterSpacing || 0}
                  onChange={(e) =>
                    onChange({
                      ...component,
                      letterSpacing: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </PropertyAccordion>

      <PropertyAccordion title="모서리 설정" isOpen={openSection === "border"} onToggle={() => toggleSection("border")}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm mb-1">모서리 둥글기</label>
            <Input
              type="number"
              min="0"
              max="50"
              value={component.borderRadius || 0}
              onChange={(e) =>
                onChange({
                  ...component,
                  borderRadius: Math.max(0, parseInt(e.target.value) || 0),
                  ...(component.useCustomBorderRadius && {
                    borderRadiusTopLeft: Math.max(0, parseInt(e.target.value) || 0),
                    borderRadiusTopRight: Math.max(0, parseInt(e.target.value) || 0),
                    borderRadiusBottomLeft: Math.max(0, parseInt(e.target.value) || 0),
                    borderRadiusBottomRight: Math.max(0, parseInt(e.target.value) || 0),
                  }),
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <Checkbox
              checked={component.useCustomBorderRadius || false}
              onChange={(checked) => {
                if (checked) {
                  onChange({
                    ...component,
                    useCustomBorderRadius: true,
                    borderRadiusTopLeft: component.borderRadius || 0,
                    borderRadiusTopRight: component.borderRadius || 0,
                    borderRadiusBottomLeft: component.borderRadius || 0,
                    borderRadiusBottomRight: component.borderRadius || 0,
                  });
                } else {
                  const commonValue =
                    component.borderRadiusTopLeft === component.borderRadiusTopRight &&
                    component.borderRadiusTopRight === component.borderRadiusBottomLeft &&
                    component.borderRadiusBottomLeft === component.borderRadiusBottomRight
                      ? component.borderRadiusTopLeft
                      : component.borderRadiusTopLeft;

                  onChange({
                    ...component,
                    useCustomBorderRadius: false,
                    borderRadius: commonValue || 0,
                    borderRadiusTopLeft: undefined,
                    borderRadiusTopRight: undefined,
                    borderRadiusBottomLeft: undefined,
                    borderRadiusBottomRight: undefined,
                  });
                }
              }}
              id="custom-border-radius"
              label="모서리 개별 설정"
            />
          </div>

          {component.useCustomBorderRadius && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1">왼쪽 상단</label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={component.borderRadiusTopLeft || 0}
                  onChange={(e) =>
                    onChange({
                      ...component,
                      borderRadiusTopLeft: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">오른쪽 상단</label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={component.borderRadiusTopRight || 0}
                  onChange={(e) =>
                    onChange({
                      ...component,
                      borderRadiusTopRight: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">왼쪽 하단</label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={component.borderRadiusBottomLeft || 0}
                  onChange={(e) =>
                    onChange({
                      ...component,
                      borderRadiusBottomLeft: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">오른쪽 하단</label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={component.borderRadiusBottomRight || 0}
                  onChange={(e) =>
                    onChange({
                      ...component,
                      borderRadiusBottomRight: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </PropertyAccordion>

      <PropertyAccordion title="아이콘 설정" isOpen={openSection === "icon"} onToggle={() => toggleSection("icon")}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm mb-1">아이콘</label>
            <IconPicker
              value={component.icon as IconName}
              onChange={(icon) =>
                onChange({
                  ...component,
                  icon,
                  ...(icon
                    ? {
                        iconPosition: component.iconPosition || "left",
                        iconSize: component.iconSize || 16,
                      }
                    : {
                        iconPosition: undefined,
                        iconSize: undefined,
                      }),
                })
              }
            />
          </div>

          {component.icon && (
            <>
              <div>
                <label className="block text-sm mb-1">아이콘 위치</label>
                <select
                  value={component.iconPosition || "left"}
                  onChange={(e) => onChange({ ...component, iconPosition: e.target.value as "left" | "right" })}
                  className="select select-bordered w-full select-sm"
                >
                  <option value="left">왼쪽</option>
                  <option value="right">오른쪽</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">아이콘 크기 (px)</label>
                <Input
                  type="number"
                  min="8"
                  max="48"
                  value={component.iconSize || 16}
                  onChange={(e) =>
                    onChange({
                      ...component,
                      iconSize: Math.max(8, Math.min(48, parseInt(e.target.value) || 16)),
                    })
                  }
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </PropertyAccordion>

      <PropertyAccordion title="링크 설정" isOpen={openSection === "link"} onToggle={() => toggleSection("link")}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">링크</label>
            <Input
              type="text"
              value={component.link || ""}
              onChange={(e) =>
                onChange({
                  ...component,
                  link: e.target.value,
                })
              }
              placeholder="https://example.com"
              className="w-full"
            />
          </div>

          {component.link && (
            <div>
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
            </div>
          )}
        </div>
      </PropertyAccordion>
    </div>
  );
}
