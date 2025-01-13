import { TextComponent as TextComponentType } from "@/lib/types/landing";

interface TextComponentProps {
  component: TextComponentType;
  isSelected: boolean;
}

export function TextComponent({ component, isSelected }: TextComponentProps) {
  const baseClasses = component.tailwindClasses || "";

  const imageStyles: React.CSSProperties = {
    backgroundImage: component.backgroundImage ? `url(${component.backgroundImage})` : undefined,
    backgroundRepeat: component.backgroundRepeat,
    backgroundAttachment: component.backgroundFixed ? "fixed" : undefined,
    backgroundPosition: "center",
    backgroundSize: "cover",
    borderRadius: component.borderRadius !== undefined ? `${component.borderRadius}px` : undefined,
  };

  const getPaddingStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (component.useDefaultPadding) {
      style.paddingTop = "15px";
      style.paddingBottom = "15px";
      style.paddingLeft = "15px";
      style.paddingRight = "15px";
    } else {
      if (component.paddingTop) {
        style.paddingTop = `${component.paddingTop}px`;
      }
      if (component.paddingBottom) {
        style.paddingBottom = `${component.paddingBottom}px`;
      }
      if (component.paddingLeft) {
        style.paddingLeft = `${component.paddingLeft}px`;
      }
      if (component.paddingRight) {
        style.paddingRight = `${component.paddingRight}px`;
      }
    }

    if (component.borderRadius !== undefined) {
      style.borderRadius = `${component.borderRadius}px`;
    }

    if (component.borderStyle && component.borderStyle !== "none") {
      style.borderStyle = component.borderStyle;
      style.borderWidth = `${component.borderWidth || 1}px`;
      if (component.borderColor) {
        const opacity = component.borderOpacity ?? 1;
        const color = component.borderColor.startsWith("#") ? hexToRgba(component.borderColor, opacity) : component.borderColor;
        style.borderColor = color;
      }
    }

    return style;
  };

  const hexToRgba = (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getTextStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (component.textColor) {
      const opacity = component.textOpacity ?? 1;
      style.color = hexToRgba(component.textColor, opacity);
    }

    if (component.letterSpacing) {
      style.letterSpacing = component.letterSpacing;
    }

    if (component.lineHeight) {
      style.lineHeight = component.lineHeight;
    }

    if (component.fontSize) {
      style.fontSize = component.fontSize;
    }

    return style;
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${isSelected ? "outline outline-1 outline-dashed outline-gray-800 " : ""}
        hover:outline hover:outline-1 hover:outline-dashed hover:outline-gray-400
        relative
        ${component.useDefaultPadding ?? true ? "p-4" : ""}
        overflow-hidden
        prose prose-sm
      `}
      style={getPaddingStyle()}
    >
      {/* 배경 이미지 레이어 */}
      {component.backgroundImage && <div className="absolute inset-0 z-0" style={imageStyles} />}

      {/* 배경색 레이어 */}
      {component.backgroundColor && (
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundColor: component.backgroundColor,
            opacity: component.backgroundOpacity,
          }}
        />
      )}

      {/* 텍스트 레이어 */}
      <div className={`${isSelected ? "relative" : ""} relative z-20 ${baseClasses}`} style={getTextStyle()}>
        {component.linkType && component.linkType !== "none" && component.linkValue ? (
          <a
            href={`${component.linkType === "url" ? "" : component.linkType === "tel" ? "tel:" : "mailto:"}${component.linkValue}`}
            target={component.linkType === "url" ? "_blank" : undefined}
            rel={component.linkType === "url" ? "noopener noreferrer" : undefined}
            className={`cursor-pointer ${baseClasses}`}
            onClick={(e) => e.preventDefault()}
          >
            <div dangerouslySetInnerHTML={{ __html: component.content }} className={baseClasses} />
          </a>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: component.content }} className={baseClasses} />
        )}
      </div>
    </div>
  );
}
