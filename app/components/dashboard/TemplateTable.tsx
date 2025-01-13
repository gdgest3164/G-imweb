import { Template } from "@/lib/types";
import { Button } from "../ui/Button";

type TemplateTableProps = {
  templates: Template[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
};

export function TemplateTable({ templates, onEdit, onDelete }: TemplateTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">제목</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">설명</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">생성일</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">작업</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
          {templates.map((template) => (
            <tr key={template.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{template.title}</td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{template.description}</td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(template.created_at).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-right text-sm">
                <div className="flex justify-end gap-2">
                  <Button variant="primary" size="sm" onClick={() => window.open(`/templates/${template.id}`, "_blank", "noopener,noreferrer")}>
                    보기
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onEdit(template.id)}>
                    수정
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(template.id)}>
                    삭제
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
