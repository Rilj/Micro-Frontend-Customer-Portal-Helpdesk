import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ChatMessage } from "@mf-enterprise/event-bus";

interface ChatRoom {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastMessage?: ChatMessage;
  unreadCount: number;
}

interface ChatState {
  rooms: ChatRoom[];
  currentRoomId: string | null;
  messages: Record<string, ChatMessage[]>;
  isConnected: boolean;
  isConnecting: boolean;

  setCurrentRoom: (roomId: string | null) => void;
  addMessage: (roomId: string, message: ChatMessage) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  setRooms: (rooms: ChatRoom[]) => void;
  incrementUnread: (roomId: string) => void;
  resetUnread: (roomId: string) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      rooms: [],
      currentRoomId: null,
      messages: {},
      isConnected: false,
      isConnecting: false,

      setCurrentRoom: (roomId: string | null) => set({ currentRoomId: roomId }),
      addMessage: (roomId: string, message: ChatMessage) =>
        set((state: ChatState) => ({
          messages: {
            ...state.messages,
            [roomId]: [...(state.messages[roomId] || []), message]
          }
        })),
      setMessages: (roomId: string, messages: ChatMessage[]) =>
        set((state: ChatState) => ({
          messages: { ...state.messages, [roomId]: messages }
        })),
      setRooms: (rooms: ChatRoom[]) => set({ rooms }),
      incrementUnread: (roomId: string) =>
        set((state: ChatState) => ({
          rooms: state.rooms.map((r: ChatRoom) =>
            r.id === roomId ? { ...r, unreadCount: r.unreadCount + 1 } : r
          )
        })),
      resetUnread: (roomId: string) =>
        set((state: ChatState) => ({
          rooms: state.rooms.map((r: ChatRoom) =>
            r.id === roomId ? { ...r, unreadCount: 0 } : r
          )
        })),
      setConnected: (connected: boolean) => set({ isConnected: connected }),
      setConnecting: (connecting: boolean) => set({ isConnecting: connecting })
    }),
    { name: "chat-store" }
  )
);
