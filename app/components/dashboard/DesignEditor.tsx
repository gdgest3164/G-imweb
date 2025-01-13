"use client";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LandingComponent, ComponentType, TextComponent, ImageComponent, ButtonComponent, MarginComponent, ContainerComponent, DividerComponent } from "@/lib/types/landing";
import { DraggableComponent } from "@/app/components/dashboard/DraggableComponent";
import { PropertyPanel } from "@/app/components/dashboard/PropertyPanel";
import { SectionTemplate } from "@/app/lib/api/section-templates";
import { DragPreviewMap } from "./components/DragPreviewMap";
import { PopupEditor } from "./components/PopupEditor";
import { applyButtonStyle } from "./components/ButtonComponent";
import { v4 as uuidv4 } from "uuid";

interface DesignEditorProps {
  components: LandingComponent[];
  onChange: (components: LandingComponent[]) => void;
}

export const createDefaultComponent = (type: LandingComponent["type"]): LandingComponent => {
  const baseProps = {
    id: crypto.randomUUID(),
    style: {},
    tailwindClasses: "",
  };

  switch (type) {
    case "text":
      return {
        ...baseProps,
        type: "text",
        content: "새로운 텍스트",
        fontSize: "1em",
        textAlign: "left",
        letterSpacing: "0",
      };
    case "image":
      return {
        ...baseProps,
        type: "image",
        src: "https://via.placeholder.com/150",
        alt: "이미지 설명",
      };
    case "button":
      const defaultButton = {
        ...baseProps,
        type: "button",
        text: "button",
        variant: "primary",
        fontSize: 16,
        paddingX: 24,
        paddingY: 12,
        letterSpacing: 0,
        fullWidth: false,
        align: "center",
        style: {},
        tailwindClasses: "",
      } as Extract<LandingComponent, { type: "button" }>;

      return applyButtonStyle(defaultButton);
    case "margin":
      return {
        ...baseProps,
        type: "margin",
        tailwindClasses: "w-full h-10",
      };
    case "section":
      return {
        ...baseProps,
        type: "section",
        children: [],
        layout: "vertical",
        useDefaultPadding: true,
        backgroundColor: "#ffffff",
        backgroundOpacity: 1,
        isSticky: false,
      };
    default:
      throw new Error(`Unsupported component type: ${type}`);
  }
};

export function DesignEditor({ components, onChange }: DesignEditorProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDraggingSection, setIsDraggingSection] = useState(false);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingContent, setEditingContent] = useState("");

  const addComponentToSection = (components: LandingComponent[], sectionId: string, newComponent: LandingComponent, selectedId: string | null): LandingComponent[] => {
    return components.map((comp) => {
      if (comp.id === sectionId && comp.type === "section") {
        const children = (comp as ContainerComponent).children;
        if (selectedId) {
          const selectedIndex = children.findIndex((child) => child.id === selectedId);
          if (selectedIndex !== -1) {
            const newChildren = [...children];
            newChildren.splice(selectedIndex + 1, 0, newComponent);
            return {
              ...comp,
              children: newChildren,
            };
          }
        }
        return {
          ...comp,
          children: [...children, newComponent],
        };
      }
      if (comp.type === "section") {
        return {
          ...comp,
          children: addComponentToSection((comp as ContainerComponent).children, sectionId, newComponent, selectedId),
        };
      }
      return comp;
    });
  };

  const addComponent = (type: ComponentType) => {
    const baseComponent = {
      id: uuidv4(),
      type,
      style: {},
      tailwindClasses: "",
    };

    let newComponent: LandingComponent;

    switch (type) {
      case "text":
        newComponent = {
          ...baseComponent,
          content: "텍스트를 입력하세요",
          fontSize: 16,
          textAlign: "left" as const,
          letterSpacing: 0,
        } as TextComponent;
        break;
      case "image":
        newComponent = {
          ...baseComponent,
          alt: "",
          fillMode: "cover" as const,
          height: 200,
          fixedHeight: true,
          keepOriginalRatio: true,
        } as ImageComponent;
        break;
      case "button":
        newComponent = {
          ...baseComponent,
          text: "버튼",
          variant: "primary" as const,
          fontSize: 16,
          paddingX: 16,
          paddingY: 8,
          letterSpacing: 0,
          fullWidth: false,
          align: "left" as const,
        } as ButtonComponent;
        break;
      case "margin":
        newComponent = baseComponent as MarginComponent;
        break;
      case "section":
        newComponent = {
          ...baseComponent,
          children: [],
          layout: "vertical" as const,
        } as ContainerComponent;
        break;
      case "divider":
        newComponent = {
          ...baseComponent,
          thickness: 1,
          alignment: "center" as const,
          lineStyle: "solid" as const,
          color: "#000000",
          opacity: 100,
          width: 100,
          widthUnit: "%" as const,
        } as DividerComponent;
        break;
      default:
        newComponent = baseComponent as LandingComponent;
    }

    // 선택된 컴포넌트가 있는 경우
    if (selectedComponent) {
      const selectedComp = findComponentById(components, selectedComponent);
      if (selectedComp) {
        // 선택된 컴포넌트가 섹션인 경우, 섹션 내부에 추가
        if (selectedComp.type === "section") {
          const newComponents = addComponentToSection(components, selectedComponent, newComponent, null);
          onChange(newComponents);
          setSelectedComponent(newComponent.id);
          scrollToComponent(newComponent.id);
          return;
        }

        // 선택된 컴포넌트의 부모 섹션을 찾습니다
        const parentSection = findParentSection(components, selectedComponent);
        if (parentSection) {
          const newComponents = addComponentToSection(components, parentSection.id, newComponent, selectedComponent);
          onChange(newComponents);
          setSelectedComponent(newComponent.id);
          scrollToComponent(newComponent.id);
          return;
        }

        // 섹션이 없는 경우, 새로운 섹션을 생성하고 그 안에 컴포넌트를 추가
        const newSection = {
          ...baseComponent,
          id: uuidv4(),
          type: "section" as const,
          children: [newComponent],
          layout: "vertical" as const,
        } as ContainerComponent;

        const selectedIndex = components.findIndex((c) => c.id === selectedComponent);
        if (selectedIndex !== -1) {
          const newComponents = [...components];
          newComponents.splice(selectedIndex + 1, 0, newSection);
          onChange(newComponents);
          setSelectedComponent(newComponent.id);
          scrollToComponent(newComponent.id);
          return;
        }
      }
    }

    // 선택된 컴포넌트가 없는 경우
    if (type === "section") {
      // 섹션을 직접 추가
      const newComponents = [...components, newComponent];
      onChange(newComponents);
      setSelectedComponent(newComponent.id);
      scrollToComponent(newComponent.id);
    } else {
      // 섹션이 아닌 경우, 새로운 섹션을 생성하고 그 안에 컴포넌트를 추가
      const newSection = {
        ...baseComponent,
        id: uuidv4(),
        type: "section" as const,
        children: [newComponent],
        layout: "vertical" as const,
      } as ContainerComponent;
      const newComponents = [...components, newSection];
      onChange(newComponents);
      setSelectedComponent(newComponent.id);
      scrollToComponent(newComponent.id);
    }
  };

  const updateComponentById = (components: LandingComponent[], id: string, updatedComponent: LandingComponent): LandingComponent[] => {
    return components.map((component) => {
      if (component.id === id) {
        return {
          ...component,
          ...updatedComponent,
        };
      }
      if (component.type === "section") {
        return {
          ...component,
          children: updateComponentById((component as ContainerComponent).children, id, updatedComponent),
        };
      }
      return component;
    });
  };

  const handleComponentUpdate = (updated: LandingComponent) => {
    const newComponents = updateComponentById(components, updated.id, updated);
    onChange(newComponents);
  };

  const moveComponent = (dragIndex: number, hoverIndex: number) => {
    const newComponents = [...components];
    if (dragIndex < 0 || dragIndex >= newComponents.length || hoverIndex < 0 || hoverIndex >= newComponents.length) {
      return;
    }
    const [draggedComponent] = newComponents.splice(dragIndex, 1);
    if (!draggedComponent) {
      return;
    }
    newComponents.splice(hoverIndex, 0, draggedComponent);
    onChange(newComponents);
  };

  const deleteComponentById = (components: LandingComponent[], id: string): LandingComponent[] => {
    return components
      .map((comp) => {
        if (comp.type === "section") {
          return {
            ...comp,
            children: deleteComponentById((comp as ContainerComponent).children, id),
          };
        }
        return comp;
      })
      .filter((comp) => comp.id !== id);
  };

  const handleDeleteComponent = (componentId: string) => {
    const newComponents = deleteComponentById(components, componentId);
    onChange(newComponents);
    if (selectedComponent === componentId) {
      setSelectedComponent(null);
    }
  };

  const findComponentById = (components: LandingComponent[], id: string): LandingComponent | undefined => {
    for (const component of components) {
      if (component.id === id) {
        return component;
      }
      if (component.type === "section") {
        const found = findComponentById((component as ContainerComponent).children, id);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  };

  // 컴포넌트의 부모 섹션을 찾는 함수
  const findParentSection = (components: LandingComponent[], childId: string): LandingComponent | null => {
    for (const comp of components) {
      if (comp.type === "section") {
        if ((comp as ContainerComponent).children.some((child) => child.id === childId)) {
          return comp;
        }
        const found = findParentSection((comp as ContainerComponent).children, childId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const handleTemplateSelect = (template: SectionTemplate) => {
    setIsModalOpen(false);

    // 모든 컴포넌트의 ID를 새로 생성하는 함수
    const regenerateIds = (component: LandingComponent): LandingComponent => {
      const newComponent = {
        ...component,
        id: crypto.randomUUID(),
      };

      if (newComponent.type === "section") {
        return {
          ...newComponent,
          children: (newComponent as ContainerComponent).children.map(regenerateIds),
        };
      }

      return newComponent;
    };

    const newComponent = regenerateIds(template.content);

    if (selectedComponent) {
      const selectedComp = findComponentById(components, selectedComponent);
      if (selectedComp) {
        // 선택된 컴포넌트가 섹션인 경우, 섹션 내부에 추가
        if (selectedComp.type === "section") {
          const newComponents = addComponentToSection(components, selectedComponent, newComponent, null);
          onChange(newComponents);
          setSelectedComponent(newComponent.id);
          scrollToComponent(newComponent.id);
          return;
        }

        // 선택된 컴포넌트의 부모 섹션을 찾습니다
        const parentSection = findParentSection(components, selectedComponent);
        if (parentSection) {
          const newComponents = addComponentToSection(components, parentSection.id, newComponent, selectedComponent);
          onChange(newComponents);
          setSelectedComponent(newComponent.id);
          scrollToComponent(newComponent.id);
          return;
        }

        // 섹션이 아닌 경우, 선택된 컴포넌트 다음에 추가
        const selectedIndex = components.findIndex((c) => c.id === selectedComponent);
        if (selectedIndex !== -1) {
          const newComponents = [...components];
          newComponents.splice(selectedIndex + 1, 0, newComponent);
          onChange(newComponents);
          setSelectedComponent(newComponent.id);
          scrollToComponent(newComponent.id);
          return;
        }
      }
    }

    // 선택된 컴포넌트가 없는 경우, 맨 끝에 추가
    onChange([...components, newComponent]);
    setSelectedComponent(newComponent.id);
    scrollToComponent(newComponent.id);
  };

  // 컴포넌트로 스크롤하는 함수
  const scrollToComponent = (componentId: string) => {
    setTimeout(() => {
      const element = document.getElementById(componentId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setSelectedComponent(componentId);
      }
    }, 100);
  };

  const handleTextEdit = (content: string) => {
    if (selectedComponent) {
      const selectedComp = findComponentById(components, selectedComponent);
      if (selectedComp?.type === "text") {
        handleComponentUpdate({
          ...selectedComp,
          content,
        });
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen relative bg-gray-50 dark:bg-gray-800">
        {/* 컴포넌트 툴바 */}
        <div className="w-[200px] p-4 sticky top-[50px] h-full overflow-y-auto dark:text-white">
          <div className="space-y-2">
            <button onClick={() => addComponent("section")} className="w-full p-2 bg-white rounded shadow hover:bg-gray-50 dark:text-white dark:bg-gray-600">
              섹션 추가
            </button>
            <button onClick={() => addComponent("text")} className="w-full p-2 bg-white rounded shadow hover:bg-gray-50 dark:text-white dark:bg-gray-600">
              텍스트 추가
            </button>
            <button onClick={() => addComponent("image")} className="w-full p-2 bg-white rounded shadow hover:bg-gray-50 dark:text-white dark:bg-gray-600">
              이미지 추가
            </button>
            <button onClick={() => addComponent("button")} className="w-full p-2 bg-white rounded shadow hover:bg-gray-50 dark:text-white dark:bg-gray-600">
              버튼 추가
            </button>
            <button onClick={() => addComponent("margin")} className="w-full p-2 bg-white rounded shadow hover:bg-gray-50 dark:text-white dark:bg-gray-600">
              여백 추가
            </button>
            <button onClick={() => addComponent("divider")} className="w-full p-2 bg-white rounded shadow hover:bg-gray-50 dark:text-white dark:bg-gray-600">
              가로선 추가
            </button>
          </div>
        </div>

        {/* 미리보기 영역 */}
        <div className={`relative flex-1 ${isModalOpen ? "pointer-events-none" : ""} my-1`}>
          <div className="mx-auto p-4">
            <div className="bg-white rounded-lg shadow-xl">
              <div className="min-h-screen">
                {components.map((component, index) => (
                  <DraggableComponent
                    key={component.id}
                    index={index}
                    component={component}
                    selectedComponent={selectedComponent}
                    setSelectedComponent={setSelectedComponent}
                    isSelected={selectedComponent === component.id}
                    onClick={(e?: React.MouseEvent) => {
                      if (e) {
                        e.stopPropagation();
                      }
                      if (selectedComponent === component.id) {
                        setSelectedComponent(null);
                      } else {
                        setSelectedComponent(component.id);
                      }
                    }}
                    onUpdate={handleComponentUpdate}
                    moveComponent={moveComponent}
                    onDelete={() => handleDeleteComponent(component.id)}
                    handleDeleteComponent={handleDeleteComponent}
                    onDragStart={(id) => {
                      setIsDraggingSection(true);
                      setDraggedSectionId(id);
                    }}
                    onDragEnd={() => {
                      setIsDraggingSection(false);
                      setDraggedSectionId(null);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* 미니맵 */}
          <DragPreviewMap
            components={components}
            selectedComponent={selectedComponent}
            moveComponent={moveComponent}
            onComponentClick={scrollToComponent}
            isDragging={isDraggingSection}
            draggedSectionId={draggedSectionId}
          />
        </div>

        {/* 속성 패널 */}
        <div className={`w-[300px] p-4 sticky top-[50px] h-full overflow-y-auto dark:text-white ${isModalOpen ? "pointer-events-none" : ""}`}>
          {selectedComponent && (
            <>
              {(() => {
                const selectedComp = findComponentById(components, selectedComponent);
                return selectedComp ? (
                  <PropertyPanel
                    component={selectedComp}
                    onChange={handleComponentUpdate}
                    onOpenEditor={(content) => {
                      setEditingContent(content);
                      setIsEditorOpen(true);
                    }}
                  />
                ) : (
                  <div className="text-gray-500">선택된 컴포넌트를 찾을 수 없습니다.</div>
                );
              })()}
            </>
          )}
        </div>

        {/* 상단 헤더 */}
        <div className={`sticky top-0 h-[50px] bg-white/80 dark:bg-gray-500/80 backdrop-blur-sm ${isModalOpen ? "pointer-events-none" : ""}`} />

        {/* 팝업 에디터 */}
        <PopupEditor value={editingContent} onChange={handleTextEdit} onClose={() => setIsEditorOpen(false)} isOpen={isEditorOpen} />
      </div>
    </DndProvider>
  );
}
