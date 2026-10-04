import { useQuery } from "@tanstack/react-query";
import { kbApi, ArticleFilters } from "../services/kb-api";

export const useArticles = (filters: ArticleFilters = {}) => {
  return useQuery({
    queryKey: ["articles", filters],
    queryFn: () => kbApi.getAllArticles(filters),
    staleTime: 60000
  });
};

export const useArticle = (slug: string) => {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => kbApi.getArticleBySlug(slug),
    enabled: !!slug,
    staleTime: 30000
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => kbApi.getCategories(),
    staleTime: 60000
  });
};

export const useArticleSearch = (query: string) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => kbApi.search(query),
    enabled: query.length >= 2,
    staleTime: 30000
  });
};