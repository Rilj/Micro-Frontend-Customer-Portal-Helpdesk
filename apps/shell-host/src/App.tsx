import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
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

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
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
      </AuthProvider>
    </ThemeProvider>
  );
}
