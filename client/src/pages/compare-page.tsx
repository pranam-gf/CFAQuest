import { ModelComparison } from "@/components/model-comparison";
import { HeaderNavigation } from "@/components/header-navigation";
import Footer from "@/components/footer";
import { useState } from "react";

export default function ComparePage() {
  const [activeTab, setActiveTab] = useState("compare");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <HeaderNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="container mx-auto py-8 flex-grow">
        <ModelComparison />
      </div>
      <Footer />
    </div>
  );
}
