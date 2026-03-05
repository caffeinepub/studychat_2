import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    channelId: bigint;
    authorId: Principal;
    authorName: string;
    timestamp: bigint;
}
export interface StudentProfile {
    displayName: string;
    instagramHandle?: string;
    phoneNumber?: string;
}
export interface Channel {
    id: bigint;
    name: string;
    description: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateProfile(displayName: string, phoneNumber: string | null, instagramHandle: string | null): Promise<void>;
    getAllMessages(channelId: bigint): Promise<Array<Message>>;
    getCallerUserRole(): Promise<UserRole>;
    getChannelMessages(channelId: bigint, page: bigint): Promise<Array<Message>>;
    getMyProfile(): Promise<StudentProfile | null>;
    initializeChannels(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listChannels(): Promise<Array<Channel>>;
    postMessage(channelId: bigint, content: string): Promise<Message>;
}
