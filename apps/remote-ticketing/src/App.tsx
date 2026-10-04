import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const TicketList = React.lazy(() => import("./components/ticket-list"));
const TicketDetail = React.lazy(() => import("./components/ticket-detail"));

export const App: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/tickets" replace />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
      </Routes>
    </React.Suspense>
  );
};

export default App;
