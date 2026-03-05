import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import type { Channel } from "./backend.d";
import { ChannelSidebar } from "./components/ChannelSidebar";
import { ChatMain, NoChannelSelected } from "./components/ChatMain";
import { LoginScreen } from "./components/LoginScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useMyProfile } from "./hooks/useQueries";

function AppShellSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar skeleton */}
      <aside
        className="hidden lg:flex w-72 flex-shrink-0 flex-col border-r p-4 gap-3"
        style={{
          background: "oklch(0.17 0.022 268)",
          borderColor: "oklch(0.26 0.028 268)",
        }}
      >
        <div className="flex items-center gap-3 px-1 py-2 mb-2">
          <Skeleton
            className="w-9 h-9 rounded-xl"
            style={{ background: "oklch(0.22 0.025 268)" }}
          />
          <Skeleton
            className="h-6 w-28"
            style={{ background: "oklch(0.22 0.025 268)" }}
          />
        </div>
        {Array.from({ length: 6 }, (_, i) => `sidebar-sk-${i}`).map((key) => (
          <Skeleton
            key={key}
            className="h-14 rounded-xl"
            style={{ background: "oklch(0.22 0.025 268)" }}
          />
        ))}
      </aside>
      {/* Main area skeleton */}
      <div className="flex-1 flex flex-col">
        <div
          className="h-16 border-b px-6 flex items-center gap-4"
          style={{ borderColor: "oklch(0.26 0.028 268)" }}
        >
          <Skeleton
            className="w-10 h-10 rounded-xl"
            style={{ background: "oklch(0.22 0.025 268)" }}
          />
          <Skeleton
            className="h-6 w-40"
            style={{ background: "oklch(0.22 0.025 268)" }}
          />
        </div>
        <div className="flex-1 p-6 flex flex-col gap-4">
          {Array.from({ length: 5 }, (_, i) => `main-sk-${i}`).map((key) => (
            <div key={key} className="flex items-start gap-3">
              <Skeleton
                className="w-9 h-9 rounded-full"
                style={{ background: "oklch(0.22 0.025 268)" }}
              />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton
                  className="h-4 w-28"
                  style={{ background: "oklch(0.22 0.025 268)" }}
                />
                <Skeleton
                  className="h-12 w-2/3 rounded-2xl"
                  style={{ background: "oklch(0.22 0.025 268)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const isAuthenticated = !!identity;

  const { data: profile, isLoading: profileLoading } = useMyProfile();

  // While checking auth state
  if (isInitializing) {
    return <AppShellSkeleton />;
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // Auth established, loading profile
  if (profileLoading) {
    return <AppShellSkeleton />;
  }

  // Profile doesn't exist or onboarding not complete
  if ((profile === null || profile === undefined) && !onboardingComplete) {
    return (
      <>
        <OnboardingScreen onComplete={() => setOnboardingComplete(true)} />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // Main app
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "oklch(0.14 0.018 268)" }}
    >
      {/* Sidebar */}
      <ChannelSidebar
        selectedChannelId={selectedChannel?.id ?? null}
        onSelectChannel={setSelectedChannel}
      />

      {/* Main chat area */}
      <main className="flex-1 min-w-0 overflow-hidden">
        {selectedChannel ? (
          <ChatMain channel={selectedChannel} />
        ) : (
          <NoChannelSelected hasChannels={true} />
        )}
      </main>

      {/* Footer - caffeine attribution */}
      <Toaster richColors position="top-right" />
    </div>
  );
}
