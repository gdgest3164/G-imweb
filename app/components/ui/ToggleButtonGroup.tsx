import React from "react";

interface Option<T extends string = string> {
  value: T;
  label: string;
}

interface ToggleButtonGroupProps<T extends string = string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

export function ToggleButtonGroup<T extends string = string>({ options, value, onChange, label }: ToggleButtonGroupProps<T>) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div className="flex items-center gap-2 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
              value === option.value ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
