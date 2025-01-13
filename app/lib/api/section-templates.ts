import { LandingComponent } from "@/lib/types/landing";

export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  content: LandingComponent;
}

export const sectionTemplates: SectionTemplate[] = [];
