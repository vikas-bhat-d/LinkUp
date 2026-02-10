import { Socket } from "socket.io";

export function registerConversationHandlers(socket: Socket) {
  socket.on("conversation:join", (conversationId: string) => {
    if (!conversationId) return;

    socket.join(`conversation:${conversationId}`);
  });

  socket.on("conversation:leave", (conversationId: string) => {
    socket.leave(`conversation:${conversationId}`);
  });
}
