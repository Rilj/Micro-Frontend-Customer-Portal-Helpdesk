import { io, Socket } from "socket.io-client";
import { ChatMessage } from "@mf-enterprise/event-bus";

let socket: Socket | null = null;

export interface ChatConnection {
  connect: (userId: string, token: string) => void;
  disconnect: () => void;
  sendMessage: (message: string, roomId: string, attachments?: string[]) => void;
  onMessage: (callback: (message: ChatMessage) => void) => () => void;
  onNotification: (callback: (notification: any) => void) => () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  isConnected: () => boolean;
}

export const chatService: ChatConnection = {
  connect(userId: string, token: string) {
    if (socket) return;

    const serverUrl = import.meta.env.VITE_CHAT_SOCKET_URL || "http://localhost:8002";
    socket = io(serverUrl, {
      auth: { token, userId },
      transports: ["websocket"],
      autoConnect: false
    });

    socket.connect();

    socket.on("connect", () => {
      console.log("[chat] Connected to chat server");
    });

    socket.on("disconnect", (reason) => {
      console.log("[chat] Disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("[chat] Connection error:", error);
    });
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  sendMessage(message: string, roomId: string, attachments?: string[]) {
    if (socket) {
      socket.emit("message:send", { message, roomId, attachments });
    }
  },

  joinRoom(roomId: string) {
    if (socket) {
      socket.emit("room:join", { roomId });
    }
  },

  leaveRoom(roomId: string) {
    if (socket) {
      socket.emit("room:leave", { roomId });
    }
  },

  onMessage(callback: (message: ChatMessage) => void) {
    if (!socket) return () => {};
    socket.on("message:received", callback as any);
    return () => {
      socket?.off("message:received", callback as any);
    };
  },

  onNotification(callback: (notification: any) => void) {
    if (!socket) return () => {};
    socket.on("notification", callback as any);
    return () => {
      socket?.off("notification", callback as any);
    };
  },

  isConnected() {
    return socket?.connected ?? false;
  }
};

export default chatService;
