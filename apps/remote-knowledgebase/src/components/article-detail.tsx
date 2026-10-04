import React, { useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@mf-enterprise/ui-components";
import { ThumbsUp, ThumbsDown, Share2, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useArticle } from "../hooks/use-articles";
import { kbApi } from "../services/kb-api";
import { eventBus } from "@mf-enterprise/event-bus";
import { format } from "date-fns";

export const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: article, isLoading } = useArticle(id || "");

  useEffect(() => {
    if (article) {
      kbApi.incrementView(article.id);
      eventBus.emit("kb:article:rated", { articleId: article.id, rating: 0 });
    }
  }, [article]);

  const handleRating = (helpful: boolean) => {
    if (article) {
      kbApi.rateArticle(article.id, helpful);
      eventBus.emit("kb:article:rated", {
        articleId: article.id,
        rating: helpful ? 1 : 0
      });
    }
  };

  if (isLoading || !article) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <p>Loading article...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <article className="prose dark:prose-invert max-w-none">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">{article.categoryName}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Views: {article.viewCount}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="hover:text-primary"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <CardTitle className="text-3xl">{article.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>By {article.authorName}</span>
              <span>•</span>
              <span>{format(new Date(article.publishedAt || article.createdAt), "MMM d, yyyy")}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="article-content mb-8"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Was this article helpful?</span>
                <Button variant="outline" size="sm" onClick={() => handleRating(true)}>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Yes ({article.helpfulCount})
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRating(false)}>
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  No ({article.notHelpfulCount})
                </Button>
              </div>

              <div className="flex flex-wrap gap-1">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
};

export default ArticleDetail;
