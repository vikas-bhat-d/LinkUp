import { Server, Socket } from "socket.io";
import { prisma } from "../config/prisma";

export function registerReadHandlers(io: Server,socket: Socket) {
  socket.on(
    "message:read",
    async (payload: { conversationId: string; messageId: string }) => {
      const readerId = socket.data.userId as string;

      if (!payload?.conversationId || !payload?.messageId) return;

      await prisma.conversationParticipant.update({
        where: {
          conversationId_userId: {
            conversationId: payload.conversationId,
            userId:readerId
          }
        },
        data: {
          lastReadMessageId: payload.messageId,
          lastReadAt: new Date()
        }
      });

        const message = await prisma.message.findUnique({
                where: { id: payload.messageId },
                select: { senderId: true },
            });

            if (!message) return;

            io.to(`user:${message.senderId}`).emit("message:seen", {
                conversationId: payload.conversationId,
                messageId: payload.messageId,
                userId: readerId,
        });
    }
  );
}
