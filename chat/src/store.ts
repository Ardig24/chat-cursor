import { create } from 'zustand';
import { Message, User, Project, Task, Poll } from './types';

interface ChatState {
  currentUser: User;
  users: User[];
  messages: Message[];
  projects: Project[];
  tasks: Task[];
  polls: Poll[];
  selectedUser: User | null;
  selectedProject: Project | null;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
  setSelectedUser: (user: User | null) => void;
  setSelectedProject: (project: Project | null) => void;
  addMessage: (message: Message) => void;
  editMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  toggleMessageStatus: (messageId: string, status: 'read' | 'done') => void;
  addTask: (task: Task) => void;
  toggleTaskComplete: (taskId: string) => void;
  addPoll: (poll: Poll) => void;
  votePoll: (pollId: string, optionId: string, userId: string) => void;
  incrementUnread: (userId: string) => void;
  resetUnread: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentUser: {
    id: 'current-user',
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    status: 'online',
    unreadMessages: 0,
  },
  users: [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      status: 'online',
      unreadMessages: 0,
    },
    {
      id: '2',
      name: 'Michael Torres',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      status: 'busy',
      unreadMessages: 0,
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      status: 'offline',
      unreadMessages: 0,
    },
  ],
  projects: [
    { id: 'general', name: 'General', color: '#64748b' },
    { id: 'website', name: 'Website Redesign', color: '#3b82f6' },
    { id: 'mobile', name: 'Mobile App', color: '#ef4444' },
    { id: 'api', name: 'API Integration', color: '#22c55e' },
  ],
  messages: [],
  tasks: [],
  polls: [],
  selectedUser: null,
  selectedProject: null,
  notifications: true,

  setNotifications: (enabled) => set({ notifications: enabled }),
  
  setSelectedUser: (user) => set({ selectedUser: user }),
  
  setSelectedProject: (project) => set({ selectedProject: project }),
  
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message],
    users: message.receiverId === 'all' 
      ? state.users.map(u => ({
          ...u,
          unreadMessages: u.id !== message.senderId ? u.unreadMessages + 1 : u.unreadMessages
        }))
      : state.users.map(u => ({
          ...u,
          unreadMessages: u.id === message.receiverId ? u.unreadMessages + 1 : u.unreadMessages
        }))
  })),
  
  editMessage: (messageId, content) => set((state) => ({
    messages: state.messages.map(msg =>
      msg.id === messageId ? { ...msg, content, isEdited: true } : msg
    )
  })),
  
  deleteMessage: (messageId) => set((state) => ({
    messages: state.messages.filter(msg => msg.id !== messageId),
    tasks: state.tasks.filter(task => task.messageId !== messageId),
    polls: state.polls.filter(poll => poll.messageId !== messageId)
  })),
  
  toggleMessageStatus: (messageId, status) => set((state) => ({
    messages: state.messages.map(msg =>
      msg.id === messageId
        ? { ...msg, [status === 'read' ? 'isRead' : 'isDone']: !msg[status === 'read' ? 'isRead' : 'isDone'] }
        : msg
    )
  })),
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),
  
  toggleTaskComplete: (taskId) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
  })),
  
  addPoll: (poll) => set((state) => ({
    polls: [...state.polls, poll]
  })),
  
  votePoll: (pollId, optionId, userId) => set((state) => ({
    polls: state.polls.map(poll =>
      poll.id === pollId
        ? {
            ...poll,
            options: poll.options.map(option =>
              option.id === optionId
                ? { ...option, votes: [...option.votes, userId] }
                : { ...option, votes: option.votes.filter(id => id !== userId) }
            )
          }
        : poll
    )
  })),
  
  incrementUnread: (userId) => set((state) => ({
    users: state.users.map(user =>
      user.id === userId
        ? { ...user, unreadMessages: user.unreadMessages + 1 }
        : user
    )
  })),
  
  resetUnread: (userId) => set((state) => ({
    users: state.users.map(user =>
      user.id === userId
        ? { ...user, unreadMessages: 0 }
        : user
    )
  })),
}));