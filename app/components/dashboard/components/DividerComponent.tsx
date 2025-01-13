import { DividerComponent as DividerComponentType } from "@/lib/types/landing";

interface DividerComponentProps {
  component: DividerComponentType;
  isSelected?: boolean;
}

export function DividerComponent({ component }: DividerComponentProps) {
  const style = {
    display: "block",
    width: component.width + component.widthUnit,
    marginLeft: component.alignment === "right" ? "auto" : component.alignment === "center" ? "auto" : "0",
    marginRight: component.alignment === "center" ? "auto" : "0",
    padding: ".5rem 0",
    cursor: "pointer",
  };

  const lineStyle = {
    display: "block",
    width: "100%",
    height: "0px",
    border: "none",
    borderTop: `${component.thickness}px ${component.lineStyle} ${component.color || "#000000"}`,
    opacity: component.opacity ?? 100,
  };

  return (
    <div style={style}>
      <div style={lineStyle} />
    </div>
  );
}
