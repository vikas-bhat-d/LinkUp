"use client";

import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageStatus } from "@/types/message";

interface Props {
  status?: MessageStatus;
}

export function MessageStatusIcon({ status }: Props) {
  if (!status) return null;

  const isSeen = status === "SEEN";
  const isDelivered = status === "DELIVERED";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border w-5 h-5 text-[8px]",
        isSeen
          ? "bg-blue-500/10 border-blue-500 text-blue-500"
          : "bg-muted border-muted-foreground/20 text-muted-foreground"
      )}
    >
      {isDelivered || isSeen ? (
        <CheckCheck className="w-3 h-3" />
      ) : (
        <Check className="w-3 h-3" />
      )}
    </div>
  );
}
