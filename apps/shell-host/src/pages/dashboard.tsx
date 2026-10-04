import React, { Suspense, lazy } from "react";
import { LoadingSpinner } from "../components/ui/loading-spinner";

const DashboardStats = lazy(() => import("ticketingApp/DashboardStats"));
const RecentTickets = lazy(() => import("ticketingApp/RecentTickets"));

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardStats />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <RecentTickets />
      </Suspense>
    </div>
  );
};

export default Dashboard;
