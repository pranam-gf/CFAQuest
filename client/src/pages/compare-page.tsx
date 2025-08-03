import { ModelComparison } from "@/components/model-comparison";
import { HeaderNavigation } from "@/components/header-navigation";
import Footer from "@/components/footer";

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100/30 dark:from-black dark:via-gray-900 dark:to-gray-800 flex flex-col">
      <HeaderNavigation />
      <div className="container mx-auto py-8 flex-grow">
        <ModelComparison />
      </div>
      <Footer />
    </div>
  );
}
