import React, { Suspense, lazy } from "react";
import { LoadingSpinner } from "../components/ui/loading-spinner";

const ArticleList = lazy(() => import("kbApp/ArticleList"));

export const KnowledgeBase: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Knowledge Base</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <ArticleList />
      </Suspense>
    </div>
  );
};

export default KnowledgeBase;
