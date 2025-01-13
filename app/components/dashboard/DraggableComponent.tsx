import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { LandingComponent } from "@/lib/types/landing";
import React, { useRef, useState, useEffect } from "react";
import { TextComponent } from "./components/TextComponent";
import { ImageComponent } from "./components/ImageComponent";
import { ButtonComponent } from "./components/ButtonComponent";
import { MarginComponent } from "./components/MarginComponent";
import { SectionComponent } from "./components/SectionComponent";
import ContextMenu from "./components/ContextMenu";
import { DividerComponent } from "./components/DividerComponent";

// 전역 상태로 현재 열린 컨텍스트 메뉴 관리
let activeContextMenu: string | null = null;

interface DraggableComponentProps {
  component: LandingComponent;
  index: number;
  isSelected: boolean;
  selectedComponent?: string | null;
  setSelectedComponent: (id: string | null) => void;
  onClick: (e?: React.MouseEvent) => void;
  onUpdate: (component: LandingComponent) => void;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  onDelete: () => void;
  handleDeleteComponent: (id: string) => void;
  isInSection?: boolean;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
}

interface DragItem {
  id: string;
  index: number;
  isInSection?: boolean;
  parentId?: string;
  type: string;
}

export function DraggableComponent({
  component,
  index,
  isSelected,
  selectedComponent,
  setSelectedComponent,
  onClick,
  onUpdate,
  moveComponent,
  onDelete,
  handleDeleteComponent,
  isInSection,
  onDragStart,
  onDragEnd,
}: DraggableComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const [{ isDragging }, drag, preview] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: isInSection ? "section-component" : component.type === "section" ? "section" : "component",
    item: () => {
      if (component.type === "section" && onDragStart) {
        onDragStart(component.id);
      }
      return { id: component.id, index, isInSection, parentId: component.parentId, type: component.type };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (component.type === "section" && onDragEnd) {
        onDragEnd();
      }
      if (!monitor.didDrop()) {
        // 드롭이 실패한 경우의 처리
        return;
      }
    },
    canDrag: () => {
      // 섹션 내부에서는 모든 컴포넌트 드래그 가능
      if (isInSection) return true;
      // 섹션 외부에서는 섹션만 드래그 가능
      return component.type === "section";
    },
  });

  // 드래그 초기화 및 프리뷰 설정
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
    return () => {
      preview(null);
    };
  }, [preview]);

  const [, drop] = useDrop({
    accept: isInSection ? "section-component" : ["component", "section"],
    canDrop: (item: { id: string; index: number; isInSection?: boolean; parentId?: string; type: string }) => {
      // 자기 자신에게는 드롭 불가
      if (item.id === component.id) return false;

      // 섹션 내부에서는 같은 섹션의 컴포넌트만 드롭 가능
      if (isInSection) {
        return Boolean(item.isInSection && item.parentId === component.parentId);
      }

      // 섹션 외부에서는 섹션끼리만 드롭 가능
      return Boolean(!item.isInSection && item.type === "section" && component.type === "section");
    },
    hover(item: { id: string; index: number; isInSection?: boolean; parentId?: string; type: string }, monitor) {
      if (!ref.current || !item || item.id === component.id) {
        return;
      }

      // 드롭이 불가능한 경우 hover 처리하지 않음
      if (!monitor.canDrop()) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // 같은 위치면 무시
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      // 마우스 포인터의 Y 위치와 호버된 요소의 중간 지점 계산
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const mouseY = clientOffset.y - hoverBoundingRect.top;

      // 드래그 방향 결정
      const moveUpward = dragIndex > hoverIndex;
      const moveDownward = dragIndex < hoverIndex;

      // 위/아래 이동을 위한 민감도 영역 설정 (30%)
      const sensitivity = (hoverBoundingRect.bottom - hoverBoundingRect.top) * 0.3;

      // 위로 이동할 때
      if (moveUpward && mouseY > hoverMiddleY + sensitivity) {
        return;
      }

      // 아래로 이동할 때
      if (moveDownward && mouseY < hoverMiddleY - sensitivity) {
        return;
      }

      // 실제 위치 변경
      moveComponent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 다른 컨텍스트 메뉴가 열려있다면 닫기
    if (activeContextMenu && activeContextMenu !== component.id) {
      document.dispatchEvent(new CustomEvent("closeContextMenu"));
    }

    setContextMenu({ x: e.clientX, y: e.clientY });
    activeContextMenu = component.id;
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    activeContextMenu = null;
  };

  // 다른 컴포넌트의 컨텍스트 메뉴가 열릴 때 현재 메뉴 닫기
  useEffect(() => {
    const closeMenu = () => {
      if (contextMenu) {
        handleCloseContextMenu();
      }
    };

    document.addEventListener("closeContextMenu", closeMenu);
    return () => {
      document.removeEventListener("closeContextMenu", closeMenu);
    };
  }, [contextMenu]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (component.type === "section") {
      handleDeleteComponent(component.id);
    } else {
      onDelete();
    }
    handleCloseContextMenu();
  };

  const renderComponent = () => {
    switch (component.type) {
      case "text":
        return <TextComponent component={component} isSelected={isSelected} />;
      case "image":
        return <ImageComponent component={component} isSelected={isSelected} />;
      case "button":
        return <ButtonComponent component={component} isSelected={isSelected} />;
      case "margin":
        return <MarginComponent component={component} isSelected={isSelected} />;
      case "section":
        return (
          <SectionComponent
            component={component}
            isSelected={isSelected}
            selectedComponent={selectedComponent || null}
            setSelectedComponent={setSelectedComponent}
            onUpdate={onUpdate}
            moveComponent={moveComponent}
            handleDeleteComponent={handleDeleteComponent}
          />
        );
      case "divider":
        return <DividerComponent component={component} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div
        ref={ref}
        id={component.id}
        onClick={onClick}
        onContextMenu={handleContextMenu}
        className={`relative cursor-move
          ${isSelected ? "ring-2 ring-blue-500" : ""} 
          ${contextMenu ? "outline outline-1 outline-dashed outline-red-500" : ""}
        `}
        style={{
          position: "relative",
          zIndex: isDragging ? 40 : 1,
        }}
      >
        {renderComponent()}
      </div>
      {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={handleCloseContextMenu} onDelete={handleDelete} componentType={component.type} />}
    </>
  );
}
