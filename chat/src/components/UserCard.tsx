import React from 'react';
import { User } from '../types';
import { MessageSquare } from 'lucide-react';

interface UserCardProps {
  user: User;
  onClick: (user: User) => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div 
      onClick={() => onClick(user)}
      className="bg-zinc-800 p-4 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors"
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-800
            ${user.status === 'online' ? 'bg-green-500' : 
              user.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'}`}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium">{user.name}</h3>
          <p className="text-zinc-400 text-sm capitalize">{user.status}</p>
        </div>
        <MessageSquare className="w-5 h-5 text-zinc-400" />
      </div>
    </div>
  );
}