import { ChatMessage } from "@mf-enterprise/event-bus";

export interface ChatRoom {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastMessage?: ChatMessage;
  unreadCount: number;
  participants: string[];
}

export interface ChatSession {
  roomId: string;
  userId: string;
  agentId?: string;
  status: "active" | "pending" | "closed";
  createdAt: string;
  updatedAt: string;
}
