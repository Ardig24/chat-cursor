import React from 'react';
import { Edit2, Trash2, Check, CheckCheck, MessageSquare } from 'lucide-react';
import { Message } from '../types';

interface MessageActionsProps {
  message: Message;
  isCurrentUser: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleRead: () => void;
  onToggleDone: () => void;
  onReply: () => void;
}

export function MessageActions({
  message,
  isCurrentUser,
  onEdit,
  onDelete,
  onToggleRead,
  onToggleDone,
  onReply,
}: MessageActionsProps) {
  return (
    <div className="absolute top-0 right-0 transform translate-x-full pl-2 flex items-center space-x-1">
      {!isCurrentUser && (
        <>
          <button
            onClick={onToggleRead}
            className={`p-1 rounded hover:bg-zinc-700 ${
              message.isRead ? 'text-blue-400' : 'text-zinc-400'
            }`}
            title={message.isRead ? 'Mark as unread' : 'Mark as read'}
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleDone}
            className={`p-1 rounded hover:bg-zinc-700 ${
              message.isDone ? 'text-green-400' : 'text-zinc-400'
            }`}
            title={message.isDone ? 'Mark as undone' : 'Mark as done'}
          >
            <CheckCheck className="w-4 h-4" />
          </button>
        </>
      )}
      <button
        onClick={onReply}
        className="p-1 rounded hover:bg-zinc-700 text-zinc-400"
        title="Reply"
      >
        <MessageSquare className="w-4 h-4" />
      </button>
      {isCurrentUser && (
        <>
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-zinc-700 text-zinc-400"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-zinc-700 text-zinc-400"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}