import { prisma } from "../config/prisma";

export async function getOrCreateDirectConversation(
  currentUserId: string,
  targetUserId: string
) {
  if (currentUserId === targetUserId) {
    throw { statusCode: 400, message: "Cannot chat with yourself" };
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      type: "DIRECT",
      participants: {
        every: {
          userId: { in: [currentUserId, targetUserId] }
        }
      }
    },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true }
          }
        }
      }
    }
  });

  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      type: "DIRECT",
      participants: {
        createMany: {
          data: [
            { userId: currentUserId },
            { userId: targetUserId }
          ]
        }
      }
    },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true }
          }
        }
      }
    }
  });
}


export async function listConversations(userId: string) {
  return prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId }
      }
    },
    orderBy: {
        lastMessageAt: "desc"  
    },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true }
          }
        }
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });
}


export async function listConversationsWithUnread(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { some: { userId } }
    },
    orderBy: { lastMessageAt: "desc" },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true }
          }
        }
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  const result = [];

  for (const convo of conversations) {
    const me = convo.participants.find(p => p.userId === userId);

    const unreadCount = await prisma.message.count({
      where: {
        conversationId: convo.id,
        ...(me?.lastReadAt && {
          createdAt: { gt: me.lastReadAt }
        })
      }
    });

    result.push({
      ...convo,
      unreadCount
    });
  }

  return result;
}
