import { useEffect, useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/formatters';

export const ChatPanel = ({ projectId, receiverId, title }) => {
  const { rooms, fetchMessages, sendMessage, loading } = useChatStore();
  const [message, setMessage] = useState('');
  const roomKey = `p:${projectId}-${receiverId || 'unknown'}`;
  const messages = rooms[roomKey] || [];

  useEffect(() => {
    if (projectId && receiverId) {
      fetchMessages({ projectId, receiverId });
    }
  }, [fetchMessages, projectId, receiverId]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!message.trim() || !receiverId) {
      return;
    }

    await sendMessage({ projectId, receiverId, message });
    setMessage('');
  };

  return (
    <div className="surface p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-ink">{title || 'Founder chat'}</h3>
          <p className="text-sm text-slate-500">Keep conversations attached to the project record.</p>
        </div>
      </div>

      <div className="mb-4 max-h-80 space-y-3 overflow-auto rounded-3xl bg-slate-50 p-4">
        {!receiverId ? (
          <p className="text-sm text-slate-500">
            Chat is unavailable because the current project detail response does not include the creator id needed by the chat API.
          </p>
        ) : messages.length ? (
          messages.map((item, index) => (
            <div key={item.id || index} className="rounded-2xl bg-white p-4">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>{item.senderName || item.sender?.name || 'Participant'}</span>
                <span>{formatDate(item.createdAt || item.timestamp)}</span>
              </div>
              <p className="text-sm leading-6 text-slate-700">{item.message || item.content}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No messages yet. Start the conversation.</p>
        )}
      </div>

      <form className="flex gap-3" onSubmit={handleSend}>
        <input
          className="field-input"
          disabled={!receiverId}
          placeholder="Ask the creator about traction, roadmap, or risks"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button disabled={loading || !receiverId} type="submit">
          Send
        </Button>
      </form>
    </div>
  );
};
