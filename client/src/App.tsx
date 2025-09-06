import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { LoadingPage } from "@/components/loading-page";

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
      <ThemeProvider defaultTheme="light" storageKey="cfa-arena-theme">
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={<LoadingPage />}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
