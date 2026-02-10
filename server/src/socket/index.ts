import { Server } from "socket.io";
import { socketAuthMiddleware } from "./auth.socket";
import { registerPresence } from "./presence.socket";
import { registerConversationHandlers } from "./conversation.socket";
import { registerMessageHandlers } from "./message.socket";
import { registerReadHandlers } from "./read.socket";
import { registerTypingHandlers } from "./typing.socket";

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(socketAuthMiddleware);
  console.log("waiting to connect")

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    registerPresence(io, socket);
    registerConversationHandlers(socket);
    registerMessageHandlers(io, socket);
    registerReadHandlers(io,socket);
    registerTypingHandlers(io, socket); 
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}
