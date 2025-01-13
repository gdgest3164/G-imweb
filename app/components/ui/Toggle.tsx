interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
  size?: "sm" | "md" | "lg";
}

export function Toggle({ checked, onChange, leftLabel, rightLabel, size = "sm" }: ToggleProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {leftLabel && <span className="text-sm">{leftLabel}</span>}
      <input type="checkbox" className={`toggle toggle-${size}`} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {rightLabel && <span className="text-sm">{rightLabel}</span>}
    </div>
  );
}
