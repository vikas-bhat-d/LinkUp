import { Server, Socket } from "socket.io";
import { createMessage } from "../messages/message.service";
import { prisma } from "../config/prisma";

export function registerMessageHandlers(io: Server, socket: Socket) {
  socket.on(
    "message:send",
    async (
      payload: {
        conversationId: string;
        content?: string;
        type: "TEXT" | "IMAGE" | "FILE";
      },
      callback
    ) => {
      try {
        const senderId = socket.data.userId as string;

        const message = await createMessage({
          conversationId: payload.conversationId,
          senderId,
          content: payload.content,
          type: payload.type,
        });

        io.to(`conversation:${payload.conversationId}`).emit(
          "message:receive",
          message
        );

        const participants = await prisma.conversationParticipant.findMany({
          where: {
            conversationId: payload.conversationId,
            NOT: { userId: senderId }
          },
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true }
            }
          }
        });

        for (const participant of participants) {
          io.to(`user:${participant.userId}`).emit("message:notify", {
            conversationId: payload.conversationId,
            from: {
              id: senderId
            },
            preview:
              payload.type === "TEXT"
                ? payload.content
                : payload.type === "IMAGE"
                ? "Photo"
                : "File",
            createdAt: message.createdAt
          });
        }

        callback?.({ success: true, message });
      } catch (err: any) {
        callback?.({
          success: false,
          error: err.message || "Message failed"
        });
      }
    }
  );
}
