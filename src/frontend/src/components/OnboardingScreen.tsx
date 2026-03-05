import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Loader2, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateOrUpdateProfile,
  useInitializeChannels,
} from "../hooks/useQueries";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");

  const createProfile = useCreateOrUpdateProfile();
  const initChannels = useInitializeChannels();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Please enter your display name");
      return;
    }

    try {
      await Promise.all([
        createProfile.mutateAsync({
          displayName: displayName.trim(),
          phoneNumber: phoneNumber.trim() || null,
          instagramHandle: instagramHandle.trim()
            ? instagramHandle.trim().replace(/^@/, "")
            : null,
        }),
        initChannels.mutateAsync(),
      ]);
      onComplete();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const isLoading = createProfile.isPending || initChannels.isPending;

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glows */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "oklch(0.58 0.22 290 / 0.1)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "oklch(0.72 0.19 28 / 0.1)",
          filter: "blur(70px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-4">👋</div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Set up your profile
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Let your classmates know who you are. Add your contact info so they
            can reach you outside the app.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Display Name */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="displayName"
                className="text-foreground font-medium text-sm flex items-center gap-2"
              >
                <User className="w-4 h-4 text-primary" />
                Display Name{" "}
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.72 0.19 28)" }}
                >
                  required
                </span>
              </Label>
              <Input
                id="displayName"
                data-ocid="onboarding.input"
                type="text"
                placeholder="e.g. Alex Johnson"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-11 rounded-xl border-border bg-secondary/50 focus:border-primary focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                autoFocus
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="phone"
                className="text-foreground font-medium text-sm flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-muted-foreground" />
                Phone Number{" "}
                <span className="text-xs text-muted-foreground">optional</span>
              </Label>
              <Input
                id="phone"
                data-ocid="onboarding.phone_input"
                type="tel"
                placeholder="e.g. +1 234 567 8900"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-11 rounded-xl border-border bg-secondary/50 focus:border-primary focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Instagram */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="instagram"
                className="text-foreground font-medium text-sm flex items-center gap-2"
              >
                <Instagram className="w-4 h-4 text-muted-foreground" />
                Instagram{" "}
                <span className="text-xs text-muted-foreground">optional</span>
              </Label>
              <Input
                id="instagram"
                data-ocid="onboarding.instagram_input"
                type="text"
                placeholder="@yourhandle"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="h-11 rounded-xl border-border bg-secondary/50 focus:border-primary focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                The @ prefix will be added automatically if omitted
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              data-ocid="onboarding.submit_button"
              disabled={isLoading || !displayName.trim()}
              size="lg"
              className="w-full h-12 font-display font-semibold text-base rounded-xl mt-2 transition-all duration-200"
              style={{
                background: displayName.trim()
                  ? "linear-gradient(135deg, oklch(0.72 0.19 28) 0%, oklch(0.65 0.21 22) 100%)"
                  : undefined,
                boxShadow: displayName.trim()
                  ? "0 4px 16px oklch(0.72 0.19 28 / 0.35)"
                  : undefined,
                color: displayName.trim() ? "oklch(0.99 0 0)" : undefined,
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Get Started 🚀"
              )}
            </Button>
          </form>
        </motion.div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          You can always update your profile later
        </p>
      </motion.div>
    </div>
  );
}
