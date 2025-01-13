"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Template } from "@/lib/types";
import { TemplateTable } from "@/app/components/dashboard/TemplateTable";
import { ConfirmModal } from "@/app/components/ui/ConfirmModal";
import { AlertModal } from "@/app/components/ui/AlertModal";
import { deleteTemplate } from "@/lib/api/templates";

export default function DashboardPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase.from("templates").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (data) setTemplates(data);
      } catch (error) {
        console.error("템플릿 로딩 실패:", error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchTemplates();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/templates/b146bcbf-5590-4e83-b685-1f284a979b28/edit`);
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteTemplate(deleteTarget);
      setTemplates((prev) => prev.filter((template) => template.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (error) {
      console.error("삭제 실패:", error instanceof Error ? error.message : "Unknown error");
      setError(error instanceof Error ? error.message : "삭제 실패: Unknown error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleView = (id: string) => {
    window.open(`/templates/${id}`, "_blank");
  };

  return (
    <>
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="템플릿 삭제"
        message="정말 이 템플릿을 삭제하시겠습니까?"
        type="danger"
        confirmText={isDeleting ? "삭제 중..." : "삭제"}
        disabled={isDeleting}
      />
      <AlertModal isOpen={error !== null} onClose={() => setError(null)} type="error" message={error || ""} />

      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="mb-8 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">랜딩페이지 관리</h1>
          <button onClick={() => router.push("/dashboard/templates/new/edit")} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            새 템플릿 만들기
          </button>
        </div>
        <TemplateTable templates={templates} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
      </div>
    </>
  );
}
