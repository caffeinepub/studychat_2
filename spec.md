# StudyChat - Student Discussion App

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Student profile creation with optional phone number and Instagram handle fields
- Multiple discussion channels/rooms (e.g. Homework Help, General, Science, Math, Arts, Sports)
- Real-time-style chat interface per channel: message list, input box, send button
- Username display on messages with timestamp
- Profile page where a student sets their display name, phone number (optional), Instagram handle (optional)
- Channel sidebar navigation for switching between rooms
- Message feed showing sender name, avatar initials, message content, time

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Student profiles (name, phone, instagram), channels (id, name, description), messages (channelId, authorId, text, timestamp)
2. Backend: APIs - createProfile, getProfile, updateProfile, listChannels, postMessage, getMessages(channelId)
3. Frontend: Onboarding screen to set display name + optional phone/Instagram
4. Frontend: Main layout - left sidebar with channel list, main area with message feed + input
5. Frontend: Profile modal/page to view/edit contact info
6. Frontend: Message bubbles with sender name, initials avatar, timestamp
7. Seed a set of default channels: Homework Help, General Chat, Math, Science, Arts & Creativity, Sports & Fitness
