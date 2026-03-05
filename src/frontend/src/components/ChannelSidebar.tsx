import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Channel } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useChannels, useMyProfile } from "../hooks/useQueries";
import { ProfileEditDialog } from "./ProfileEditDialog";

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

interface ChannelSidebarProps {
  selectedChannelId: bigint | null;
  onSelectChannel: (channel: Channel) => void;
}

export function ChannelSidebar({
  selectedChannelId,
  onSelectChannel,
}: ChannelSidebarProps) {
  const { data: channels, isLoading: channelsLoading } = useChannels();
  const { data: profile } = useMyProfile();
  const { clear } = useInternetIdentity();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.19 28) 0%, oklch(0.62 0.22 290) 100%)",
              boxShadow: "0 4px 12px oklch(0.72 0.19 28 / 0.35)",
            }}
          >
            💬
          </div>
          <h1 className="font-display font-bold text-lg text-foreground">
            Study
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.72 0.19 28), oklch(0.62 0.22 290))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Chat
            </span>
          </h1>
        </div>
        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <Separator
        className="mx-4 mb-3"
        style={{ background: "oklch(0.28 0.03 268)" }}
      />

      {/* Channels label */}
      <p className="px-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        Channels
      </p>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3">
        {channelsLoading ? (
          <div className="flex flex-col gap-2 px-2">
            {Array.from({ length: 5 }, (_, i) => `sk-${i}`).map((key) => (
              <Skeleton
                key={key}
                className="h-14 rounded-xl"
                style={{ background: "oklch(0.22 0.025 268)" }}
              />
            ))}
          </div>
        ) : channels && channels.length > 0 ? (
          <div className="flex flex-col gap-1">
            {channels.map((channel, index) => {
              const isActive = selectedChannelId === channel.id;
              const emoji = getChannelEmoji(channel.name);
              const color = getChannelColor(channel.name);
              return (
                <motion.button
                  key={channel.id.toString()}
                  data-ocid={`channel.item.${index + 1}`}
                  onClick={() => {
                    onSelectChannel(channel);
                    setMobileOpen(false);
                  }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`channel-item w-full text-left px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{
                    background: isActive
                      ? `oklch(from ${color} l c h / 0.15)`
                      : undefined,
                    border: isActive
                      ? `1px solid oklch(from ${color} l c h / 0.3)`
                      : "1px solid transparent",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-all duration-200"
                      style={{
                        background: isActive
                          ? `oklch(from ${color} l c h / 0.2)`
                          : "oklch(0.22 0.025 268)",
                        boxShadow: isActive
                          ? `0 2px 8px oklch(from ${color} l c h / 0.3)`
                          : undefined,
                      }}
                    >
                      {emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {channel.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {channel.description}
                      </p>
                    </div>
                    {isActive && (
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: color }}
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div
            data-ocid="channel.empty_state"
            className="text-center py-8 text-muted-foreground text-sm"
          >
            No channels yet
          </div>
        )}
      </div>

      {/* User profile footer */}
      <div className="mt-auto px-3 pb-4 pt-3">
        <Separator
          className="mb-3"
          style={{ background: "oklch(0.28 0.03 268)" }}
        />
        <div
          className="flex items-center gap-2 px-2 py-2 rounded-xl"
          style={{ background: "oklch(0.2 0.025 268)" }}
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.19 28) 0%, oklch(0.62 0.22 290) 100%)",
              color: "oklch(0.99 0 0)",
            }}
          >
            {profile ? getInitials(profile.displayName) : "?"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {profile?.displayName ?? "Loading..."}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.phoneNumber
                ? `📱 ${profile.phoneNumber}`
                : profile?.instagramHandle
                  ? `📸 @${profile.instagramHandle}`
                  : "No contact info"}
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              data-ocid="profile.edit_button"
              onClick={() => setProfileOpen(true)}
              className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title="Edit profile"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={clear}
              className="w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Caffeine attribution */}
        <p className="text-center text-xs text-muted-foreground mt-3 pb-1">
          © {new Date().getFullYear()}{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with ❤️ on caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl text-foreground"
        style={{
          background: "oklch(0.2 0.025 268)",
          border: "1px solid oklch(0.28 0.03 268)",
        }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex w-72 flex-shrink-0 flex-col h-screen sticky top-0 border-r"
        style={{
          background: "oklch(0.17 0.022 268)",
          borderColor: "oklch(0.26 0.028 268)",
        }}
      >
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40"
              style={{ background: "oklch(0 0 0 / 0.6)" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col border-r"
              style={{
                background: "oklch(0.17 0.022 268)",
                borderColor: "oklch(0.26 0.028 268)",
              }}
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <ProfileEditDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
