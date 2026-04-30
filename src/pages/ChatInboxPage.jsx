import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/feedback/LoadingState';
import { EmptyState } from '../components/feedback/EmptyState';
import { formatDate } from '../utils/formatters';
import { ROLES } from '../utils/constants';

const roomKeyOf = ({ conversationId, projectId, receiverId }) =>
  conversationId ? `c:${conversationId}` : `p:${projectId}-${receiverId}`;

const normalizeFounderName = (value) => {
  const text = String(value || '').trim();
  if (!text || text.includes('@')) {
    return 'Founder';
  }
  return text;
};

export const ChatInboxPage = () => {
  const [params, setParams] = useSearchParams();
  const queryProjectId = params.get('projectId');
  const queryReceiverId = params.get('receiverId');
  const queryReceiverName = params.get('receiverName');
  const queryProjectTitle = params.get('projectTitle');
  const { user } = useAuthStore();
  const { conversations, rooms, fetchConversations, fetchMessages, sendMessage, loading } = useChatStore();
  const [draft, setDraft] = useState('');

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const id = window.setInterval(() => {
      fetchConversations();
    }, 12000);
    return () => clearInterval(id);
  }, [fetchConversations]);

  const activeThread = useMemo(() => {
    if (queryProjectId && queryReceiverId) {
      const matched = conversations.find(
        (item) => String(item.projectId) === String(queryProjectId) && String(item.receiverId) === String(queryReceiverId)
      );
      if (matched) {
        return matched;
      }

      return {
        projectId: Number(queryProjectId),
        receiverId: Number(queryReceiverId),
        receiverName: normalizeFounderName(queryReceiverName),
        projectTitle: queryProjectTitle || 'Project'
      };
    }

    if (!conversations.length) {
      return null;
    }

    return conversations[0];
  }, [conversations, queryProjectId, queryProjectTitle, queryReceiverId, queryReceiverName]);

  useEffect(() => {
    if (!activeThread?.projectId || !activeThread?.receiverId) {
      return;
    }

    fetchMessages(activeThread);
  }, [activeThread?.projectId, activeThread?.receiverId, fetchMessages]);

  useEffect(() => {
    if (!activeThread?.projectId || !activeThread?.receiverId) {
      return undefined;
    }

    const id = window.setInterval(() => {
      fetchMessages(activeThread);
    }, 4000);

    return () => clearInterval(id);
  }, [activeThread?.projectId, activeThread?.receiverId, fetchMessages]);

  const activeRoomKey = activeThread ? roomKeyOf(activeThread) : null;
  const messages = activeRoomKey ? rooms[activeRoomKey] || [] : [];

  const handleSelectThread = (thread) => {
    setParams({
      projectId: String(thread.projectId),
      receiverId: String(thread.receiverId)
    });
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!activeThread || !draft.trim()) {
      return;
    }
    await sendMessage({
      projectId: activeThread.projectId,
      receiverId: activeThread.receiverId,
      message: draft.trim()
    });
    setDraft('');
  };

  return (
    <div className="page-shell py-16">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Messages</p>
        <h1 className="mt-3 section-title">Project conversations</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.38fr_0.62fr]">
        <Card>
          <h2 className="text-xl font-bold text-ink">Conversations</h2>
          <div className="mt-4 space-y-3">
            {loading && !conversations.length ? (
              <LoadingState label="Loading chats..." />
            ) : conversations.length ? (
              conversations.map((thread) => {
                const isActive =
                  String(thread.projectId) === String(activeThread?.projectId) &&
                  String(thread.receiverId) === String(activeThread?.receiverId);

                const isCreator = user?.role === ROLES.CREATOR;
                const receiverName = normalizeFounderName(thread.receiverName);
                console.log("thread.receiverName", receiverName);
                const title = isCreator
                  ? `${thread.projectTitle || 'Project'} — ${receiverName || 'Investor'}`
                  : `${receiverName} — ${thread.projectTitle || 'Project'}`;
                return (
                  <button
                    key={thread.conversationId || `${thread.projectId}-${thread.receiverId}`}
                    type="button"
                    onClick={() => handleSelectThread(thread)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isActive ? 'border-accent bg-teal-50' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    {isCreator ? (
                      <p className="mt-2 line-clamp-1 text-xs text-slate-500">
                        {thread.lastMessage || 'No messages yet'}
                      </p>
                    ) : (
                      <p className="mt-2 line-clamp-1 text-xs text-slate-500">
                        {thread.lastMessage || 'No messages yet'}
                      </p>
                    )}
                  </button>
                );
              })
            ) : (
              <EmptyState
                title="No conversations yet"
                description={
                  user?.role === ROLES.INVESTOR
                    ? 'Start a chat from a project page.'
                    : 'Investor messages will appear here when someone contacts you about a project.'
                }
              />
            )}
          </div>
        </Card>

        <Card>
          {activeThread ? (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-ink">
                  {user?.role === ROLES.CREATOR
                    ? `${activeThread.projectTitle || 'Project'} — ${normalizeFounderName(activeThread.receiverName) || 'Investor'}`
                    : `${normalizeFounderName(activeThread.receiverName)} — ${activeThread.projectTitle || 'Project'}`}
                </h2>
              </div>

              <div className="mb-4 max-h-[28rem] space-y-3 overflow-auto rounded-3xl bg-slate-50 p-4">
                {messages.length ? (
                  messages.map((item, index) => {
                    const mine = String(item.senderId) === String(user?.id);
                    return (
                      <div
                        key={item.id || index}
                        className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                          mine ? 'ml-auto bg-teal-600 text-white' : 'bg-white text-slate-700'
                        }`}
                      >
                        <p>{item.message || item.content}</p>
                        <p className={`mt-1 text-[11px] ${mine ? 'text-teal-100' : 'text-slate-400'}`}>
                          {formatDate(item.createdAt || item.timestamp)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500">
                    {user?.role === ROLES.INVESTOR ? 'No messages yet. Start the conversation.' : 'No messages yet.'}
                  </p>
                )}
              </div>

              <form className="flex gap-3" onSubmit={handleSend}>
                <input
                  className="field-input"
                  placeholder="Type your message..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <Button disabled={loading || !draft.trim()} type="submit">
                  Send
                </Button>
              </form>
            </>
          ) : (
            <EmptyState title="Select a conversation" description="Choose a conversation from the left panel." />
          )}
        </Card>
      </div>
    </div>
  );
};
