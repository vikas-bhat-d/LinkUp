import { Server, Socket } from "socket.io";

export function registerTypingHandlers(io: Server, socket: Socket) {
  const userId = socket.data.userId as string;

  socket.on(
    "typing:start",
    (payload: { conversationId: string }) => {
      if (!payload?.conversationId) return;

      socket.to(`conversation:${payload.conversationId}`).emit(
        "typing:started",
        {
          conversationId: payload.conversationId,
          userId
        }
      );
    }
  );

  socket.on(
    "typing:stop",
    (payload: { conversationId: string }) => {
      if (!payload?.conversationId) return;

      socket.to(`conversation:${payload.conversationId}`).emit(
        "typing:stopped",
        {
          conversationId: payload.conversationId,
          userId
        }
      );
    }
  );
  socket.on("disconnect", () => {
  });
}
