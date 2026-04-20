import { create } from 'zustand';
import { chatService } from '../services/chatService';
import { handleApiError } from '../services/api';
import { asArray } from '../utils/normalizers';

const roomKeyOf = (thread) => {
  if (!thread) {
    return null;
  }
  if (thread.conversationId) {
    return `c:${thread.conversationId}`;
  }
  if (thread.projectId && thread.receiverId) {
    return `p:${thread.projectId}-${thread.receiverId}`;
  }
  return null;
};

const uniqBy = (items, keyOf) => {
  const out = [];
  const seen = new Set();
  for (const item of asArray(items)) {
    const key = keyOf(item);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(item);
  }
  return out;
};

export const useChatStore = create((set, get) => ({
  conversations: [],
  rooms: {},
  loading: false,
  error: null,
  fetchConversations: async () => {
    set({ loading: true, error: null });
    try {
      const conversations = uniqBy(await chatService.getConversations(), (c) =>
        c?.conversationId ? `c:${c.conversationId}` : `p:${c?.projectId}-${c?.receiverId}`
      );
      set({ conversations, loading: false });
      return conversations;
    } catch (error) {
      set({ loading: false, error: handleApiError(error, 'Unable to load conversations.') });
      return [];
    }
  },
  fetchMessages: async (thread) => {
    set({ loading: true, error: null });
    try {
      const messages = asArray(await chatService.getMessages(thread));
      const roomKey = roomKeyOf(thread);
      if (!roomKey) {
        set({ loading: false });
        return;
      }
      set({
        rooms: {
          ...get().rooms,
          [roomKey]: messages
        },
        loading: false
      });
    } catch (error) {
      set({ loading: false, error: handleApiError(error, 'Unable to load messages.') });
    }
  },
  sendMessage: async (payload) => {
    set({ loading: true, error: null });
    try {
      const message = await chatService.sendMessage(payload);
      const conversationKey = roomKeyOf({ conversationId: message?.conversationId, ...payload });
      const legacyKey = payload?.projectId && payload?.receiverId ? `p:${payload.projectId}-${payload.receiverId}` : null;
      set({
        rooms: {
          ...get().rooms,
          ...(conversationKey
            ? { [conversationKey]: [...asArray(get().rooms[conversationKey]), message] }
            : null),
          ...(legacyKey && legacyKey !== conversationKey
            ? { [legacyKey]: [...asArray(get().rooms[legacyKey]), message] }
            : null)
        },
        loading: false
      });
      // Ensure thread list updates (new conversation / last message preview).
      get().fetchConversations?.();
      return message;
    } catch (error) {
      const message = handleApiError(error, 'Unable to send message.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  }
}));
