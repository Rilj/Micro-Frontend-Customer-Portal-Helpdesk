import { createServer } from "http";
import express, { Application } from "express";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { verify } from "jsonwebtoken";
import { ChatMessage, JwtPayload } from "./types";
import { RoomManager } from "./handlers/room-manager";
import { MessageHandler } from "./handlers/message-handler";
import { NotificationHandler } from "./handlers/notification-handler";

dotenv.config();

const PORT = parseInt(process.env.PORT || "8002", 10);
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "super-secret-access-key";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");

const app: Application = express();

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "chat-service" });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const roomManager = new RoomManager();
const messageHandler = new MessageHandler(io, roomManager);
const notificationHandler = new NotificationHandler(io);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: token required"));
  }

  try {
    const payload = verify(token, JWT_ACCESS_SECRET) as JwtPayload;
    (socket as any).userId = payload.sub;
    (socket as any).userEmail = payload.email;
    (socket as any).userRole = payload.role;
    next();
  } catch (error) {
    next(new Error("Authentication error: invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = (socket as any).userId;
  const userRole = (socket as any).userRole;
  const userEmail = (socket as any).userEmail;

  console.log(`[chat] User connected: ${userId} (${userEmail})`);

  roomManager.handleConnection(socket, userId, userRole);
  messageHandler.handleConnection(socket, userId);
  notificationHandler.handleConnection(socket, userId);

  socket.on("disconnect", (reason) => {
    console.log(`[chat] User disconnected: ${userId} (${reason})`);
    roomManager.handleDisconnect(socket, userId);
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`[ChatService] Server running on port ${PORT}`);
});

export { io, app };
