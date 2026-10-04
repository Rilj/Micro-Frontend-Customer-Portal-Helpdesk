import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mf-enterprise/ui-components";
import { AuthProvider } from "./auth-context";
import { Navbar } from "./components/layout/navbar";
import { LoadingSpinner } from "./components/ui/loading-spinner";

const Dashboard = lazy(() => import("./pages/dashboard"));
const Tickets = lazy(() => import("./pages/tickets"));
const KnowledgeBase = lazy(() => import("./pages/knowledge-base"));
const ChatWidget = lazy(() => import("./components/chat/chat-widget"));
const Profile = lazy(() => import("./pages/profile"));
const Settings = lazy(() => import("./pages/settings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1
    }
  }
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="container mx-auto px-4 py-6">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tickets/*" element={<Tickets />} />
                    <Route path="/knowledge" element={<KnowledgeBase />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
            <Suspense fallback={null}>
              <ChatWidget />
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
