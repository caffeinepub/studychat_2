import { Button } from "@/components/ui/button";
import { Loader2, SendHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { usePostMessage } from "../hooks/useQueries";

interface MessageInputProps {
  channelId: bigint;
  channelName: string;
}

export function MessageInput({ channelId, channelName }: MessageInputProps) {
  const [content, setContent] = useState("");
  const postMessage = usePostMessage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = content.trim().length > 0 && !postMessage.isPending;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;

    const messageContent = content.trim();
    setContent("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      await postMessage.mutateAsync({ channelId, content: messageContent });
    } catch {
      toast.error("Failed to send message. Please try again.");
      setContent(messageContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-resize textarea
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  return (
    <div
      className="px-4 py-3 border-t"
      style={{
        background: "oklch(0.14 0.018 268)",
        borderColor: "oklch(0.26 0.028 268)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-2.5 transition-all duration-200"
          style={{
            background: "oklch(0.2 0.025 268)",
            border: "1px solid oklch(0.3 0.035 268)",
          }}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            data-ocid="chat.textarea"
            value={content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channelName}... (Enter to send, Shift+Enter for newline)`}
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground min-h-[24px] max-h-[120px] py-1 scrollbar-thin"
            style={{ lineHeight: "1.5" }}
          />

          {/* Send button */}
          <motion.div
            whileHover={canSend ? { scale: 1.05 } : {}}
            whileTap={canSend ? { scale: 0.95 } : {}}
          >
            <Button
              type="submit"
              data-ocid="chat.submit_button"
              disabled={!canSend}
              size="icon"
              className="w-9 h-9 rounded-xl flex-shrink-0 transition-all duration-200"
              style={
                canSend
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.72 0.19 28) 0%, oklch(0.65 0.21 22) 100%)",
                      boxShadow: "0 2px 8px oklch(0.72 0.19 28 / 0.4)",
                      color: "oklch(0.99 0 0)",
                    }
                  : {}
              }
            >
              {postMessage.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SendHorizontal className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Helper text */}
        <p className="text-xs text-muted-foreground mt-1.5 px-1">
          Press{" "}
          <kbd
            className="px-1.5 py-0.5 rounded text-xs font-mono"
            style={{
              background: "oklch(0.22 0.025 268)",
              border: "1px solid oklch(0.3 0.03 268)",
            }}
          >
            Enter
          </kbd>{" "}
          to send
        </p>
      </form>
    </div>
  );
}
