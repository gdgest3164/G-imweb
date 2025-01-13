interface RangeProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showValue?: boolean;
  valueFormat?: (value: number) => string;
}

export function Range({ value, onChange, min = 0, max = 100, step = 1, size = "sm", showValue = true, valueFormat = (v) => `${v}%` }: RangeProps) {
  return (
    <div className="flex items-center gap-4">
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className={`range range-primary range-${size} flex-1`} />
      {showValue && <span className="text-sm w-12 text-center">{valueFormat(value)}</span>}
    </div>
  );
}
