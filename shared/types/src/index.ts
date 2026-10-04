export type UserRole = "customer" | "agent" | "admin";
export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Ticket {
  id: string;
  customerId: string;
  assignedAgentId?: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketThread {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: "CUSTOMER" | "AGENT" | "SYSTEM";
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderType: "customer" | "agent" | "system";
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  authorId?: string;
  status: "published" | "draft";
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
}

export interface NotificationData {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export const EVENT_TYPES = {
  AUTH_LOGIN: "auth:login",
  AUTH_LOGOUT: "auth:logout",
  AUTH_REGISTER: "auth:register",
  AUTH_UNAUTHORIZED: "auth:unauthorized",
  THEME_CHANGE: "theme:change",
  TICKET_CREATED: "ticket:created",
  TICKET_UPDATED: "ticket:updated",
  CHAT_MESSAGE: "chat:message",
  NOTIFICATION_SHOW: "notification:show",
  KB_SEARCH: "kb:search",
  KB_ARTICLE_RATED: "kb:article:rated"
} as const;

export type EventType = keyof typeof EVENT_TYPES;
