import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";
import { useEffect } from "react";

// 커스텀 익스텐션들의 타입 선언
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
    letterSpacing: {
      setLetterSpacing: (value: string) => ReturnType;
    };
    lineHeight: {
      setLineHeight: (value: string) => ReturnType;
    };
  }
}

// 글꼴 크기 조절을 위한 커스텀 익스텐션
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace("px", ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: size }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

// 자간 조절을 위한 커스텀 익스텐션
const LetterSpacing = Extension.create({
  name: "letterSpacing",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          letterSpacing: {
            default: null,
            parseHTML: (element) => element.style.letterSpacing,
            renderHTML: (attributes) => {
              if (!attributes.letterSpacing) return {};
              return { style: `letter-spacing: ${attributes.letterSpacing}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLetterSpacing:
        (letterSpacing: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { letterSpacing }).run();
        },
    };
  },
});

// 줄 높이 조절을 위한 커스텀 익스텐션
const LineHeight = Extension.create({
  name: "lineHeight",
  addOptions() {
    return {
      types: ["paragraph", "heading"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ chain }) => {
          return chain().setNode(this.options.types[0], { lineHeight }).run();
        },
    };
  },
});

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Editor({ value, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      Highlight.configure({ multicolor: true }),
      FontSize,
      LetterSpacing,
      LineHeight,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none min-h-[100px] p-3",
      },
    },
  });

  // value가 변경될 때 에디터 내용 업데이트
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="border rounded-md bg-white dark:bg-gray-600">
      <div className="border-b p-2 flex flex-wrap gap-2">
        {/* 글꼴 크기 */}
        <div className="flex gap-1 border-r pr-2">
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                editor?.chain().focus().unsetFontSize().run();
              } else {
                editor?.chain().focus().setFontSize(value).run();
              }
            }}
            className="p-1 rounded border dark:bg-gray-700 dark:border-gray-500"
            defaultValue=""
          >
            <option value="">글자 크기</option>
            <option value="12">12px</option>
            <option value="14">14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
            <option value="20">20px</option>
            <option value="24">24px</option>
            <option value="28">28px</option>
            <option value="32">32px</option>
            <option value="36">36px</option>
            <option value="48">48px</option>
            <option value="60">60px</option>
            <option value="72">72px</option>
            <option value="96">96px</option>
          </select>
        </div>

        {/* 기본 스타일 */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-500 ${editor?.isActive("bold") ? "bg-gray-200 dark:bg-gray-500" : ""}`}
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-500 ${editor?.isActive("italic") ? "bg-gray-200 dark:bg-gray-500" : ""}`}
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-500 ${editor?.isActive("strike") ? "bg-gray-200 dark:bg-gray-500" : ""}`}
          >
            <span className="line-through">S</span>
          </button>
          <button onClick={() => editor?.chain().focus().setHorizontalRule().run()} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-500">
            ―
          </button>
        </div>

        {/* 정렬 */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-500 ${editor?.isActive({ textAlign: "left" }) ? "bg-gray-200 dark:bg-gray-500" : ""}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h12" />
            </svg>
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-500 ${editor?.isActive({ textAlign: "center" }) ? "bg-gray-200 dark:bg-gray-500" : ""}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M6 18h12" />
            </svg>
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-500 ${editor?.isActive({ textAlign: "right" }) ? "bg-gray-200 dark:bg-gray-500" : ""}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M8 18h12" />
            </svg>
          </button>
        </div>

        {/* 자간 */}
        <div className="flex gap-1 border-r pr-2">
          <select onChange={(e) => editor?.chain().focus().setLetterSpacing(e.target.value).run()} className="p-1 rounded border dark:bg-gray-700 dark:border-gray-500">
            <option value="normal">자간</option>
            <option value="-1px">-1px</option>
            <option value="1px">1px</option>
            <option value="2px">2px</option>
            <option value="3px">3px</option>
            <option value="4px">4px</option>
            <option value="5px">5px</option>
          </select>
        </div>

        {/* 줄 높이 */}
        <div className="flex gap-1 border-r pr-2">
          <select onChange={(e) => editor?.chain().focus().setLineHeight(e.target.value).run()} className="p-1 rounded border dark:bg-gray-700 dark:border-gray-500">
            <option value="">줄 높이</option>
            <option value="1">기본</option>
            <option value="1.15">1.15배</option>
            <option value="1.5">1.5배</option>
            <option value="2">2배</option>
          </select>
        </div>

        {/* 글자색과 배경색 */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm">글자색</span>
            <input type="color" onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()} className="w-8 h-8 p-0 border rounded cursor-pointer" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm">배경색</span>
            <input type="color" onChange={(e) => editor?.chain().focus().setHighlight({ color: e.target.value }).run()} className="w-8 h-8 p-0 border rounded cursor-pointer" />
          </div>
        </div>
      </div>
      <EditorContent editor={editor} className="p-3" />
    </div>
  );
}
