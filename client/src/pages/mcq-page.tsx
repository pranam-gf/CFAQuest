import { McqLeaderboard } from "@/components/mcq-leaderboard";
import { HeaderNavigation } from "@/components/header-navigation";
import { HeroSection } from "@/components/hero-section";
import Footer from "@/components/footer";

export default function McqPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100/30 dark:from-black dark:via-gray-900 dark:to-gray-800 flex flex-col">
      <HeaderNavigation />
      <HeroSection />
      <div className="container mx-auto py-8 flex-grow">
        <McqLeaderboard />
      </div>
      <Footer />
    </div>
  );
}
