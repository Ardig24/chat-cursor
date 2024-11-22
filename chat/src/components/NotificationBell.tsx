import React from 'react';
import { Bell } from 'lucide-react';
import { useChatStore } from '../store';

export function NotificationBell() {
  const { notifications, setNotifications, users } = useChatStore();
  const totalUnread = users.reduce((sum, user) => sum + user.unreadMessages, 0);

  return (
    <button
      onClick={() => setNotifications(!notifications)}
      className="relative p-2 rounded-lg hover:bg-zinc-700"
    >
      <Bell
        className={`w-5 h-5 ${notifications ? 'text-blue-400' : 'text-zinc-400'}`}
      />
      {totalUnread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {totalUnread}
        </span>
      )}
    </button>
  );
}