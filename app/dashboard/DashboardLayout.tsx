"use client";

import { ThemeToggle } from "../components/ui/ThemeToggle";
import { useAuth } from "../providers/AuthProvider";
import { supabase } from "@/lib/supabase";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    window.location.replace("/login");
    return null;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.replace("/login");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="mx-auto py-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button onClick={handleSignOut} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              로그아웃
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
