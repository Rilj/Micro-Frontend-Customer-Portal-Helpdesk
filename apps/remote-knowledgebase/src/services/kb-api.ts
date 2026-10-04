import api from "./api";
import { Article, ArticleCategory } from "../types";

export interface ArticleFilters {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const kbApi = {
  async getAllArticles(filters: ArticleFilters = {}): Promise<{ articles: Article[]; total: number }> {
    const response = await api.get<{ articles: Article[]; total: number }>("/articles", {
      params: filters
    });
    return response.data;
  },

  async getArticleBySlug(slug: string): Promise<Article> {
    const response = await api.get<Article>(`/articles/${slug}`);
    return response.data;
  },

  async getCategories(): Promise<ArticleCategory[]> {
    const response = await api.get<ArticleCategory[]>("/categories");
    return response.data;
  },

  async search(query: string): Promise<{ articles: Article[]; total: number }> {
    const response = await api.get<{ articles: Article[]; total: number }>("/search", {
      params: { q: query }
    });
    return response.data;
  },

  async rateArticle(articleId: string, helpful: boolean): Promise<void> {
    await api.post("/articles/rate", { articleId, rating: helpful });
  },

  async incrementView(articleId: string): Promise<void> {
    await api.post(`/articles/${articleId}/view`);
  }
};
