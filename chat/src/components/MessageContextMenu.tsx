import React from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { Message } from '../types';
import { 
  Reply, Edit2, Trash2, Check, CheckCheck, 
  ListTodo, Share, MessageSquare, Calendar 
} from 'lucide-react';

interface MessageContextMenuProps {
  message: Message;
  isCurrentUser: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleRead: () => void;
  onToggleDone: () => void;
  onReply: () => void;
  onAddToTodo: () => void;
  onSendToAll: () => void;
  onCreateEvent: () => void;
}

export function MessageContextMenu({
  children,
  message,
  isCurrentUser,
  onEdit,
  onDelete,
  onToggleRead,
  onToggleDone,
  onReply,
  onAddToTodo,
  onSendToAll,
  onCreateEvent,
}: React.PropsWithChildren<MessageContextMenuProps>) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content 
          className="min-w-[220px] bg-zinc-800 rounded-lg p-1 shadow-xl"
        >
          <ContextMenu.Item 
            className="flex items-center px-3 py-2 text-sm text-white hover:bg-zinc-700 rounded cursor-pointer"
            onClick={onReply}
          >
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </ContextMenu.Item>

          {!isCurrentUser && (
            <>
              <ContextMenu.Item 
                className="flex items-center px-3 py-2 text-sm text-white hover:bg-zinc-700 rounded cursor-pointer"
                onClick={onToggleRead}
              >
                <Check className="w-4 h-4 mr-2" />
                {message.isRead ? 'Mark as Unread' : 'Mark as Read'}
              </ContextMenu.Item>
              
              <ContextMenu.Item 
                className="flex items-center px-3 py-2 text-sm text-white hover:bg-zinc-700 rounded cursor-pointer"
                onClick={onToggleDone}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                {message.isDone ? 'Mark as Undone' : 'Mark as Done'}
              </ContextMenu.Item>
            </>
          )}

          <ContextMenu.Item 
            className="flex items-center px-3 py-2 text-sm text-white hover:bg-zinc-700 rounded cursor-pointer"
            onClick={onAddToTodo}
          >
            <ListTodo className="w-4 h-4 mr-2" />
            Add to Todo List
          </ContextMenu.Item>

          <ContextMenu.Item 
            className="flex items-center px-3 py-2 text-sm text-white hover:bg-zinc-700 rounded cursor-pointer"
            onClick={onCreateEvent}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Create Calendar Event
          </ContextMenu.Item>

          <ContextMenu.Item 
            className="flex items-center px-3 py-2 text-sm text-white hover:bg-zinc-700 rounded cursor-pointer"
            onClick={onSendToAll}
          >
            <Share className="w-4 h-4 mr-2" />
            Send to All
          </ContextMenu.Item>

          {isCurrentUser && (
            <>
              <ContextMenu.Separator className="h-px bg-zinc-700 my-1" />
              
              <ContextMenu.Item 
                className="flex items-center px-3 py-2 text-sm text-white hover:bg-zinc-700 rounded cursor-pointer"
                onClick={onEdit}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Message
              </ContextMenu.Item>
              
              <ContextMenu.Item 
                className="flex items-center px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 rounded cursor-pointer"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Message
              </ContextMenu.Item>
            </>
          )}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}