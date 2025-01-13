import { LandingComponent } from "./types/landing";

// 템플릿 데이터 타입 정의
export interface Template {
  id: string;
  title: string;
  description: string;
  content: LandingComponent[];
  created_at: string;
  updated_at: string;
}

// 템플릿 생성 요청 데이터 타입
export interface CreateTemplateRequest {
  title: string;
  description: string;
  content: JSON;
}
