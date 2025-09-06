import { HeaderNavigation } from "@/components/header-navigation";
import Footer from "@/components/footer";

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100/30 dark:from-black dark:via-gray-900 dark:to-gray-800 flex flex-col">
      <HeaderNavigation />
      <main className="flex-grow p-4 pt-24 relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-5 dark:opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-[#464348]/10 dark:via-blue-500/10 dark:to-[#464348]/20"></div>
        <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}