import { prisma } from "../config/prisma";

export async function createMessage(params: {
  conversationId: string;
  senderId: string;
  content?: string;
  type: "TEXT" | "IMAGE" | "FILE";
}) {
  const { conversationId, senderId, content, type } = params;

  if (!conversationId || !senderId) {
    throw new Error("Invalid message payload");
  }

  if (type === "TEXT" && !content) {
    throw new Error("Text message cannot be empty");
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
      type,
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: message.createdAt },
  });

  return message;
}


export async function getMessages(params: {
  conversationId: string;
  limit?: number;
  cursor?: string;
}) {
  const { conversationId, limit = 20, cursor } = params;

  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: limit,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1
    })
  });
}
