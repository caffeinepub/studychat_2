import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Channel, Message, StudentProfile } from "../backend.d";
import { useActor } from "./useActor";

// ── Profile ──────────────────────────────────────────────────────────────────

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<StudentProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateOrUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      displayName,
      phoneNumber,
      instagramHandle,
    }: {
      displayName: string;
      phoneNumber: string | null;
      instagramHandle: string | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.createOrUpdateProfile(
        displayName,
        phoneNumber,
        instagramHandle,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

// ── Channels ─────────────────────────────────────────────────────────────────

export function useChannels() {
  const { actor, isFetching } = useActor();
  return useQuery<Channel[]>({
    queryKey: ["channels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChannels();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 10,
  });
}

export function useInitializeChannels() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      await actor.initializeChannels();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}

// ── Messages ──────────────────────────────────────────────────────────────────

export function useChannelMessages(channelId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["messages", channelId?.toString()],
    queryFn: async () => {
      if (!actor || channelId === null) return [];
      return actor.getChannelMessages(channelId, 0n);
    },
    enabled: !!actor && !isFetching && channelId !== null,
    refetchInterval: 5000,
    staleTime: 4000,
  });
}

export function usePostMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      channelId,
      content,
    }: {
      channelId: bigint;
      content: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.postMessage(channelId, content);
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData<Message[]>(
        ["messages", newMessage.channelId.toString()],
        (old) => [...(old ?? []), newMessage],
      );
    },
  });
}
