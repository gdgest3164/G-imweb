import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Template, LandingComponent, ContainerComponent, ButtonComponent } from "@/lib/types/landing";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getSupabase() {
  return createClient(supabaseUrl, supabaseKey);
}

async function generateTemplateFiles(template: Pick<Template, "title" | "description" | "content">) {
  const files = [];

  try {
    // tsconfig.json
    files.push({
      file_path: "tsconfig.json",
      content: JSON.stringify(
        {
          compilerOptions: {
            target: "ES2017",
            lib: ["dom", "dom.iterable", "esnext"],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            esModuleInterop: true,
            module: "esnext",
            moduleResolution: "bundler",
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: "preserve",
            incremental: true,
            plugins: [
              {
                name: "next",
              },
            ],
            paths: {
              "@/*": ["./*"],
            },
          },
          include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
          exclude: ["node_modules"],
        },
        null,
        2
      ),
    });

    // package.json
    files.push({
      file_path: "package.json",
      content: JSON.stringify(
        {
          name: template.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          version: "0.1.0",
          private: true,
          scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
            lint: "next lint",
          },
          dependencies: {
            "@dnd-kit/core": "^6.3.1",
            "@dnd-kit/sortable": "^10.0.0",
            "@dnd-kit/utilities": "^3.2.2",
            "@headlessui/react": "^2.2.0",
            "@heroicons/react": "^2.2.0",
            "@supabase/auth-helpers-nextjs": "^0.10.0",
            "@supabase/ssr": "^0.5.2",
            "@supabase/supabase-js": "^2.47.10",
            html2canvas: "^1.4.1",
            "lucide-react": "^0.469.0",
            next: "15.1.3",
            "next-themes": "^0.4.4",
            puppeteer: "^23.11.1",
            react: "^19.0.0",
            "react-dnd": "^16.0.1",
            "react-dnd-html5-backend": "^16.0.1",
            "react-dom": "^19.0.0",
            sonner: "^1.7.1",
          },
          devDependencies: {
            "@eslint/eslintrc": "^3",
            "@types/node": "^20",
            "@types/react": "^19",
            "@types/react-dom": "^19",
            daisyui: "^4.12.23",
            eslint: "^9",
            "eslint-config-next": "15.1.3",
            postcss: "^8",
            supabase: "^2.2.1",
            tailwindcss: "^3.4.1",
            typescript: "^5",
          },
        },
        null,
        2
      ),
    });

    // page.tsx
    // 모든 컴포넌트의 HTML 생성
    const generateComponentHtml = (component: LandingComponent, parentClasses: string = ""): string => {
      const classes = `${component.tailwindClasses || ""} ${parentClasses}`.trim();

      switch (component.type) {
        case "text":
          return `
            <div 
              class="${classes} relative overflow-hidden"
              style="
                padding-top: ${component.useDefaultPadding ? "15px" : component.paddingTop ? `${component.paddingTop}px` : "0"};
                padding-bottom: ${component.useDefaultPadding ? "15px" : component.paddingBottom ? `${component.paddingBottom}px` : "0"};
                padding-left: ${component.useDefaultPadding ? "15px" : component.paddingLeft ? `${component.paddingLeft}px` : "0"};
                padding-right: ${component.useDefaultPadding ? "15px" : component.paddingRight ? `${component.paddingRight}px` : "0"};
                border-radius: ${component.borderRadius || 0}px;
                ${(() => {
                  let styles = "";
                  if (component.borderStyle && component.borderStyle !== "none") {
                    styles += `border-style: ${component.borderStyle};`;
                    styles += `border-width: ${component.borderWidth}px;`;
                    if (component.borderColor) {
                      const opacity = component.borderOpacity ?? 1;
                      const color = component.borderColor.startsWith("#")
                        ? `rgba(${parseInt(component.borderColor.slice(1, 3), 16)}, ${parseInt(component.borderColor.slice(3, 5), 16)}, ${parseInt(component.borderColor.slice(5, 7), 16)}, ${opacity})`
                        : component.borderColor;
                      styles += `border-color: ${color};`;
                    }
                  }
                  return styles;
                })()}"
            >
              ${
                component.backgroundImage
                  ? `<div 
                  class="${classes} absolute inset-0 z-0"
                  style="
                    background-image: url(${component.backgroundImage});
                    background-repeat: ${component.backgroundRepeat || "no-repeat"};
                    background-position: center;
                    background-size: cover;
                    border-radius: ${component.borderRadius || 0}px
                  "
                ></div>`
                  : ""
              }
              ${
                component.backgroundColor
                  ? `<div 
                  class="${classes} absolute inset-0 z-10"
                  style="
                    background-color: ${component.backgroundColor};
                    opacity: ${component.backgroundOpacity || 0};
                    border-radius: ${component.borderRadius || 0}px
                  "
                ></div>`
                  : ""
              }
              <div class="${classes} relative z-20">${
            component.linkType && component.linkType !== "none" && component.linkValue
              ? `<a 
                      href="${component.linkType === "url" ? "" : component.linkType === "tel" ? "tel:" : "mailto:"}${component.linkValue}"
                      ${component.openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : ""}
                      class="${classes} cursor-pointer"
                    ><div class="${classes}">${component.content}</div></a>`
              : `<div class="${classes}">${component.content}</div>`
          }</div>
            </div>
          `;

        case "image":
          return component.src
            ? `
            <div class="${classes} ${component.isCircle ? "mx-auto flex flex-col items-center" : "w-full"}">
              <div 
                class="${component.isCircle ? "rounded-full overflow-hidden" : "overflow-hidden"} flex items-center justify-center"
                style="${
                  component.isCircle
                    ? `width: ${component.height || 300}px; height: ${component.height || 300}px;`
                    : component.fixedHeight
                    ? `height: ${component.height || 300}px;${component.borderRadius ? ` border-radius: ${component.borderRadius}px;` : ""}`
                    : component.keepOriginalRatio
                    ? component.borderRadius
                      ? `border-radius: ${component.borderRadius}px;`
                      : ""
                    : `height: ${component.height || 300}px;${component.borderRadius ? ` border-radius: ${component.borderRadius}px;` : ""}`
                }"
              >
                <img 
                  src="${component.src}" 
                  alt="${component.description || component.alt || ""}" 
                  class="${
                    component.isCircle
                      ? "object-cover aspect-square"
                      : `${!component.keepOriginalRatio ? "h-full" : ""} ${component.fillMode === "cover" ? "w-full h-full object-cover" : "object-contain"}`
                  }"
                  style="${component.isCircle ? "" : component.borderRadius ? `border-radius: ${component.borderRadius}px;` : ""}"
                  loading="lazy"
                />
                ${
                  component.backgroundColor
                    ? `
                  <div 
                    class="absolute inset-0 pointer-events-none z-10"
                    style="
                      background-color: ${(() => {
                        const hex = component.backgroundColor.replace("#", "");
                        const r = parseInt(hex.substring(0, 2), 16);
                        const g = parseInt(hex.substring(2, 4), 16);
                        const b = parseInt(hex.substring(4, 6), 16);
                        return `rgba(${r}, ${g}, ${b}, ${component.backgroundOpacity ?? 0})`;
                      })()};
                    "
                  ></div>
                `
                    : ""
                }
                ${
                  component.description && component.descriptionDisplay === "overlay"
                    ? `
                  <div 
                    class="absolute pointer-events-none z-20 p-2 whitespace-nowrap ${(() => {
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
                    })()}"
                    style="
                      color: ${component.descriptionColor || "#000000"};
                      opacity: ${component.descriptionOpacity ?? 1};
                      font-size: ${component.descriptionFontSize || 14}px;
                    "
                  >
                    ${component.description}
                  </div>
                `
                    : ""
                }
              </div>
              ${
                component.description && component.descriptionDisplay === "below"
                  ? `
                <div 
                  class="mt-2 text-center"
                  style="
                    color: ${component.descriptionColor || "#000000"};
                    opacity: ${component.descriptionOpacity ?? 1};
                    font-size: ${component.descriptionFontSize || 14}px;
                  "
                >
                  ${component.description}
                </div>
              `
                  : ""
              }
            </div>
          `
            : "";

        case "button":
          return generateButtonHtml(component as ButtonComponent);

        case "margin":
          return `<div class="${classes}" style="width:100%"></div>`;

        case "divider":
          return `
            <div 
              style="
                display: block;
                width: ${component.width}${component.widthUnit};
                margin-left: ${component.alignment === "right" ? "auto" : component.alignment === "center" ? "auto" : "0"};
                margin-right: ${component.alignment === "center" ? "auto" : "0"};
                padding: .5rem 0;
                cursor: pointer;
              "
            >
              <div
                style="
                  display: block;
                  width: 100%;
                  height: 0px;
                  border: none;
                  border-top: ${component.thickness}px ${component.lineStyle} ${component.color || "#000000"};
                  opacity: ${component.opacity ?? 100};
                "
              ></div>
            </div>
          `;

        case "section":
          const sectionComponent = component as ContainerComponent;
          const backgroundColor = sectionComponent.backgroundColor
            ? (() => {
                const hex = sectionComponent.backgroundColor.replace("#", "");
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `rgba(${r}, ${g}, ${b}, ${sectionComponent.backgroundOpacity || 0})`;
              })()
            : undefined;

          const textColor = sectionComponent.textColor
            ? (() => {
                const hex = sectionComponent.textColor.replace("#", "");
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `rgba(${r}, ${g}, ${b}, ${sectionComponent.textOpacity ?? 1})`;
              })()
            : undefined;

          return `
            <div 
              class="${classes} relative w-full ${sectionComponent.isSticky ? "sticky top-0 z-50" : ""}"
              style="
                ${(() => {
                  let padding = "";
                  if (sectionComponent.verticalPadding && (sectionComponent.verticalPadding >= 15 || !sectionComponent.useDefaultPadding)) {
                    padding += `padding-top: ${sectionComponent.verticalPadding}px;`;
                    padding += `padding-bottom: ${sectionComponent.verticalPadding}px;`;
                  } else if (sectionComponent.useDefaultPadding) {
                    padding += "padding-top: 15px;";
                    padding += "padding-bottom: 15px;";
                  }
                  if (!sectionComponent.useDefaultPadding) {
                    if (sectionComponent.horizontalPadding) {
                      padding += `padding-left: ${sectionComponent.horizontalPadding}px;`;
                      padding += `padding-right: ${sectionComponent.horizontalPadding}px;`;
                    }
                  } else {
                    padding += "padding-left: 15px;";
                    padding += "padding-right: 15px;";
                  }
                  return padding;
                })()}"
            >
              ${
                sectionComponent.backgroundImage
                  ? `<div 
                  class="${classes} absolute inset-0"
                  style="
                    background-image: url(${sectionComponent.backgroundImage});
                    background-repeat: ${sectionComponent.backgroundRepeat || "no-repeat"};
                    background-position: center;
                    background-size: ${sectionComponent.backgroundRepeat !== "no-repeat" ? "auto" : "cover"};
                    ${sectionComponent.backgroundFixed ? "background-attachment: fixed;" : ""}
                  "
                ></div>`
                  : ""
              }
              ${
                backgroundColor
                  ? `<div 
                  class="${classes} absolute inset-0"
                  style="
                    background-color: ${backgroundColor}
                  "
                ></div>`
                  : ""
              }
              <div 
                class="${classes} relative"
                style="
                  color: ${textColor || "inherit"}
                "
              >
                <div class="${classes} w-full mx-auto ${!sectionComponent.isFullWidth ? "max-w-[1280px]" : ""}">
                  <div
                    class="${classes} flex ${sectionComponent.layout === "horizontal" ? "flex-row" : "flex-col"}"
                    style="
                      gap: ${sectionComponent.verticalGap ? `${sectionComponent.verticalGap}px` : "1rem"};
                      column-gap: ${sectionComponent.horizontalGap ? `${sectionComponent.horizontalGap}px` : "1rem"}
                    "
                  >
                    ${sectionComponent.children
                      .map(
                        (child: LandingComponent) => `
                      <div class="${classes} ${sectionComponent.layout === "horizontal" ? "flex-1" : "w-full"}">
                        ${generateComponentHtml(child, classes)}
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              </div>
            </div>
          `;

        default:
          return "";
      }
    };

    function hexToRgb(hex: string) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 0, 0";
    }

    function generateButtonHtml(component: ButtonComponent) {
      const buttonStyle = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${component.fullWidth ? "100%" : "auto"};
        padding: ${component.paddingY}px ${component.paddingX}px;
        font-size: ${component.fontSize}px;
        letter-spacing: ${component.letterSpacing}px;
        background-color: ${
          component.backgroundColor
            ? `rgba(${hexToRgb(component.backgroundColor)}, ${component.backgroundOpacity ?? 1})`
            : component.variant === "primary"
            ? "rgb(37, 99, 235)"
            : component.variant === "secondary"
            ? "rgb(107, 114, 128)"
            : "transparent"
        };
        color: ${
          component.textColor ? `rgba(${hexToRgb(component.textColor)}, ${component.textOpacity ?? 1})` : component.variant === "primary" || component.variant === "secondary" ? "white" : "inherit"
        };
        border-width: ${component.borderWidth ? `${component.borderWidth}px` : component.variant === "outline" ? "1px" : "0px"};
        border-style: ${component.borderStyle || "solid"};
        border-color: ${component.borderColor ? `rgba(${hexToRgb(component.borderColor)}, ${component.borderOpacity ?? 1})` : component.variant === "outline" ? "rgb(209, 213, 219)" : "transparent"};
        border-radius: ${
          component.useCustomBorderRadius
            ? `${component.borderRadiusTopLeft || 0}px ${component.borderRadiusTopRight || 0}px ${component.borderRadiusBottomRight || 0}px ${component.borderRadiusBottomLeft || 0}px`
            : `${component.borderRadius || 0}px`
        };
        transition: all 0.2s;
      `;

      const hoverStyle = `
        ${
          component.hoverBackgroundColor
            ? `background-color: rgba(${hexToRgb(component.hoverBackgroundColor)}, ${component.hoverBackgroundOpacity ?? component.backgroundOpacity ?? 1}) !important;`
            : ""
        }
        ${component.hoverTextColor ? `color: rgba(${hexToRgb(component.hoverTextColor)}, ${component.hoverTextOpacity ?? component.textOpacity ?? 1}) !important;` : ""}
        ${component.hoverBorderColor ? `border-color: rgba(${hexToRgb(component.hoverBorderColor)}, ${component.hoverBorderOpacity ?? component.borderOpacity ?? 1}) !important;` : ""}
        ${component.hoverBorderWidth ? `border-width: ${component.hoverBorderWidth}px !important;` : ""}
        ${component.hoverBorderStyle ? `border-style: ${component.hoverBorderStyle} !important;` : ""}
      `;

      const containerStyle = `
        display: flex;
        justify-content: ${component.align === "center" ? "center" : component.align === "right" ? "flex-end" : "flex-start"};
        width: ${component.fullWidth ? "100%" : "auto"};
      `;

      const iconHtml = component.icon ? `<i class="lucide-${component.icon}" style="width: ${component.iconSize || 16}px; height: ${component.iconSize || 16}px;"></i>` : "";

      const buttonContent = `
        <div class="flex items-center justify-center gap-2">
          ${component.iconPosition === "left" ? iconHtml : ""}
          ${component.text}
          ${component.iconPosition === "right" ? iconHtml : ""}
        </div>
      `;

      const uniqueClassName = `hover-button-${component.id}`;

      const buttonHtml = component.link
        ? `<div style="${containerStyle}">
            <style>
              .${uniqueClassName}:hover {
                ${hoverStyle}
              }
            </style>
            <a href="${component.link}"${component.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ""} 
               class="${uniqueClassName}" style="${buttonStyle}">${buttonContent}</a>
          </div>`
        : `<div style="${containerStyle}">
            <style>
              .${uniqueClassName}:hover {
                ${hoverStyle}
              }
            </style>
            <button class="${uniqueClassName}" style="${buttonStyle}">${buttonContent}</button>
          </div>`;

      return buttonHtml;
    }

    const finalHtml = (() => {
      const result: string[] = [];
      let currentGroup: LandingComponent[] = [];

      template.content.forEach((component) => {
        const isSticky = component.type === "section" && (component as ContainerComponent).isSticky;

        if (isSticky && currentGroup.length > 0) {
          // 현재 그룹의 컴포넌트들을 렌더링
          result.push(`<div class="flex flex-col">${currentGroup.map((groupComponent) => generateComponentHtml(groupComponent, "")).join("")}</div>`);
          currentGroup = [];
        }

        currentGroup.push(component);
      });

      // 마지막 그룹 처리
      if (currentGroup.length > 0) {
        result.push(`<div class="flex flex-col">${currentGroup.map((groupComponent) => generateComponentHtml(groupComponent, "")).join("")}</div>`);
      }

      return result.join("");
    })();

    // 모든 불필요한 공백과 줄바꿈 제거
    const cleanHtml = finalHtml
      .replace(/>\s+</g, "><") // 태그 사이의 공백 제거
      .replace(/\s+/g, " ") // 연속된 공백을 하나로
      .replace(/\s+"/g, '"') // 속성 앞의 공백 제거
      .replace(/"\s+/g, '"') // 속성 뒤의 공백 제거
      .trim(); // 앞뒤 공백 제거

    files.push({
      file_path: "app/page.tsx",
      content: `import React from "react";
import "./globals.css";

export default function Page() {
  return (
    <div className="min-h-screen">
      <main className="flex flex-col">
        <div dangerouslySetInnerHTML={{ __html: \`${cleanHtml}\` }} />
      </main>
    </div>
  );
}`,
    });

    // layout.tsx
    files.push({
      file_path: "app/layout.tsx",
      content: `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}`,
    });

    // globals.css
    files.push({
      file_path: "app/globals.css",
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

/* @media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
} */

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}
`,
    });

    // tailwind.config.ts
    files.push({
      file_path: "tailwind.config.ts",
      content: `import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  darkMode: "class",
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  daisyui: {
    themes: ["light", "dark"],
    theme: "light",
    darkTheme: "dark",
  },
  plugins: [daisyui],
} satisfies Config;`,
    });

    // postcss.config.mjs
    files.push({
      file_path: "postcss.config.mjs",
      content: `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;`,
    });

    // next.config.js
    files.push({
      file_path: "next.config.js",
      content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["encrypted-tbn0.gstatic.com", \`\${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co\`, "via.placeholder.com", "ajtuatrmeflcilccvujc.supabase.co"],
  },
};

module.exports = nextConfig;
`,
    });

    return files;
  } catch (error) {
    console.error("Error generating template files:", error);
    throw error;
  }
}

export const dynamic = "force-dynamic";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { template } = body;
    const { id } = await context.params;

    // 템플릿 업데이트
    const { error: templateError } = await supabase.from("templates").update(template).eq("id", id);

    if (templateError) throw templateError;

    // 템플릿 파일들 생성
    const files = await generateTemplateFiles(template);

    // 기존 파일 삭제
    const { error: deleteError } = await supabase.from("template_files").delete().eq("template_id", id);

    if (deleteError) throw deleteError;

    // 새로운 파일 저장
    const { error: filesError } = await supabase.from("template_files").insert(
      files.map((file) => ({
        template_id: id,
        file_path: file.file_path,
        content: file.content,
      }))
    );

    if (filesError) {
      console.error("Error saving template files:", filesError);
      throw filesError;
    }

    // 도메인 생성 (템플릿 제목 기반)
    const domain = `${template.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.vercel.app`;

    return NextResponse.json({
      success: true,
      domain,
      previewUrl: `https://${domain}`,
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update template" }, { status: 500 });
  }
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const supabase = getSupabase();
    const { id } = await context.params;

    const { data: template, error: templateError } = await supabase.from("templates").select("*").eq("id", id).single();

    if (templateError) throw templateError;

    // 템플릿 파일 조회
    const { data: files, error: filesError } = await supabase.from("template_files").select("*").eq("template_id", id);

    if (filesError) throw filesError;

    return NextResponse.json({ template, files });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = getSupabase();
    const { id } = await context.params;

    // 템플릿 파일 삭제
    const { error: filesError } = await supabase.from("template_files").delete().eq("template_id", id);
    if (filesError) throw filesError;

    // 템플릿 삭제
    const { error: templateError } = await supabase.from("templates").delete().eq("id", id);
    if (templateError) throw templateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete template" }, { status: 500 });
  }
}
