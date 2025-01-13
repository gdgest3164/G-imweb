import { useState } from "react";
import { LandingComponent, ContainerComponent } from "@/lib/types/landing";
import { DraggableComponent } from "../DraggableComponent";

interface SectionComponentProps {
  component: ContainerComponent;
  isSelected: boolean;
  selectedComponent: string | null;
  setSelectedComponent: (id: string | null) => void;
  onUpdate: (component: LandingComponent) => void;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  handleDeleteComponent: (id: string) => void;
  onTemplateSaved?: () => void;
}

export function SectionComponent({ component, isSelected, selectedComponent, setSelectedComponent, onUpdate, handleDeleteComponent, onTemplateSaved }: SectionComponentProps) {
  const handleMoveComponent = (dragIndex: number, hoverIndex: number) => {
    const newChildren = [...component.children];
    const [draggedChild] = newChildren.splice(dragIndex, 1);
    newChildren.splice(hoverIndex, 0, draggedChild);

    onUpdate({
      ...component,
      children: newChildren,
    });
  };

  const getPaddingClasses = () => {
    if (component.children.length === 0) {
      return "p-[15px]";
    }
    if (component.useDefaultPadding) {
      return "p-[15px]";
    }
    return "";
  };

  const getPaddingStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (component.verticalPadding) {
      if (component.useDefaultPadding) {
        if (component.verticalPadding >= 15) {
          style.paddingTop = `${component.verticalPadding}px`;
          style.paddingBottom = `${component.verticalPadding}px`;
        } else {
          style.paddingTop = "15px";
          style.paddingBottom = "15px";
        }
      } else {
        style.paddingTop = `${component.verticalPadding}px`;
        style.paddingBottom = `${component.verticalPadding}px`;
      }
    } else if (component.useDefaultPadding) {
      style.paddingTop = "15px";
      style.paddingBottom = "15px";
    }

    if (component.useDefaultPadding) {
      style.paddingLeft = "15px";
      style.paddingRight = "15px";
      return style;
    }

    if (component.horizontalPadding) {
      style.paddingLeft = `${component.horizontalPadding}px`;
      style.paddingRight = `${component.horizontalPadding}px`;
    }
    if (component.verticalGap) {
      style.rowGap = `${component.verticalGap}px`;
    }
    if (component.horizontalGap) {
      style.columnGap = `${component.horizontalGap}px`;
    }

    return style;
  };

  const getBackgroundImageStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (component.backgroundImage) {
      style.backgroundImage = `url(${component.backgroundImage})`;
      style.backgroundRepeat = component.backgroundRepeat || "no-repeat";
      style.backgroundPosition = "center";
      style.backgroundSize = component.backgroundRepeat !== "no-repeat" ? "auto" : "cover";
      if (component.backgroundFixed) {
        style.backgroundAttachment = "fixed";
      }
    }

    return style;
  };

  const getBackgroundColorStyle = (): React.CSSProperties => {
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

  const getStickyClasses = () => {
    if (component.isSticky) {
      return "sticky top-0 z-10";
    }
    return "";
  };

  const getTextColorStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (component.textColor) {
      const opacity = component.textOpacity ?? 1;
      const hex = component.textColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      style.color = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    return style;
  };

  return (
    <div
      className={`
        relative w-full border border-dashed border-gray-300 dark:border-gray-600
        ${getPaddingClasses()}
        ${getStickyClasses()}
        ${isSelected ? "outline outline-2 outline-blue-500" : "hover:outline hover:outline-1 hover:outline-gray-400"}
        group
        ${component.tailwindClasses || ""}
      `}
      id={component.id}
      style={{ ...getTextColorStyle(), ...getPaddingStyle() }}
    >
      {component.backgroundImage && <div className="absolute inset-0" style={getBackgroundImageStyle()} />}
      <div className="absolute inset-0" style={getBackgroundColorStyle()} />

      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponent(component.id);
        }}
        className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white text-gray-500 hover:text-gray-700 border border-gray-200/50 z-50 transition-all opacity-0 group-hover:opacity-100 cursor-move"
        title="섹션을 선택하거나 드래그하여 이동"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
          <path d="M12 3v18M12 3l-4 4M12 3l4 4M12 21l-4-4m4 4l4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute top-1 left-1 flex gap-2 z-50 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({
              ...component,
              isFullWidth: !component.isFullWidth,
            });
          }}
          className="p-1 bg-white rounded-full shadow hover:bg-gray-50 text-black"
          title={component.isFullWidth ? "너비 제한" : "가로 100% 확장"}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="black">
            {component.isFullWidth ? (
              <path d="M3 12h18M3 12L7 8M3 12l4 4M21 12l-4-4m4 4l4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <>
                <path fill="currentColor" d="M16.5 12h4.667a.5.5 0 010 1H16.5v2.5a.5.5 0 01-.854.354l-3-3a.5.5 0 010-.708l3-3A.5.5 0 0116.5 9.5V12z" />
                <path fill="currentColor" d="M16.5 12h4.667a.5.5 0 010 1H16.5v2.5a.5.5 0 01-.854.354l-3-3a.5.5 0 010-.708l3-3A.5.5 0 0116.5 9.5V12z" transform="translate(24, 0) scale(-1, 1)" />
              </>
            )}
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({
              ...component,
              layout: component.layout === "horizontal" ? "vertical" : "horizontal",
            });
          }}
          className="p-1 bg-white rounded-full shadow hover:bg-gray-50 text-black"
          title="레이아웃 변경"
        >
          <svg className={`w-4 h-4 ${component.layout === "horizontal" ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="relative" style={getTextColorStyle()}>
        <div className={`w-full mx-auto ${!component.isFullWidth ? "max-w-[1280px]" : ""} ${component.tailwindClasses || ""}`}>
          <div
            className={`flex ${component.layout === "horizontal" ? "flex-row" : "flex-col"} ${component.tailwindClasses || ""}`}
            style={{
              rowGap: component.verticalGap ? `${component.verticalGap}px` : "1rem",
              columnGap: component.horizontalGap ? `${component.horizontalGap}px` : "1rem",
            }}
          >
            {component.children.map((child, childIndex) => {
              const childWithParent = {
                ...child,
                parentId: component.id,
              };
              return (
                <div key={child.id} className={`${component.layout === "horizontal" ? "flex-1" : "w-full"}`}>
                  <DraggableComponent
                    key={child.id}
                    index={childIndex}
                    component={childWithParent}
                    selectedComponent={selectedComponent}
                    setSelectedComponent={setSelectedComponent}
                    isSelected={selectedComponent === child.id}
                    onClick={(e) => {
                      e?.stopPropagation();
                      if (selectedComponent === child.id) {
                        setSelectedComponent(null);
                      } else {
                        setSelectedComponent(child.id);
                      }
                    }}
                    onUpdate={onUpdate}
                    moveComponent={handleMoveComponent}
                    onDelete={() => handleDeleteComponent(child.id)}
                    handleDeleteComponent={handleDeleteComponent}
                    isInSection={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
