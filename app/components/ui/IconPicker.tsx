import React from "react";
import { createPortal } from "react-dom";
import { Modal } from "./Modal";
import { AlertCircle, ArrowRight, Check, ChevronDown, Github, Heart, Home, Image, Link, Mail, Settings, Star, User } from "lucide-react";

const ICONS = {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  Github,
  Heart,
  Home,
  Image,
  Link,
  Mail,
  Settings,
  Star,
  User,
} as const;

export type IconName = keyof typeof ICONS;

interface IconPickerProps {
  value?: IconName;
  onChange: (icon: IconName | undefined) => void;
  size?: number;
  className?: string;
}

export function IconPicker({ value, onChange, size = 16, className = "" }: IconPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredIcons = React.useMemo(() => {
    if (!searchTerm) return Object.entries(ICONS);
    const term = searchTerm.toLowerCase();
    return Object.entries(ICONS).filter(([name]) => name.toLowerCase().includes(term));
  }, [searchTerm]);

  const selectedIcon = value ? ICONS[value] : undefined;

  return (
    <>
      <div className="flex gap-2">
        <button className={`btn btn-outline w-1/2 ${className}`} onClick={() => setIsOpen(true)}>
          {selectedIcon ? (
            <div className="flex items-center gap-2">
              {React.createElement(selectedIcon, { size })}
              <span>{value}</span>
            </div>
          ) : (
            "아이콘 선택"
          )}
        </button>
        {value && (
          <button className="btn btn-outline" onClick={() => onChange(undefined)}>
            제거
          </button>
        )}
      </div>

      {createPortal(
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="아이콘 선택">
          <div className="space-y-4">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b hidden">
              <input type="text" placeholder="아이콘 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input input-bordered w-full" />
            </div>
            <div className="grid grid-cols-6 gap-2 p-4 max-h-[60vh] overflow-y-auto">
              {filteredIcons.map(([name, Icon]) => (
                <button
                  key={name}
                  className="btn btn-outline aspect-square flex flex-col items-center justify-center gap-1 p-2 text-xs"
                  onClick={() => {
                    onChange(name as IconName);
                    setIsOpen(false);
                  }}
                >
                  <Icon size={24} />
                </button>
              ))}
            </div>
          </div>
        </Modal>,
        document.body
      )}
    </>
  );
}
