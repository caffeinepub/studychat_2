import { motion } from "motion/react";
import type { Channel } from "../backend.d";
import { useChannelMessages } from "../hooks/useQueries";
import { MessageFeed } from "./MessageFeed";
import { MessageInput } from "./MessageInput";

const CHANNEL_EMOJIS: Record<string, string> = {
  "Homework Help": "📚",
  "General Chat": "💬",
  Math: "🔢",
  Science: "🔬",
  "Arts & Creativity": "🎨",
  "Sports & Fitness": "⚽",
};

const CHANNEL_COLORS: Record<string, string> = {
  "Homework Help": "oklch(0.72 0.19 28)",
  "General Chat": "oklch(0.62 0.18 200)",
  Math: "oklch(0.58 0.22 290)",
  Science: "oklch(0.68 0.18 140)",
  "Arts & Creativity": "oklch(0.72 0.18 320)",
  "Sports & Fitness": "oklch(0.72 0.2 130)",
};

function getChannelEmoji(name: string): string {
  return CHANNEL_EMOJIS[name] ?? "💬";
}

function getChannelColor(name: string): string {
  return CHANNEL_COLORS[name] ?? "oklch(0.58 0.22 290)";
}

interface ChatMainProps {
  channel: Channel;
}

export function ChatMain({ channel }: ChatMainProps) {
  const { data: messages, isLoading } = useChannelMessages(channel.id);
  const emoji = getChannelEmoji(channel.name);
  const color = getChannelColor(channel.name);

  return (
    <div className="flex flex-col h-screen min-w-0 flex-1">
      {/* Channel header */}
      <motion.header
        key={channel.id.toString()}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 px-6 py-4 flex items-center gap-4 border-b"
        style={{
          background: "oklch(0.16 0.02 268)",
          borderColor: "oklch(0.26 0.028 268)",
        }}
      >
        {/* Channel icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{
            background: `oklch(from ${color} l c h / 0.15)`,
            border: `1px solid oklch(from ${color} l c h / 0.25)`,
          }}
        >
          {emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-foreground text-lg leading-tight truncate">
              {channel.name}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm truncate">
            {channel.description}
          </p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "oklch(0.68 0.18 140)" }}
          />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </motion.header>

      {/* Message feed */}
      <MessageFeed
        messages={messages}
        isLoading={isLoading}
        channelName={channel.name}
        channelDescription={channel.description}
        channelEmoji={emoji}
      />

      {/* Message input */}
      <MessageInput channelId={channel.id} channelName={channel.name} />
    </div>
  );
}

interface NoChannelSelectedProps {
  hasChannels: boolean;
}

export function NoChannelSelected({ hasChannels }: NoChannelSelectedProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-screen text-center px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-4 max-w-sm"
      >
        {/* Animated emoji cluster */}
        <div className="relative w-24 h-24">
          {["📚", "💬", "🎨"].map((em, i) => (
            <motion.div
              key={em}
              className="absolute text-3xl"
              style={{
                left: i === 0 ? "0%" : i === 1 ? "50%" : "20%",
                top: i === 0 ? "50%" : i === 1 ? "0%" : "0%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            >
              {em}
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="font-display font-bold text-foreground text-2xl mb-2">
            {hasChannels ? "Pick a channel" : "Loading channels..."}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {hasChannels
              ? "Choose a channel from the sidebar to start chatting with your classmates."
              : "Setting up your study spaces..."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
