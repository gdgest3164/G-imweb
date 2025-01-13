"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // 에러 로깅 서비스에 에러 전송
    console.error(error);
  }, [error]);

  return (
    <div className="text-center py-12">
      <h2 className="text-red-600 text-xl font-bold mb-4">오류가 발생했습니다</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" onClick={() => reset()}>
        다시 시도
      </button>
    </div>
  );
}
