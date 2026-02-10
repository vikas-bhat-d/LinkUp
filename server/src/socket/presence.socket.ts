import { Server, Socket } from "socket.io";

const onlineUsers = new Map<string, Set<string>>();

export function registerPresence(io: Server, socket: Socket) {
  const userId = socket.data.userId as string;

  socket.join(`user:${userId}`); //FMI:used for notification purpose

  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }

  onlineUsers.get(userId)!.add(socket.id);

  io.emit("user:online", { userId });

  socket.on("disconnect", () => {
    const sockets = onlineUsers.get(userId);
    if (!sockets) return;

    sockets.delete(socket.id);

    if (sockets.size === 0) {
      onlineUsers.delete(userId);
      io.emit("user:offline", { userId });
    }
  });
}
