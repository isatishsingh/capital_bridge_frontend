import api from './api';
import { asArray } from '../utils/normalizers';

const attachSenderNames = async (messages) => {
  const list = asArray(messages);
  if (!list.length) {
    return list;
  }

  const { data } = await api.get('/api/users').catch(() => ({ data: [] }));
  const userMap = new Map(asArray(data).map((u) => [String(u.id), u]));

  return list.map((item) => ({
    ...item,
    senderName: userMap.get(String(item.senderId))?.name,
    createdAt: item.createdAt || item.timestamp
  }));
};

export const chatService = {
  getConversations: async () => {
    const { data } = await api.get('/api/chat/conversations');
    return asArray(data);
  },
  getMessages: async ({ conversationId, projectId, receiverId }) => {
    if (conversationId) {
      const { data } = await api.get('/api/chat/messages/by-conversation', {
        params: { conversationId }
      });
      return attachSenderNames(data);
    }

    const { data } = await api.get('/api/chat/messages', {
      params: { projectId, receiverId }
    });
    return attachSenderNames(data);
  },
  sendMessage: async ({ projectId, receiverId, message }) => {
    const { data } = await api.post('/api/chat/send', {
      projectId,
      receiverId,
      message
    });
    const [enriched] = await attachSenderNames([data]);
    return enriched || data;
  }
};
