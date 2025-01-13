import Image from "next/image";
import { LandingContent } from "@/lib/types/landing";

interface LandingSectionProps {
  content: LandingContent;
}

export function LandingSection({ content }: LandingSectionProps) {
  if (content.type === "image") {
    return (
      <div className="relative w-full h-64 md:h-96">
        <Image src={content.content} alt="Landing page image" fill className="object-cover" priority />
      </div>
    );
  }

  return (
    <div className="prose max-w-none" style={content.style}>
      {content.content}
    </div>
  );
}
