"use client";

import { Message } from "@/types/message";
import { MessageStatusIcon } from "./MessageStatusIcon";
import { cn } from "@/lib/utils";

interface Props {
  message: Message;
  isMe: boolean;
}

export function MessageBubble({ message, isMe }: Props) {
  return (
    <div
      className={cn(
        "flex w-full",
        isMe ? "justify-end" : "justify-start"
      )}
      data-id={message.id}
    >
      <div className="flex flex-col max-w-[75%] lg:max-w-[60%]">
        
        <div
          className={cn(
            "rounded-2xl px-4 py-2 text-sm wrap-break-words shadow-sm",
            isMe
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          )}
        >
          {message.content}
        </div>

        {isMe && (
          <div className="flex justify-end mt-1">
            <MessageStatusIcon status={message.status} />
          </div>
        )}
      </div>
    </div>
  );
}
