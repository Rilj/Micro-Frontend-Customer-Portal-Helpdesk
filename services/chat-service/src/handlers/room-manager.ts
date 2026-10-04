import { Socket } from "socket.io";
import { ChatMessage } from "../types";

export class RoomManager {
  private userRooms: Map<string, Set<string>> = new Map();

  handleConnection(socket: Socket, userId: string, _userRole: string) {
    socket.on("room:join", ({ roomId }: { roomId: string }) => {
      socket.join(roomId);
      if (!this.userRooms.has(userId)) {
        this.userRooms.set(userId, new Set());
      }
      this.userRooms.get(userId)?.add(roomId);
      console.log(`[room] User ${userId} joined room ${roomId}`);
    });

    socket.on("room:leave", ({ roomId }: { roomId: string }) => {
      socket.leave(roomId);
      this.userRooms.get(userId)?.delete(roomId);
      console.log(`[room] User ${userId} left room ${roomId}`);
    });
  }

  handleDisconnect(socket: Socket, userId: string) {
    const rooms = this.userRooms.get(userId);
    if (rooms) {
      rooms.clear();
      this.userRooms.delete(userId);
    }
  }

  getUserRooms(userId: string): Set<string> {
    return this.userRooms.get(userId) || new Set();
  }
}
