import { Socket } from "socket.io";
import { prisma } from "../config/prisma";

export function registerReadHandlers(socket: Socket) {
  socket.on(
    "message:read",
    async (payload: { conversationId: string; messageId: string }) => {
      const userId = socket.data.userId as string;

      if (!payload?.conversationId || !payload?.messageId) return;

      await prisma.conversationParticipant.update({
        where: {
          conversationId_userId: {
            conversationId: payload.conversationId,
            userId
          }
        },
        data: {
          lastReadMessageId: payload.messageId,
          lastReadAt: new Date()
        }
      });
    }
  );
}
