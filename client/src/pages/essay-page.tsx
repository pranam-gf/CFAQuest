import { EssayLeaderboard } from "@/components/essay-leaderboard";
import { HeaderNavigation } from "@/components/header-navigation";
import Footer from "@/components/footer";
import { useState } from "react";

export default function EssayPage() {
  const [activeTab, setActiveTab] = useState("essay");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <HeaderNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="container mx-auto py-8 flex-grow">
        <EssayLeaderboard />
      </div>
      <Footer />
    </div>
  );
}
