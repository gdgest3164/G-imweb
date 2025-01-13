import { LandingComponent } from "@/lib/types/landing";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

type IconComponent = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

interface ButtonComponentProps {
  component: Extract<LandingComponent, { type: "button" }>;
  isSelected?: boolean;
}

// 저장된 스타일을 가져오는 함수
export const getSavedButtonStyle = () => {
  const savedStyle = localStorage.getItem("saved_button_style");
  return savedStyle ? JSON.parse(savedStyle) : null;
};

// 새로운 버튼에 저장된 스타일을 적용하는 함수
export const applyButtonStyle = (component: Extract<LandingComponent, { type: "button" }>) => {
  const savedStyle = getSavedButtonStyle();
  if (!savedStyle) return component;

  return {
    ...component,
    // 기본 스타일
    backgroundColor: savedStyle.default.backgroundColor,
    backgroundOpacity: savedStyle.default.backgroundOpacity,
    textColor: savedStyle.default.textColor,
    textOpacity: savedStyle.default.textOpacity,
    borderColor: savedStyle.default.borderColor,
    borderOpacity: savedStyle.default.borderOpacity,
    borderWidth: savedStyle.default.borderWidth,
    borderStyle: savedStyle.default.borderStyle,
    // 호버 스타일
    hoverBackgroundColor: savedStyle.hover.backgroundColor,
    hoverBackgroundOpacity: savedStyle.hover.backgroundOpacity,
    hoverTextColor: savedStyle.hover.textColor,
    hoverTextOpacity: savedStyle.hover.textOpacity,
    hoverBorderColor: savedStyle.hover.borderColor,
    hoverBorderOpacity: savedStyle.hover.borderOpacity,
    hoverBorderWidth: savedStyle.hover.borderWidth,
    hoverBorderStyle: savedStyle.hover.borderStyle,
  };
};

export function ButtonComponent({ component, isSelected }: ButtonComponentProps) {
  const buttonStyle = {
    ...component.style,
    fontSize: `${component.fontSize}px`,
    padding: `${component.paddingY}px ${component.paddingX}px`,
    letterSpacing: `${component.letterSpacing}px`,
    width: component.fullWidth ? "100%" : "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: component.backgroundColor
      ? `rgba(${parseInt(component.backgroundColor.slice(1, 3), 16)}, ${parseInt(component.backgroundColor.slice(3, 5), 16)}, ${parseInt(component.backgroundColor.slice(5, 7), 16)}, ${
          component.backgroundOpacity ?? 1
        })`
      : component.variant === "primary"
      ? "rgb(59, 130, 246)"
      : component.variant === "secondary"
      ? "rgb(107, 114, 128)"
      : "transparent",
    color: component.textColor
      ? `rgba(${parseInt(component.textColor.slice(1, 3), 16)}, ${parseInt(component.textColor.slice(3, 5), 16)}, ${parseInt(component.textColor.slice(5, 7), 16)}, ${component.textOpacity ?? 1})`
      : component.variant === "primary" || component.variant === "secondary"
      ? "white"
      : "inherit",
    borderColor: component.borderColor
      ? `rgba(${parseInt(component.borderColor.slice(1, 3), 16)}, ${parseInt(component.borderColor.slice(3, 5), 16)}, ${parseInt(component.borderColor.slice(5, 7), 16)}, ${
          component.borderOpacity ?? 1
        })`
      : component.variant === "outline"
      ? "rgb(107, 114, 128)"
      : "transparent",
    borderWidth: component.borderWidth ? `${component.borderWidth}px` : component.variant === "outline" ? "1px" : "0px",
    borderStyle: component.borderStyle || "solid",
    ...(component.useCustomBorderRadius
      ? {
          borderTopLeftRadius: `${component.borderRadiusTopLeft}px`,
          borderTopRightRadius: `${component.borderRadiusTopRight}px`,
          borderBottomLeftRadius: `${component.borderRadiusBottomLeft}px`,
          borderBottomRightRadius: `${component.borderRadiusBottomRight}px`,
        }
      : {
          borderRadius: `${component.borderRadius || 0}px`,
        }),
  };

  const containerStyle = {
    display: "flex",
    justifyContent: component.align === "right" ? "flex-end" : component.align === "center" ? "center" : "flex-start",
    width: component.fullWidth ? "100%" : "auto",
  };

  const Icon = component.icon ? (LucideIcons[component.icon as keyof typeof LucideIcons] as IconComponent) : null;

  return (
    <div style={containerStyle}>
      <button
        className={`
          ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
          transition-all duration-200
        `}
        style={buttonStyle}
        onClick={() => {
          // if (component.link) {
          //   if (component.openInNewTab) {
          //     window.open(component.link, "_blank");
          //   } else {
          //     window.location.href = component.link;
          //   }
          // }
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          if (component.hoverBackgroundColor) {
            const rgba = `rgba(${parseInt(component.hoverBackgroundColor.slice(1, 3), 16)}, ${parseInt(component.hoverBackgroundColor.slice(3, 5), 16)}, ${parseInt(
              component.hoverBackgroundColor.slice(5, 7),
              16
            )}, ${component.hoverBackgroundOpacity ?? component.backgroundOpacity ?? 1})`;
            target.style.backgroundColor = rgba;
          }
          if (component.hoverTextColor) {
            const rgba = `rgba(${parseInt(component.hoverTextColor.slice(1, 3), 16)}, ${parseInt(component.hoverTextColor.slice(3, 5), 16)}, ${parseInt(component.hoverTextColor.slice(5, 7), 16)}, ${
              component.hoverTextOpacity ?? component.textOpacity ?? 1
            })`;
            target.style.color = rgba;
          }
          if (component.hoverBorderColor) {
            const rgba = `rgba(${parseInt(component.hoverBorderColor.slice(1, 3), 16)}, ${parseInt(component.hoverBorderColor.slice(3, 5), 16)}, ${parseInt(
              component.hoverBorderColor.slice(5, 7),
              16
            )}, ${component.hoverBorderOpacity ?? component.borderOpacity ?? 1})`;
            target.style.borderColor = rgba;
          }
          if (component.hoverBorderWidth) {
            target.style.borderWidth = `${component.hoverBorderWidth}px`;
          }
          if (component.hoverBorderStyle) {
            target.style.borderStyle = component.hoverBorderStyle;
          }
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.backgroundColor = buttonStyle.backgroundColor as string;
          target.style.color = buttonStyle.color as string;
          target.style.borderColor = buttonStyle.borderColor as string;
          target.style.borderWidth = buttonStyle.borderWidth as string;
          target.style.borderStyle = buttonStyle.borderStyle as string;
        }}
      >
        <div className="flex items-center gap-2 justify-center w-full">
          {Icon && component.iconPosition !== "right" && <Icon size={component.iconSize || 16} />}
          <span>{component.text}</span>
          {Icon && component.iconPosition === "right" && <Icon size={component.iconSize || 16} />}
        </div>
      </button>
    </div>
  );
}
