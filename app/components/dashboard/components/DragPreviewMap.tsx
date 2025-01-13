import { LandingComponent, ContainerComponent } from "@/lib/types/landing";
import { useDrop } from "react-dnd";
import { useRef, useEffect } from "react";

const SCROLL_SPEED = 15;
const SCROLL_THRESHOLD = 50;

interface DragPreviewMapProps {
  components: LandingComponent[];
  selectedComponent: string | null;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  onComponentClick: (id: string) => void;
  isDragging: boolean;
  draggedSectionId: string | null;
}

interface DragItem {
  id: string;
  index: number;
  type: string;
}

export function DragPreviewMap({ components, selectedComponent, moveComponent, onComponentClick, isDragging, draggedSectionId }: DragPreviewMapProps) {
  const scrollIntervalRef = useRef<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleScroll = (clientY: number) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const height = rect.height;

    if (relativeY < SCROLL_THRESHOLD) {
      // 위로 스크롤
      const speed = Math.max(1, (SCROLL_THRESHOLD - relativeY) / SCROLL_THRESHOLD) * SCROLL_SPEED;
      window.scrollBy(0, -speed);
    } else if (relativeY > height - SCROLL_THRESHOLD) {
      // 아래로 스크롤
      const speed = Math.max(1, (relativeY - (height - SCROLL_THRESHOLD)) / SCROLL_THRESHOLD) * SCROLL_SPEED;
      window.scrollBy(0, speed);
    }
  };

  const startScrollInterval = (clientY: number) => {
    if (scrollIntervalRef.current === null) {
      scrollIntervalRef.current = window.setInterval(() => {
        handleScroll(clientY);
      }, 16); // ~60fps
    }
  };

  const stopScrollInterval = () => {
    if (scrollIntervalRef.current !== null) {
      window.clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        if (mapRef.current) {
          const rect = mapRef.current.getBoundingClientRect();
          if (e.clientX >= rect.left && e.clientX <= rect.right) {
            startScrollInterval(e.clientY);
          } else {
            stopScrollInterval();
          }
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        stopScrollInterval();
      };
    } else {
      stopScrollInterval();
    }
  }, [isDragging]);

  useEffect(() => {
    return () => {
      stopScrollInterval();
    };
  }, []);

  if (!isDragging) return null;

  return (
    <div ref={mapRef} className="fixed right-[45%] top-[30%] w-[150px] bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-lg shadow-lg p-2 z-50">
      <div className="text-xs font-medium mb-2 text-gray-600 dark:text-gray-300">미니맵 (여기로 드래그)</div>
      <div className="space-y-1">
        {components.map(
          (component, index) =>
            component.type === "section" && (
              <PreviewSection
                key={component.id}
                component={component as ContainerComponent}
                index={index}
                isSelected={selectedComponent === component.id}
                moveComponent={moveComponent}
                onClick={() => onComponentClick(component.id)}
                isDragged={draggedSectionId === component.id}
              />
            )
        )}
      </div>
    </div>
  );
}

interface PreviewSectionProps {
  component: ContainerComponent;
  index: number;
  isSelected: boolean;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  onClick: () => void;
  isDragged: boolean;
}

function PreviewSection({ component, index, isSelected, moveComponent, onClick, isDragged }: PreviewSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "section",
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveComponent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drop(ref);

  const getBackgroundColor = () => {
    if (component.backgroundColor) {
      const opacity = component.backgroundOpacity ?? 0;
      const hex = component.backgroundColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return "transparent";
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`
        h-8 w-full rounded cursor-move border border-gray-200 dark:border-gray-600
        ${isDragged ? "opacity-50" : "opacity-100"}
        ${isSelected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-gray-400"}
      `}
      style={{
        backgroundColor: getBackgroundColor(),
        backgroundImage: component.backgroundImage ? `url(${component.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-[10px] text-gray-600 dark:text-gray-300 truncate px-1">{component.children.length}개의 컴포넌트</div>
      </div>
    </div>
  );
}
