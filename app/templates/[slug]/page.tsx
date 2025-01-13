import React from "react";
import { getTemplate } from "@/lib/api/templates";
import { LandingComponent, ContainerComponent } from "@/lib/types/landing";
import { ClientButton } from "@/app/components/templates/ClientButton";
import { DividerComponent } from "@/app/components/dashboard/components/DividerComponent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 정적 경로 생성
export async function generateStaticParams() {
  return []; // 임시로 빈 배열 반환
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const template = await getTemplate(slug);

  const getBackgroundStyle = (comp: LandingComponent): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if ("backgroundColor" in comp && comp.backgroundColor) {
      const opacity = comp.backgroundOpacity ?? 0;
      const hex = comp.backgroundColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    return style;
  };

  const renderComponent = (component: LandingComponent) => {
    const classes = component.tailwindClasses || "";

    switch (component.type) {
      case "text":
        const imageStyles: React.CSSProperties = {
          backgroundImage: component.backgroundImage ? `url(${component.backgroundImage})` : undefined,
          backgroundRepeat: component.backgroundRepeat || undefined,
          backgroundAttachment: component.backgroundFixed ? "fixed" : undefined,
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderRadius: component.borderRadius ? `${component.borderRadius}px` : undefined,
        };

        const getTextPaddingStyle = (): React.CSSProperties => {
          const style: React.CSSProperties = {
            paddingTop: component.useDefaultPadding ? "15px" : component.paddingTop ? `${component.paddingTop}px` : undefined,
            paddingBottom: component.useDefaultPadding ? "15px" : component.paddingBottom ? `${component.paddingBottom}px` : undefined,
            paddingLeft: component.useDefaultPadding ? "15px" : component.paddingLeft ? `${component.paddingLeft}px` : undefined,
            paddingRight: component.useDefaultPadding ? "15px" : component.paddingRight ? `${component.paddingRight}px` : undefined,
            borderRadius: component.borderRadius ? `${component.borderRadius}px` : undefined,
          };

          // 테두리 스타일 추가
          if (component.borderStyle && component.borderStyle !== "none") {
            style.borderStyle = component.borderStyle;
            style.borderWidth = `${component.borderWidth || 1}px`;
            if (component.borderColor) {
              const opacity = component.borderOpacity ?? 1;
              const color = component.borderColor.startsWith("#")
                ? `rgba(${parseInt(component.borderColor.slice(1, 3), 16)}, ${parseInt(component.borderColor.slice(3, 5), 16)}, ${parseInt(component.borderColor.slice(5, 7), 16)}, ${opacity})`
                : component.borderColor;
              style.borderColor = color;
            }
          }

          return style;
        };

        const getTextStyle = (): React.CSSProperties => {
          const style: React.CSSProperties = {};

          // 텍스트 스타일 추가
          if (component.textColor) {
            const opacity = component.textOpacity ?? 1;
            const hex = component.textColor.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            style.color = `rgba(${r}, ${g}, ${b}, ${opacity})`;
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
          <div className={`${classes} relative overflow-hidden`} style={getTextPaddingStyle()}>
            {/* 배경 이미지 레이어 */}
            {component.backgroundImage && <div className={`absolute inset-0 z-0 ${classes}`} style={imageStyles} />}

            {/* 배경색 레이어 */}
            {component.backgroundColor && <div className={`absolute inset-0 z-10 ${classes}`} style={getBackgroundStyle(component)} />}

            {/* 텍스트 레이어 */}
            <div className={`relative z-20 ${classes}`} style={getTextStyle()}>
              {component.linkType && component.linkType !== "none" && component.linkValue ? (
                <a
                  href={`${component.linkType === "url" ? "" : component.linkType === "tel" ? "tel:" : "mailto:"}${component.linkValue}`}
                  {...(component.openInNewTab
                    ? {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                  className={`cursor-pointer ${classes}`}
                >
                  <div dangerouslySetInnerHTML={{ __html: component.content }} className={classes} />
                </a>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: component.content }} className={classes} />
              )}
            </div>
          </div>
        );
      case "image":
        if (!component.src) {
          return null;
        }

        const containerClasses = component.isCircle ? "mx-auto flex flex-col items-center" : component.fillMode === "cover" ? "w-full" : "mx-auto";
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

        return (
          <div className={`${containerClasses} ${classes}`}>
            <div className={`${component.isCircle ? "rounded-full overflow-hidden" : "overflow-hidden"} flex items-center justify-center relative`} style={style}>
              <img
                src={component.src}
                alt={component.alt || ""}
                className={`${
                  component.isCircle
                    ? "object-cover aspect-square"
                    : `${!component.keepOriginalRatio ? "h-full" : ""} ${component.fillMode === "cover" ? "w-full h-full object-cover" : "object-contain"}`
                } z-0`}
                style={borderStyle}
                loading="lazy"
              />
              {component.backgroundColor && <div className="absolute inset-0 pointer-events-none z-10" style={getBackgroundStyle(component)} />}
              {component.description && component.descriptionDisplay === "overlay" && (
                <div
                  className={`absolute pointer-events-none z-20 p-2 whitespace-nowrap ${(() => {
                    switch (component.descriptionPosition) {
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
                        return "bottom-2 right-2";
                    }
                  })()} ${component.isCircle ? "rounded-full" : ""}`}
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
      case "button":
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
            ? `rgba(${parseInt(component.textColor.slice(1, 3), 16)}, ${parseInt(component.textColor.slice(3, 5), 16)}, ${parseInt(component.textColor.slice(5, 7), 16)}, ${
                component.textOpacity ?? 1
              })`
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
          justifyContent: component.align === "center" ? "center" : component.align === "right" ? "flex-end" : "flex-start",
          width: component.fullWidth ? "100%" : "auto",
        };

        return <ClientButton component={component} buttonStyle={buttonStyle} containerStyle={containerStyle} classes={classes} />;
      case "margin":
        return <div className={classes} />;
      case "divider":
        return <DividerComponent component={component} />;
      case "section":
        const sectionComponent = component as ContainerComponent;

        const getSectionPaddingStyle = (): React.CSSProperties => {
          const style: React.CSSProperties = {};

          // 상하 여백: 15px 이상이면 무조건 적용, 아니면 기본 여백 미사용시에만 적용
          if (sectionComponent.verticalPadding && (sectionComponent.verticalPadding >= 15 || !sectionComponent.useDefaultPadding)) {
            style.paddingTop = `${sectionComponent.verticalPadding}px`;
            style.paddingBottom = `${sectionComponent.verticalPadding}px`;
          } else if (sectionComponent.useDefaultPadding) {
            style.paddingTop = "15px";
            style.paddingBottom = "15px";
          }

          // 좌우 여백과 간격: 기본 여백 미사용시에만 적용
          if (!sectionComponent.useDefaultPadding) {
            if (sectionComponent.horizontalPadding) {
              style.paddingLeft = `${sectionComponent.horizontalPadding}px`;
              style.paddingRight = `${sectionComponent.horizontalPadding}px`;
            }
            if (sectionComponent.verticalGap) {
              style.rowGap = `${sectionComponent.verticalGap}px`;
            }
            if (sectionComponent.horizontalGap) {
              style.columnGap = `${sectionComponent.horizontalGap}px`;
            }
          } else {
            style.paddingLeft = "15px";
            style.paddingRight = "15px";
          }

          return style;
        };

        const getBackgroundImageStyle = (): React.CSSProperties => {
          const style: React.CSSProperties = {};

          if (sectionComponent.backgroundImage) {
            style.backgroundImage = `url(${sectionComponent.backgroundImage})`;
            style.backgroundRepeat = sectionComponent.backgroundRepeat || "no-repeat";
            style.backgroundPosition = "center";
            style.backgroundSize = sectionComponent.backgroundRepeat !== "no-repeat" ? "auto" : "cover";
            if (sectionComponent.backgroundFixed) {
              style.backgroundAttachment = "fixed";
            }
          }

          return style;
        };

        const getBackgroundColorStyle = (): React.CSSProperties => {
          const style: React.CSSProperties = {};

          if (sectionComponent.backgroundColor) {
            const opacity = sectionComponent.backgroundOpacity ?? 0;
            const hex = sectionComponent.backgroundColor.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          }

          return style;
        };

        const getStickyClasses = () => {
          if (sectionComponent.isSticky) {
            return "sticky top-0 z-50";
          }
          return "";
        };

        const getTextColorStyle = (): React.CSSProperties => {
          const style: React.CSSProperties = {};

          if (sectionComponent.textColor) {
            const opacity = sectionComponent.textOpacity ?? 1;
            const hex = sectionComponent.textColor.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            style.color = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          }

          return style;
        };

        return (
          <div className={`relative w-full ${getStickyClasses()} ${classes}`} style={getSectionPaddingStyle()}>
            {sectionComponent.backgroundImage && <div className={`absolute inset-0 ${classes}`} style={getBackgroundImageStyle()} />}
            <div className={`absolute inset-0 ${classes}`} style={getBackgroundColorStyle()} />
            <div className={`relative ${classes}`} style={getTextColorStyle()}>
              <div className={`w-full mx-auto ${!sectionComponent.isFullWidth ? "max-w-[1280px]" : ""} ${classes}`}>
                <div
                  className={`flex ${sectionComponent.layout === "horizontal" ? "flex-row" : "flex-col"} ${classes}`}
                  style={{
                    gap: sectionComponent.verticalGap ? `${sectionComponent.verticalGap}px` : "1rem",
                    columnGap: sectionComponent.horizontalGap ? `${sectionComponent.horizontalGap}px` : "1rem",
                  }}
                >
                  {sectionComponent.children.map((child) => (
                    <div key={child.id} className={`${sectionComponent.layout === "horizontal" ? "flex-1" : "w-full"} ${classes}`}>
                      {renderComponent(child)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <main className="flex flex-col">
        {(() => {
          const result: React.ReactElement[] = [];
          let currentGroup: LandingComponent[] = [];

          (template.content as LandingComponent[]).forEach((component: LandingComponent, index) => {
            const isSticky = component.type === "section" && (component as ContainerComponent).isSticky;

            if (isSticky && currentGroup.length > 0) {
              // 현재 그룹의 컴포넌트들을 렌더링
              result.push(
                <div key={`group-${index}`}>
                  {currentGroup.map((groupComponent) => (
                    <React.Fragment key={groupComponent.id}>{renderComponent(groupComponent)}</React.Fragment>
                  ))}
                </div>
              );
              currentGroup = [];
            }

            currentGroup.push(component);
          });

          // 마지막 그룹 처리
          if (currentGroup.length > 0) {
            result.push(
              <div key="last-group">
                {currentGroup.map((groupComponent) => (
                  <React.Fragment key={groupComponent.id}>{renderComponent(groupComponent)}</React.Fragment>
                ))}
              </div>
            );
          }

          return result;
        })()}
      </main>
    </div>
  );
}
