import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const ArticleList = React.lazy(() => import("./components/article-list"));
const ArticleDetail = React.lazy(() => import("./components/article-detail"));

export const App: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/articles" replace />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
      </Routes>
    </React.Suspense>
  );
};

export default App;
