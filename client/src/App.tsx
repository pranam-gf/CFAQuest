import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import Overall from "@/pages/overall";
import McqPage from "@/pages/mcq-page";
import EssayPage from "@/pages/essay-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Overall} />
      <Route path="/overall" component={Overall} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/mcq" component={McqPage} />
      <Route path="/essay" component={EssayPage} />
      <Route path="/compare" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
