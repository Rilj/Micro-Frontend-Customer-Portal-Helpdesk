export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  authorId: string;
  authorName: string;
  status: "published" | "draft";
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
}

export interface ArticleRating {
  articleId: string;
  rating: boolean;
}
