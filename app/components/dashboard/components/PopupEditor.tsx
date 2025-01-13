import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/app/components/Editor"), { ssr: false });

interface PopupEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function PopupEditor({ value, onChange, onClose, isOpen }: PopupEditorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed right-[300px] top-[50px] z-50 w-[500px] bg-white dark:bg-gray-800 shadow-2xl flex flex-col border dark:border-gray-700 overflow-auto max-h-[50vh]">
      <div className="p-3 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
        <h3 className="font-medium text-sm">텍스트 편집</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-3 flex-1 overflow-auto">
        <Editor value={value} onChange={onChange} placeholder="내용을 입력하세요" />
      </div>
    </div>
  );
}
