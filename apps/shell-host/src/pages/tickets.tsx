import React, { Suspense, lazy } from "react";
import { LoadingSpinner } from "../components/ui/loading-spinner";

const TicketList = lazy(() => import("ticketingApp/TicketList"));
const TicketForm = lazy(() => import("ticketingApp/TicketForm"));

export const Tickets: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Support Tickets</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <TicketList />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <TicketForm />
      </Suspense>
    </div>
  );
};

export default Tickets;
