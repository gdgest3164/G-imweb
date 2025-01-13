import { ImageComponent as ImageComponentType } from "@/lib/types/landing";

interface ImageComponentProps {
  component: ImageComponentType;
  isSelected: boolean;
}

export function ImageComponent({ component, isSelected }: ImageComponentProps) {
  const baseClasses = component.tailwindClasses || "";
  const containerClasses = component.isCircle ? "mx-auto flex flex-col items-center" : "w-full";
  const height = component.height || 300;
  const heightStyle = component.isCircle
    ? { width: `${height}px`, height: `${height}px` }
    : component.fixedHeight
    ? { height: `${height}px` }
    : component.keepOriginalRatio
    ? {}
    : { height: `${height}px` };

  const borderStyle = component.isCircle ? {} : component.borderRadius ? { borderRadius: `${component.borderRadius}px` } : {};

  const style = {
    ...heightStyle,
    ...borderStyle,
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (component.backgroundColor) {
      const opacity = component.backgroundOpacity ?? 0;
      const hex = component.backgroundColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    return style;
  };

  if (!component.src || component.src === "") {
    return (
      <div
        className={`
          bg-gray-200 flex items-center justify-center text-gray-400 ${containerClasses} ${baseClasses}
          ${isSelected ? "outline outline-1 outline-dashed outline-gray-800" : ""}
          hover:outline hover:outline-1 hover:outline-dashed hover:outline-gray-400
          ${component.isCircle ? "rounded-full" : ""}
        `}
        style={style}
      >
        이미지를 선택해주세요
      </div>
    );
  }

  return (
    <div
      className={`
        relative ${containerClasses} ${baseClasses}
        ${isSelected ? "outline outline-1 outline-dashed outline-gray-800" : ""}
        hover:outline hover:outline-1 hover:outline-dashed hover:outline-gray-400
      `}
    >
      <div className={`${component.isCircle ? "rounded-full overflow-hidden" : "overflow-hidden"} flex items-center justify-center relative`} style={style}>
        <img
          src={component.src}
          alt={component.description || component.alt || ""}
          className={`${
            component.isCircle ? "object-cover aspect-square" : `${!component.keepOriginalRatio ? " h-full" : ""} ${component.fillMode === "cover" ? "w-full h-full  object-cover" : "object-contain"}`
          } z-0`}
          style={borderStyle}
        />
        {component.backgroundColor && <div className="absolute inset-0 pointer-events-none z-10" style={getBackgroundStyle()} />}
        {component.description && component.descriptionDisplay === "overlay" && (
          <div
            className={`absolute pointer-events-none z-20 p-2 whitespace-nowrap ${(() => {
              switch (component.descriptionPosition || "center") {
                case "top-left":
                  return "top-2 left-2";
                case "top-center":
                  return "top-2 left-1/2 -translate-x-1/2";
                case "top-right":
                  return "top-2 right-2";
                case "center-left":
                  return "top-1/2 left-2 -translate-y-1/2";
                case "center":
                  return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
                case "center-right":
                  return "top-1/2 right-2 -translate-y-1/2";
                case "bottom-left":
                  return "bottom-2 left-2";
                case "bottom-center":
                  return "bottom-2 left-1/2 -translate-x-1/2";
                case "bottom-right":
                  return "bottom-2 right-2";
                default:
                  return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
              }
            })()}`}
            style={{
              color: component.descriptionColor || "#000000",
              opacity: component.descriptionOpacity ?? 1,
              fontSize: `${component.descriptionFontSize || 14}px`,
            }}
          >
            {component.description}
          </div>
        )}
      </div>
      {component.description && component.descriptionDisplay === "below" && (
        <div
          className="mt-2 text-center"
          style={{
            color: component.descriptionColor || "#000000",
            opacity: component.descriptionOpacity ?? 1,
            fontSize: `${component.descriptionFontSize || 14}px`,
          }}
        >
          {component.description}
        </div>
      )}
    </div>
  );
}
