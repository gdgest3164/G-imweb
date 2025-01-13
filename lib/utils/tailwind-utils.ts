export function getSizeClass(classes?: string) {
  return classes?.split(" ").find((c) => c.startsWith("w-")) || "";
}

export function getFontSizeClass(classes?: string) {
  return classes?.split(" ").find((c) => c.startsWith("text-") && !/(left|center|right)/.test(c)) || "text-base";
}

export function getAlignClass(classes?: string) {
  return classes?.split(" ").find((c) => /(text-left|text-center|text-right)/.test(c)) || "text-left";
}

export function updateClass(classes: string | undefined, newClass: string, prefix: string): string {
  const existingClasses = classes?.split(" ") || [];
  const filteredClasses = existingClasses.filter((c) => !c.startsWith(prefix));
  return [...filteredClasses, newClass].filter(Boolean).join(" ");
}

export function updateSizeClass(classes: string | undefined, newClass: string) {
  return updateClass(classes, newClass, "w-");
}

export function updateFontSizeClass(classes: string | undefined, newClass: string) {
  const existingClasses = classes?.split(" ") || [];
  const filteredClasses = existingClasses.filter((c) => !(c.startsWith("text-") && !/(left|center|right)/.test(c)));
  return [...filteredClasses, newClass].filter(Boolean).join(" ");
}

export function updateAlignClass(classes: string | undefined, newClass: string) {
  const existingClasses = classes?.split(" ") || [];
  const filteredClasses = existingClasses.filter((c) => !/(text-left|text-center|text-right)/.test(c));
  return [...filteredClasses, newClass].filter(Boolean).join(" ");
}
