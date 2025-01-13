import { useState } from "react";
import { SectionTemplate, updateSectionTemplate } from "@/app/lib/api/section-templates";
import { Button } from "@/app/components/ui/Button";
import { toast } from "sonner";
import { Modal } from "@/app/components/ui/Modal";

interface EditSectionTemplateModalProps {
  template: SectionTemplate;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditSectionTemplateModal({ template, onClose, onSuccess }: EditSectionTemplateModalProps) {
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description || "");
  const [isPublic, setIsPublic] = useState(template.is_public);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateSectionTemplate(template.id, {
        name,
        description: description || null,
        is_public: isPublic,
        content: template.content,
      });
      toast.success("템플릿이 수정되었습니다.");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update template:", error);
      toast.error("템플릿 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="섹션 템플릿 수정"
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "저장 중..." : "저장"}
          </Button>
        </div>
      }
    >
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            이름
          </label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            rows={3}
          />
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="isPublic" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="mr-2" />
          <label htmlFor="isPublic" className="text-sm">
            공개
          </label>
        </div>
      </form>
    </Modal>
  );
}
