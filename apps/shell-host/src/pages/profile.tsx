import React, { Suspense, lazy } from "react";
import { LoadingSpinner } from "../components/ui/loading-spinner";

const ProfileSettings = lazy(() => import("authApp/ProfileSettings"));

export const Profile: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <ProfileSettings />
      </Suspense>
    </div>
  );
};

export default Profile;
