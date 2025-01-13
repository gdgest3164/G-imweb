"use client";

export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm">{children}</div>;
}
