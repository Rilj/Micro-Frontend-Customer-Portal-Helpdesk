import mitt, { Emitter, Handler } from "mitt";

export type EventMap = {
  auth: { user: User | null };
  "theme:change": { mode: "light" | "dark" };
  "ticket:created": { ticket: Ticket };
  "ticket:updated": { ticket: Ticket };
  "chat:message": { message: ChatMessage };
  "notification:show": { title: string; message: string; type: "info" | "success" | "warning" | "error" };
  "kb:search": { query: string };
  "kb:article:rated": { articleId: string; rating: number };
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "agent" | "admin";
  avatar?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  assignedAgentId?: string;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt: string;
  updatedAt: string;
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

const emitter: Emitter<EventMap> = mitt<EventMap>();

type EventKey = keyof EventMap;

export const eventBus = {
  emit<K extends EventKey>(event: K, data: EventMap[K]): void {
    emitter.emit(event, data);
  },
  on<K extends EventKey>(event: K, handler: Handler<EventMap[K]>): () => void {
    emitter.on(event, handler);
    return () => emitter.off(event, handler);
  },
  off<K extends EventKey>(event: K, handler: Handler<EventMap[K]>): void {
    emitter.off(event, handler);
  }
};

export default eventBus;
