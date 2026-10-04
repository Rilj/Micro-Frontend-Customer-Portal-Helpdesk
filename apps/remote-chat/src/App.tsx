import React from "react";
import { Routes, Route } from "react-router-dom";

const ChatWindow = React.lazy(() => import("./components/chat-window"));
const NotificationBell = React.lazy(() => import("./components/notification-bell"));

export const App: React.FC = () => {
  return (
    <React.Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<NotificationBell />} />
        <Route path="/chat" element={<ChatWindow />} />
      </Routes>
    </React.Suspense>
  );
};

export default App;
