interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function Checkbox({ id, checked, onChange, label, disabled = false }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} className="checkbox checkbox-sm" />
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
    </div>
  );
}
