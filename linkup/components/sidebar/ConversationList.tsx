"use client";

import { useConversationStore } from "@/store/conversation.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ConversationList() {
  const router = useRouter();

  const { user } = useAuthStore();

  const {
    conversations,
    activeConversationId,
    isLoading,
    setActiveConversation,
  } = useConversationStore();

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading conversations...
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No conversations yet
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="space-y-1 p-2">
        {conversations.map((convo) => {
          const isActive = convo.id === activeConversationId;

          const otherParticipant = convo.participants.find(
            (p) => p.userId !== user?.id
          );

          const lastMessage = convo.messages?.[0];

          return (
            <div
              key={convo.id}
              onClick={() => {
                setActiveConversation(convo.id);
                router.push(`/chat/${convo.id}`);
              }}
              className={`
                flex items-center gap-3 rounded-lg p-3 text-sm
                cursor-pointer transition-colors
                ${isActive ? "bg-secondary" : "hover:bg-muted"}
              `}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={otherParticipant?.user.avatarUrl || undefined}
                />
                <AvatarFallback>
                  {otherParticipant?.user.name?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">
                    {otherParticipant?.user.name}
                  </span>

                  {convo.unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {convo.unreadCount}
                    </Badge>
                  )}
                </div>

                {lastMessage && (
                  <span className="text-xs text-muted-foreground truncate">
                    {lastMessage.content}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
