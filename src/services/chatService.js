import api from './api';
import { asArray } from '../utils/normalizers';

const getUserMap = async () => {
  const { data } = await api.get('/api/users').catch(() => ({ data: [] }));
  return new Map(asArray(data).map((u) => [String(u.id), u]));
};

const attachSenderNames = async (messages) => {
  const list = asArray(messages);
  if (!list.length) {
    return list;
  }

  const userMap = await getUserMap();

  return list.map((item) => ({
    ...item,
    senderName: userMap.get(String(item.senderId))?.name,
    createdAt: item.createdAt || item.timestamp
  }));
};

const attachReceiverNames = async (conversations) => {
  const list = asArray(conversations);
  if (!list.length) {
    return list;
  }

  const userMap = await getUserMap();
  return list.map((thread) => {
    const resolvedName = userMap.get(String(thread.receiverId))?.name;
    return {
      ...thread,
      receiverName:
        resolvedName ||
        (thread.receiverName && !String(thread.receiverName).includes('@') ? thread.receiverName : 'Founder')
    };
  });
};

export const chatService = {
  getConversations: async () => {
    const { data } = await api.get('/api/chat/conversations');
    return attachReceiverNames(data);
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
