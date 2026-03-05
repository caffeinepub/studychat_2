import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { Message } from "../backend.d";

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const AVATAR_COLORS = [
  "linear-gradient(135deg, oklch(0.72 0.19 28) 0%, oklch(0.65 0.21 22) 100%)",
  "linear-gradient(135deg, oklch(0.58 0.22 290) 0%, oklch(0.52 0.2 280) 100%)",
  "linear-gradient(135deg, oklch(0.68 0.18 140) 0%, oklch(0.60 0.16 130) 100%)",
  "linear-gradient(135deg, oklch(0.72 0.18 200) 0%, oklch(0.64 0.16 190) 100%)",
  "linear-gradient(135deg, oklch(0.72 0.18 320) 0%, oklch(0.64 0.16 310) 100%)",
  "linear-gradient(135deg, oklch(0.72 0.19 60) 0%, oklch(0.64 0.17 50) 100%)",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatTimestamp(timestamp: bigint): string {
  // Backend timestamp is in nanoseconds
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return `Yesterday ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface MessageItemProps {
  message: Message;
  index: number;
}

function MessageItem({ message, index }: MessageItemProps) {
  const initials = getInitials(message.authorName);
  const avatarGradient = getAvatarColor(message.authorName);
  const timeStr = formatTimestamp(message.timestamp);

  return (
    <motion.div
      data-ocid={`chat.message.item.${index + 1}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-start gap-3 group"
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
        style={{
          background: avatarGradient,
          color: "oklch(0.99 0 0)",
          boxShadow: "0 2px 8px oklch(0 0 0 / 0.25)",
        }}
      >
        {initials || "?"}
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-sm text-foreground font-display">
            {message.authorName}
          </span>
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {timeStr}
          </span>
        </div>
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed break-words max-w-2xl"
          style={{
            background: "oklch(0.22 0.025 268)",
            color: "oklch(0.92 0.01 268)",
            border: "1px solid oklch(0.28 0.03 268)",
          }}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}

interface MessageFeedProps {
  messages: Message[] | undefined;
  isLoading: boolean;
  channelName: string;
  channelDescription: string;
  channelEmoji: string;
}

export function MessageFeed({
  messages,
  isLoading,
  channelName,
  channelDescription,
  channelEmoji,
}: MessageFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  const msgCount = messages?.length ?? 0;
  useEffect(() => {
    if (bottomRef.current && msgCount > 0) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgCount]);

  return (
    <div
      ref={containerRef}
      data-ocid="chat.list"
      className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4"
    >
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }, (_, i) => `msg-sk-${i}`).map((key) => (
            <div key={key} className="flex items-start gap-3">
              <Skeleton
                className="w-9 h-9 rounded-full flex-shrink-0"
                style={{ background: "oklch(0.22 0.025 268)" }}
              />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton
                  className="h-4 w-32"
                  style={{ background: "oklch(0.22 0.025 268)" }}
                />
                <Skeleton
                  className="h-12 w-3/4 rounded-2xl"
                  style={{ background: "oklch(0.22 0.025 268)" }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : messages && messages.length > 0 ? (
        <div className="flex flex-col gap-4">
          {/* Channel welcome */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 py-6 text-center"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{
                background: "oklch(0.22 0.025 268)",
                border: "1px solid oklch(0.28 0.03 268)",
              }}
            >
              {channelEmoji}
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground text-lg">
                Welcome to #{channelName}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {channelDescription}
              </p>
            </div>
            <div
              className="w-32 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.32 0.04 268), transparent)",
              }}
            />
          </motion.div>

          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <MessageItem
                key={`${message.authorId.toString()}-${message.timestamp.toString()}`}
                message={message}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div
          data-ocid="chat.empty_state"
          className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center"
        >
          <div className="text-5xl">{channelEmoji}</div>
          <div>
            <h3 className="font-display font-semibold text-foreground text-lg mb-1">
              No messages yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Be the first to say something in #{channelName}!
            </p>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
