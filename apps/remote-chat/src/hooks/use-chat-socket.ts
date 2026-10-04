import { useEffect } from "react";
import chatService from "../services/chat-service";
import { useChatStore } from "../store/chat-store";
import { ChatMessage } from "@mf-enterprise/event-bus";
import { eventBus } from "@mf-enterprise/event-bus";

export const useChatSocket = (userId?: string, token?: string) => {
  const { setConnected, setConnecting, addMessage, incrementUnread } = useChatStore();

  useEffect(() => {
    if (!userId || !token) return;

    setConnecting(true);
    chatService.connect(userId, token);
    setConnected(true);
    setConnecting(false);

    const handleMessage = (message: ChatMessage) => {
      addMessage(message.roomId, message);
      incrementUnread(message.roomId);
      eventBus.emit("chat:message", { message });
    };

    const handleNotification = (notification: any) => {
      eventBus.emit("notification:show", {
        title: notification.title,
        message: notification.message,
        type: notification.type || "info"
      });
    };

    const unsubMessage = chatService.onMessage(handleMessage);
    const unsubNotification = chatService.onNotification(handleNotification);

    return () => {
      unsubMessage();
      unsubNotification();
      chatService.disconnect();
      setConnected(false);
    };
  }, [userId, token, setConnected, setConnecting, addMessage, incrementUnread]);

  const sendMessage = (message: string, roomId: string, attachments?: string[]) => {
    chatService.sendMessage(message, roomId, attachments);
  };

  const joinRoom = (roomId: string) => {
    chatService.joinRoom(roomId);
  };

  const leaveRoom = (roomId: string) => {
    chatService.leaveRoom(roomId);
  };

  return { sendMessage, joinRoom, leaveRoom };
};
