import { getTemplate } from "@/lib/api/templates";
import { ClientPage } from "./ClientPage";

export default async function EditTemplatePage() {
  try {
    const template = await getTemplate("b146bcbf-5590-4e83-b685-1f284a979b28");
    return <ClientPage template={template} />;
  } catch (error) {
    console.error("템플릿 로드 실패:", error);
    return <ClientPage />;
  }
}
