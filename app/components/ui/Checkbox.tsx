interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Checkbox({ checked, onChange, label, description, size = "sm", disabled = false }: CheckboxProps) {
  return (
    <label className="flex items-start gap-2">
      <input disabled={disabled} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className={`checkbox checkbox-${size} mt-1`} />
      <div>
        <span className="text-sm">{label}</span>
        {description && <p className="text-xs opacity-70 mt-1">{description}</p>}
      </div>
    </label>
  );
}
