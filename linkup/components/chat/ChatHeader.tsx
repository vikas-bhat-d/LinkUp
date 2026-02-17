"use client";

import { useConversationStore } from "@/store/conversation.store";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical } from "lucide-react";
import { useMemo } from "react";
import { MobileSidebar } from "@/components/sidebar/MobileSidebar";
import { toast } from "sonner"

interface ChatHeaderProps {
  conversationId: string;
}

export function ChatHeader({ conversationId }: ChatHeaderProps) {
  const { user } = useAuthStore();
  const conversations = useConversationStore((s) => s.conversations);

  const conversation = conversations.find(
    (c) => c.id === conversationId
  );

  const otherParticipant = useMemo(() => {
    return conversation?.participants.find(
      (p) => p.userId !== user?.id
    );
  }, [conversation, user?.id]);

  if (!conversation || !otherParticipant) {
    return (
      <header className="h-14 border-b flex items-center px-4">
        <span className="text-sm text-muted-foreground">
          Loading...
        </span>
      </header>
    );
  }

  const { name, avatarUrl } = otherParticipant.user;

  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  function handleFeatureClick(feature: string) {
    toast(`${feature} feature is under development.`,{ position: "top-center",duration: 1500 });
  }

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 bg-background">

      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <MobileSidebar />
        </div>

        <Avatar className="h-9 w-9">
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <span className="font-semibold leading-none">
            {name}
          </span>

          <span className="text-xs text-muted-foreground">
            Member since{" "}
            {new Date(conversation.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFeatureClick("Voice call")}
        >
          <Phone className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFeatureClick("Video call")}
        >
          <Video className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFeatureClick("More options")}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
