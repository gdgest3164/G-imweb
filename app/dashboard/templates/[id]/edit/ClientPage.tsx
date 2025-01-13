"use client";

import { TemplateForm } from "@/app/components/dashboard/TemplateForm";
import { Template } from "@/lib/types";
import { useRouter } from "next/navigation";
import { updateTemplate } from "@/lib/api/templates";
import { useState } from "react";
import { AlertModal } from "@/app/components/ui/AlertModal";

interface ClientPageProps {
  template?: Template;
}

export function ClientPage({ template }: ClientPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <AlertModal isOpen={error !== null} onClose={() => setError(null)} type="error" message={error || ""} />
      <TemplateForm
        initialData={template}
        onSubmit={async (data) => {
          try {
            if (template) {
              await updateTemplate(template.id, data);
              router.refresh();
            } else {
              router.push(`/dashboard/templates/b146bcbf-5590-4e83-b685-1f284a979b28/edit`);
              router.refresh();
            }
          } catch (error) {
            console.error(template ? "템플릿 수정 실패:" : "템플릿 생성 실패:", error);
            setError(template ? "템플릿 수정에 실패했습니다." : "템플릿 생성에 실패했습니다.");
          }
        }}
        submitLabel={template ? "템플릿 수정" : "템플릿 생성"}
        loadingLabel={template ? "수정 중..." : "생성 중..."}
        showDeployButton={!!template}
      />
    </>
  );
}
