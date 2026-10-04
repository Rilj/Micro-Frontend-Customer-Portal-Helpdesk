import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const LoginPage = React.lazy(() => import("./pages/login"));
const RegisterPage = React.lazy(() => import("./pages/register"));
const ProfileSettings = React.lazy(() => import("./pages/profile-settings"));

export const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfileSettings />} />
      </Routes>
    </Suspense>
  );
};

export default App;
