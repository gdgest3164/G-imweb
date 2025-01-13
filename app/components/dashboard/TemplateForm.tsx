"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Template } from "@/lib/types";
import { LandingComponent } from "@/lib/types/landing";
import { DesignEditor } from "./DesignEditor";
import { AlertModal } from "../ui/AlertModal";
import { Modal } from "../ui/Modal";
import { createClient } from "@/app/lib/supabase/client";
import { Input } from "../ui/Input";

interface TemplateFormProps {
  initialData?: Omit<Template, "content"> & {
    content: LandingComponent[];
    vercel_id?: string;
    pj_name?: string;
    temp_domain?: string;
  };
  onSubmit: (data: { title: string; description: string; content: LandingComponent[] }) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
  loadingLabel: string;
  showDeployButton?: boolean;
}

export function TemplateForm({ initialData, onSubmit, submitLabel, loadingLabel, showDeployButton = false }: TemplateFormProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [showMetaButton, setShowMetaButton] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowMetaButton(scrollPosition < 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [content, setContent] = useState<LandingComponent[]>(
    initialData?.content ?? [
      {
        id: "welcome-text",
        type: "text",
        style: { fontSize: "2em" },
        content: "환영합니다",
        textAlign: "center",
        fontSize: "12px",
        letterSpacing: "0",
      },
    ]
  );

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("페이지명을 입력해주세요.");
      setIsMetaOpen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 이미지 삭제가 필요한 컴포넌트들 처리
      const processSection = async (section: LandingComponent): Promise<LandingComponent> => {
        // 삭제할 이미지 URL 가져오기
        const getImageToDelete = (component: LandingComponent) => {
          if (component._imageMeta?.deleteState === "pending") {
            return component._imageMeta.originalUrl;
          }
          return null;
        };

        // 이미지 초기화
        const resetImage = (component: LandingComponent): LandingComponent => {
          const newMeta = {
            deleteState: "deleted" as const,
            originalUrl: "",
          };

          if (component.type === "section" || component.type === "text") {
            return {
              ...component,
              backgroundImage: "",
              backgroundRepeat: "no-repeat" as const,
              _imageMeta: newMeta,
            };
          } else if (component.type === "image") {
            return {
              ...component,
              src: "",
              _imageMeta: newMeta,
            };
          }
          return component;
        };

        let updatedSection = { ...section };

        // 이미지 삭제 처리
        const imageUrl = getImageToDelete(section);
        if (imageUrl) {
          const filePathMatch = imageUrl.match(/storage\/v1\/object\/public\/(.+)/);
          if (filePathMatch) {
            const filePath = filePathMatch[1];
            const bucketPath = filePath.split("/")[0];
            const storagePath = filePath.split("/").slice(1).join("/");

            const supabase = createClient();
            await supabase.storage.from(bucketPath).remove([storagePath]);
          }
          // Storage 이미지가 아니더라도 이미지는 초기화
          updatedSection = resetImage(section);
        }

        // 자식 컴포넌트들도 처리
        if ("children" in updatedSection && Array.isArray(updatedSection.children)) {
          const updatedChildren = await Promise.all(updatedSection.children.map((child) => processSection(child)));
          updatedSection = {
            ...updatedSection,
            children: updatedChildren,
          };
        }

        return updatedSection;
      };

      // 모든 컴포넌트 처리
      const updatedContent = await Promise.all(content.map((component) => processSection(component)));
      setContent(updatedContent);

      await onSubmit({
        title: title.trim(),
        description,
        content: updatedContent,
      });
    } catch (error) {
      console.error("폼 제출 오류:", error instanceof Error ? error.message : "Unknown error");
      setError("작업에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTemplate = async () => {
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "템플릿 생성에 실패했습니다.");
      }

      setContent(data);
    } catch (error) {
      console.error("Error generating template:", error);
      setError(error instanceof Error ? error.message : "템플릿 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative">
      <AlertModal
        isOpen={error !== null && error === "페이지명을 입력해주세요."}
        onClose={() => {
          setError(null);
          if (error === "페이지명을 입력해주세요.") {
            setIsMetaOpen(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        type="error"
        message={error || ""}
      />
      <div className="sticky top-0 h-[50px] bg-gray-100/30 dark:bg-gray-500/80 backdrop-blur-sm z-30 flex items-center justify-end px-4">
        <div className="flex items-center gap-3">
          <Button
            disabled={!initialData}
            onClick={() => {
              if (initialData) {
                window.open(`/templates/${initialData.id}`, "_blank");
              }
            }}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            미리보기
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={loading} variant="secondary" className="flex items-center gap-2 px-6">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {loadingLabel}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {submitLabel}
              </>
            )}
          </Button>
        </div>
      </div>

      <div
        className={`fixed top-[10px] left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          showMetaButton ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
        }`}
      >
        <button onClick={() => setIsMetaOpen(!isMetaOpen)} className="hidden px-4 py-2 bg-white dark:bg-gray-600 dark:text-white rounded-full shadow-md hover:bg-gray-50 flex items-center gap-2">
          페이지명/설명
          <svg className={`w-4 h-4 transition-transform ${isMetaOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[500px] transition-all duration-300 ${
            isMetaOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-4 bg-white dark:bg-gray-600 dark:text-white p-6 rounded-lg shadow-lg">
            <div className="w-full">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                페이지 명
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={title}
                onChange={(e) => {
                  let value = e.target.value;
                  // 숫자로 시작하면 'p-'를 앞에 추가
                  if (/^[0-9]/.test(value)) {
                    value = "p-" + value;
                  }
                  // 영문, 숫자, 하이픈, 점만 허용
                  value = value.replace(/[^a-zA-Z0-9.-]/g, "-");
                  setTitle(value);
                }}
                pattern="[a-zA-Z][a-zA-Z0-9.-]*"
                title="영문, 숫자, 하이픈(-)만 입력 가능합니다"
                placeholder="영문, 숫자, 하이픈(-)만 입력 가능"
                className="border mt-1 block w-full rounded-md border-gray-300 p-2 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-400"
              />
            </div>

            <div className="w-full">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                설명
              </label>
              <input
                name="description"
                id="description"
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border mt-1 block w-full rounded-md border-gray-300 p-2 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto my-1 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            GPT
            <Input
              placeholder="부동산 랜딩페이지 만들어줘 (미완성)"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isGenerating && prompt) {
                  e.preventDefault();
                  handleGenerateTemplate();
                }
              }}
              className="flex-1 text-base py-2.5 dark:bg-gray-700 dark:text-gray-100"
            />
            <Button
              onClick={handleGenerateTemplate}
              disabled={isGenerating || !prompt}
              variant="secondary"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-black dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>생성 중...</span>
                </div>
              ) : (
                <span>생성하기</span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <DesignEditor components={content} onChange={(newContent) => setContent(newContent)} />
    </div>
  );
}
