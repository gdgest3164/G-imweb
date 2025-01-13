import { ReactNode, useEffect } from "react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

export function Modal({ isOpen, onClose, title, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-[90vw]",
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50" style={{ zIndex: 99998 }} onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 99999 }}>
        <div className={`relative bg-white dark:bg-gray-800 rounded-lg p-6 w-full ${sizeClasses[size]} mx-4`}>
          {title && <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">{title}</h2>}

          <div className="text-black dark:text-white">{children}</div>

          {footer ? (
            <div className="mt-6">{footer}</div>
          ) : (
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={onClose}>
                닫기
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
