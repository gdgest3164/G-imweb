import { LandingComponent } from "../types/landing";

export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  content: LandingComponent;
}

export const sectionTemplates: SectionTemplate[] = [];
