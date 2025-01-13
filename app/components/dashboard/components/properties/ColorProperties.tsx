interface ColorPropertiesProps {
  label: string;
  color?: string;
  opacity?: number;
  componentId: string;
  onChange: (color: string, opacity: number) => void;
}

export function ColorProperties({ label, color = "#ffffff", opacity = 1, componentId, onChange }: ColorPropertiesProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <div
            className="w-10 h-10 border rounded overflow-hidden cursor-pointer"
            onClick={() => {
              const colorInput = document.getElementById(`color-${componentId}`) as HTMLInputElement;
              if (colorInput) colorInput.click();
            }}
          >
            <div
              className="w-full h-full rounded overflow-hidden"
              style={{
                backgroundColor: color,
                opacity: opacity,
              }}
            />
          </div>
          <input
            id={`color-${componentId}`}
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value, opacity)}
            className="absolute top-full left-0 mt-1 w-8 h-8 p-0 border rounded cursor-pointer opacity-0"
          />
        </div>
        <input type="text" value={color} onChange={(e) => onChange(e.target.value, opacity)} className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="#ffffff" />
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium mb-1">투명도</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round((opacity ?? 1) * 100)}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              onChange(color, value / 100);
            }}
            className="range range-xs flex-1"
          />
          <span className="text-sm w-12 text-center">{Math.round((opacity ?? 1) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
