import React, { lazy, Suspense } from "react";

const ChatWindow = lazy(() => import("chatApp/ChatWindow"));

export const ChatWidget: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Suspense fallback={null}>
        <ChatWindow />
      </Suspense>
    </div>
  );
};

export default ChatWidget;
