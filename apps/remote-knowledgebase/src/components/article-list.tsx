import React, { useState, useEffect } from "react";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Badge } from "@mf-enterprise/ui-components";
import { Search } from "lucide-react";
import { useArticles, useCategories } from "../hooks/use-articles";
import { Article } from "../types";
import { eventBus } from "@mf-enterprise/event-bus";
import { formatDistanceToNow } from "date-fns";

export const ArticleList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: articlesData, isLoading: articlesLoading } = useArticles({
    category: selectedCategory || undefined,
    search: searchQuery
  });

  const { data: categories = [] } = useCategories();
  const articles = articlesData?.articles || [];
  const total = articlesData?.total || 0;

  useEffect(() => {
    if (searchQuery.length >= 2) {
      eventBus.emit("kb:search", { query: searchQuery });
    }
  }, [searchQuery]);

  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
  };

  const getArticleUrl = (article: Article) => {
    return `/articles/${article.slug}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <Button asChild>
          <a href="/knowledge">All Articles</a>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategorySelect(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategorySelect(category.slug)}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.articleCount}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {articlesLoading ? (
        <p>Loading articles...</p>
      ) : articles.length === 0 ? (
        <p className="text-muted-foreground">No articles found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article: Article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="outline">{article.categoryName}</Badge>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{article.helpfulCount}</span>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDistanceToNow(new Date(article.publishedAt || article.createdAt), { addSuffix: true })}</span>
                  <a
                    href={getArticleUrl(article)}
                    className="text-primary hover:underline"
                  >
                    Read more
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {total > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing {articles.length} of {total} articles
        </p>
      )}
    </div>
  );
};

export default ArticleList;
