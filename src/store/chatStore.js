import { create } from 'zustand';
import { chatService } from '../services/chatService';
import { handleApiError } from '../services/api';
import { asArray } from '../utils/normalizers';

export const useChatStore = create((set, get) => ({
  rooms: {},
  loading: false,
  error: null,
  fetchMessages: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const messages = asArray(await chatService.getMessages(projectId));
      const roomKey = `${projectId.projectId}-${projectId.receiverId}`;
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
      const roomKey = `${payload.projectId}-${payload.receiverId}`;
      set({
        rooms: {
          ...get().rooms,
          [roomKey]: [...asArray(get().rooms[roomKey]), message]
        },
        loading: false
      });
    } catch (error) {
      const message = handleApiError(error, 'Unable to send message.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  }
}));
