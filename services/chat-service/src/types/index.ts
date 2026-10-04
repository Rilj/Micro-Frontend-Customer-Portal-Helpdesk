export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
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

export interface ChatRoom {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  agent?: {
    id: string;
    name: string;
    email: string;
  };
  status: "open" | "pending" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: "message" | "ticket_update" | "ticket_created";
  title: string;
  message: string;
  roomId?: string;
  ticketId?: string;
  recipientId: string;
  read: boolean;
  createdAt: Date;
}

export interface SocketEvents {
  "room:join": (data: { roomId: string }) => void;
  "room:leave": (data: { roomId: string }) => void;
  "message:send": (data: { message: string; roomId: string; attachments?: string[] }) => void;
  "typing:start": (data: { roomId: string }) => void;
  "typing:stop": (data: { roomId: string }) => void;
  "notification:read": (data: { id: string }) => void;
}

export interface ClientToServerEvents {
  "room:join": ({ roomId }: { roomId: string }) => void;
  "room:leave": ({ roomId }: { roomId: string }) => void;
  "message:send": ({
    message,
    roomId,
    attachments
  }: {
    message: string;
    roomId: string;
    attachments?: string[];
  }) => void;
  "typing:start": ({ roomId }: { roomId: string }) => void;
  "typing:stop": ({ roomId }: { roomId: string }) => void;
}

export interface ServerToClientEvents {
  "message:received": (message: ChatMessage) => void;
  "notification": (notification: Notification) => void;
  "typing": (data: { roomId: string; userId: string }) => void;
  "room:joined": (room: ChatRoom) => void;
}
