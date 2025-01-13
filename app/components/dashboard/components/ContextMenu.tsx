import React from "react";
import { createPortal } from "react-dom";
import { LandingComponent } from "@/lib/types/landing";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
  componentType: LandingComponent["type"];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onDelete, componentType }) => {
  return createPortal(
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div
        className="fixed z-50 bg-white shadow-lg rounded-lg py-1 min-w-[120px]"
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        <button onClick={onDelete} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">
          {componentType === "section" ? "섹션 삭제" : "삭제"}
        </button>
      </div>
    </>,
    document.body
  );
};

export default ContextMenu;
