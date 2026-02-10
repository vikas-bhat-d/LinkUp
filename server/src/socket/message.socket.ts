import { Server, Socket } from "socket.io";
import { createMessage } from "../messages/message.service";

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

        callback?.({ success: true, message });
      } catch (err: any) {
        callback?.({
          success: false,
          error: err.message || "Message failed",
        });
      }
    }
  );
}
