import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const floatingEmojis = ["📚", "💬", "🔢", "🔬", "🎨", "⚽", "🎵", "🌍"];

export function LoginScreen() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Floating emoji background */}
      {floatingEmojis.map((emoji, idx) => (
        <motion.div
          key={emoji}
          className="absolute text-4xl pointer-events-none select-none"
          style={{
            left: `${10 + ((idx * 12) % 85)}%`,
            top: `${8 + ((idx * 17) % 80)}%`,
            opacity: 0.12,
          }}
          animate={{
            y: [0, -18, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 3 + idx * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: idx * 0.3,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "oklch(0.58 0.22 290 / 0.12)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "oklch(0.72 0.19 28 / 0.1)",
          filter: "blur(80px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.19 28) 0%, oklch(0.62 0.22 290) 100%)",
              boxShadow: "0 8px 32px oklch(0.72 0.19 28 / 0.4)",
            }}
          >
            💬
          </div>
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold text-foreground">
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
            <p className="text-muted-foreground mt-1 font-body text-sm">
              Where students connect & collaborate
            </p>
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {[
            "📚 Homework Help",
            "🔬 Science",
            "🎨 Arts",
            "⚽ Sports",
            "🔢 Math",
          ].map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background: "oklch(0.22 0.032 268)",
                border: "1px solid oklch(0.32 0.04 268)",
                color: "oklch(0.78 0.06 268)",
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="w-full glass rounded-2xl p-8 flex flex-col items-center gap-6"
        >
          <div className="text-center">
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              Join your classmates
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sign in securely to start chatting in homework groups, discuss
              your subjects, and connect with classmates.
            </p>
          </div>

          <Button
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            size="lg"
            className="w-full h-12 font-display font-semibold text-base rounded-xl transition-all duration-200"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.19 28) 0%, oklch(0.65 0.21 22) 100%)",
              boxShadow: "0 4px 16px oklch(0.72 0.19 28 / 0.35)",
              color: "oklch(0.99 0 0)",
            }}
          >
            {isLoggingIn || isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Get Started →"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Secured by Internet Identity — no passwords required
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
