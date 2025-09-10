import { HeaderNavigation } from "@/components/header-navigation";
import Footer from "@/components/footer";

export function LoadingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-visible bg-white dark:bg-black flex flex-col">
      <HeaderNavigation />
      <div className="flex-grow relative overflow-visible">
        {/* Floating glass elements - same as actual pages */}
        <div className="absolute top-20 right-20 w-40 h-60 bg-gradient-to-br from-gray-200/30 to-gray-300/20 dark:from-white/10 dark:to-white/5 rounded-3xl transform rotate-12 blur-sm"></div>
        <div className="absolute top-80 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 right-40 w-48 h-32 bg-gradient-to-br from-gray-200/25 to-gray-300/15 dark:from-white/8 dark:to-white/3 rounded-2xl transform -rotate-6 blur-sm"></div>
        
        <div className="relative z-10 overflow-visible">
          {/* Placeholder for hero section height */}
          <div className="pt-24 pb-16 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <div className="h-32 flex items-center justify-center">
                <div className="space-y-4">
                  <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}