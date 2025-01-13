"use client";

import { LandingComponent } from "@/lib/types/landing";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

type IconComponent = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

interface ClientButtonProps {
  component: Extract<LandingComponent, { type: "button" }>;
  buttonStyle: React.CSSProperties;
  containerStyle: React.CSSProperties;
  classes: string;
}

export function ClientButton({ component, buttonStyle, containerStyle, classes }: ClientButtonProps) {
  const Icon = component.icon ? (LucideIcons[component.icon as keyof typeof LucideIcons] as IconComponent) : null;

  const handleMouseEnter = (target: HTMLElement) => {
    if (component.hoverBackgroundColor) {
      const rgba = `rgba(${parseInt(component.hoverBackgroundColor.slice(1, 3), 16)}, ${parseInt(component.hoverBackgroundColor.slice(3, 5), 16)}, ${parseInt(
        component.hoverBackgroundColor.slice(5, 7),
        16
      )}, ${component.hoverBackgroundOpacity || component.backgroundOpacity || 1})`;
      target.style.backgroundColor = rgba;
    }
    if (component.hoverTextColor) {
      const rgba = `rgba(${parseInt(component.hoverTextColor.slice(1, 3), 16)}, ${parseInt(component.hoverTextColor.slice(3, 5), 16)}, ${parseInt(component.hoverTextColor.slice(5, 7), 16)}, ${
        component.hoverTextOpacity || component.textOpacity || 1
      })`;
      target.style.color = rgba;
    }
    if (component.hoverBorderColor) {
      const rgba = `rgba(${parseInt(component.hoverBorderColor.slice(1, 3), 16)}, ${parseInt(component.hoverBorderColor.slice(3, 5), 16)}, ${parseInt(component.hoverBorderColor.slice(5, 7), 16)}, ${
        component.hoverBorderOpacity || component.borderOpacity || 1
      })`;
      target.style.borderColor = rgba;
    }
    if (component.hoverBorderWidth) {
      target.style.borderWidth = `${component.hoverBorderWidth}px`;
    }
    if (component.hoverBorderStyle) {
      target.style.borderStyle = component.hoverBorderStyle;
    }
  };

  const handleMouseLeave = (target: HTMLElement) => {
    target.style.backgroundColor = buttonStyle.backgroundColor as string;
    target.style.color = buttonStyle.color as string;
    target.style.borderColor = buttonStyle.borderColor as string;
    target.style.borderWidth = buttonStyle.borderWidth as string;
    target.style.borderStyle = buttonStyle.borderStyle as string;
  };

  return (
    <div style={containerStyle}>
      {component.link ? (
        <a
          href={component.link}
          {...(component.openInNewTab
            ? {
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {})}
          style={buttonStyle}
          className={`${classes} transition-all duration-200`}
          onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
        >
          <div className="flex items-center justify-center gap-2">
            {Icon && component.iconPosition === "left" && <Icon size={component.iconSize || 16} />}
            {component.text}
            {Icon && component.iconPosition === "right" && <Icon size={component.iconSize || 16} />}
          </div>
        </a>
      ) : (
        <button
          style={buttonStyle}
          className={`${classes} transition-all duration-200`}
          onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
        >
          <div className="flex items-center justify-center gap-2">
            {Icon && component.iconPosition === "left" && <Icon size={component.iconSize || 16} />}
            {component.text}
            {Icon && component.iconPosition === "right" && <Icon size={component.iconSize || 16} />}
          </div>
        </button>
      )}
    </div>
  );
}
