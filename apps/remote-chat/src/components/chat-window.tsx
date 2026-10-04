import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Avatar, AvatarFallback, Badge } from "@mf-enterprise/ui-components";
import { Send, Minimize2 } from "lucide-react";
import { useChatStore } from "../store/chat-store";
import { useChatSocket } from "../hooks/use-chat-socket";
import { format } from "date-fns";

export const ChatWindow: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem("user_id") || "user-001";
  const token = localStorage.getItem("access_token") || "";

  const { currentRoomId, rooms, messages, isConnected } = useChatStore();
  const { sendMessage: sendMsg, joinRoom } = useChatSocket(userId, token);

  const currentMessages = currentRoomId ? messages[currentRoomId] || [] : [];

  useEffect(() => {
    if (currentRoomId) {
      joinRoom(currentRoomId);
    }
  }, [currentRoomId, joinRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSend = () => {
    if (!message.trim() || !currentRoomId) return;
    sendMsg(message.trim(), currentRoomId);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const handleRoomSelect = (roomId: string) => {
    joinRoom(roomId);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4v-9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 h-[500px] w-80 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Chat</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {!isConnected && (
          <div className="p-4 bg-muted/50 text-center text-sm text-muted-foreground">
            Connecting to server...
          </div>
        )}

        <div className="h-2 border-t" />

        <div className="grid grid-cols-12 h-[300px]">
          <div className="col-span-4 border-r p-2 overflow-y-auto">
            <p className="text-xs font-medium text-muted-foreground mb-2">Conversations</p>
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomSelect(room.id)}
                className={`cursor-pointer p-2 rounded-md mb-1 ${
                  currentRoomId === room.id ? "bg-accent" : "hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {room.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium truncate">{room.name}</p>
                    {room.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate">
                        {room.lastMessage.message}
                      </p>
                    )}
                  </div>
                  {room.unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                      {room.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-8 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {currentMessages.length > 0 ? (
                currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-3 ${
                      msg.senderId === userId ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block rounded-lg px-3 py-2 text-sm ${
                        msg.senderId === userId
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {msg.message}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(msg.createdAt), "HH:mm")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No messages yet. Start the conversation!
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;
