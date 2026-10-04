import { Server, Socket } from "socket.io";
import { RoomManager } from "./room-manager";
import { ChatMessage } from "../types";

export class MessageHandler {
  constructor(
    private io: Server,
    private roomManager: RoomManager
  ) {}

  handleConnection(socket: Socket, userId: string) {
    socket.on("message:send", (data: { message: string; roomId: string; attachments?: string[] }) => {
      const chatMessage: ChatMessage = {
        id: crypto.randomUUID(),
        roomId: data.roomId,
        senderId: userId,
        senderType: "customer",
        message: data.message,
        attachments: data.attachments,
        createdAt: new Date().toISOString()
      };

      this.io.to(data.roomId).emit("message:received", chatMessage);
      console.log(`[message] Message sent to room ${data.roomId} by ${userId}`);
    });

    socket.on("typing:start", ({ roomId }: { roomId: string }) => {
      socket.to(roomId).emit("typing", { roomId, userId });
    });

    socket.on("typing:stop", ({ roomId }: { roomId: string }) => {
      socket.to(roomId).emit("typing", { roomId, userId, stopped: true });
    });
  }
}
