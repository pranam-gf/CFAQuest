import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const Dashboard = lazy(() => import("@/pages/dashboard"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Overall = lazy(() => import("@/pages/overall"));
const McqPage = lazy(() => import("@/pages/mcq-page"));
const EssayPage = lazy(() => import("@/pages/essay-page"));
const ComparePage = lazy(() => import("@/pages/compare-page"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Overall} />
      <Route path="/overall" component={Overall} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/mcq" component={McqPage} />
      <Route path="/essay" component={EssayPage} />
      <Route path="/compare" component={ComparePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Suspense fallback={<div>Loading...</div>}>
          <Router />
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
