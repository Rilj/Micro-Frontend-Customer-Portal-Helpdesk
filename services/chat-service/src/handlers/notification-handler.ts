import { Server, Socket } from "socket.io";
import { Notification } from "../types";

export class NotificationHandler {
  private notifications: Notification[] = [];

  constructor(private io: Server) {}

  handleConnection(socket: Socket, userId: string) {
    socket.on("notification:read", ({ id }: { id: string }) => {
      const notification = this.notifications.find((n) => n.id === id);
      if (notification) {
        notification.read = true;
      }
    });
  }

  sendNotification(recipientId: string, type: Notification["type"], title: string, message: string, roomId?: string, ticketId?: string) {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      roomId,
      ticketId,
      recipientId,
      read: false,
      createdAt: new Date()
    };

    this.notifications.push(notification);
    this.io.to(recipientId).emit("notification", notification);
  }

  getUnreadNotifications(userId: string): Notification[] {
    return this.notifications.filter((n) => n.recipientId === userId && !n.read);
  }
}
