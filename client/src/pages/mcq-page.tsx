import { McqLeaderboard } from "@/components/mcq-leaderboard";
import { HeaderNavigation } from "@/components/header-navigation";
import Footer from "@/components/footer";
import { useState } from "react";

export default function McqPage() {
  const [activeTab, setActiveTab] = useState("mcq");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <HeaderNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="container mx-auto py-8 flex-grow">
        <McqLeaderboard />
      </div>
      <Footer />
    </div>
  );
}
