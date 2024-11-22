export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  unreadMessages: number;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignedTo: string[];
  dueDate?: number;
  projectId?: string;
  messageId?: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  endDate?: number;
  messageId: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string | 'all';
  content: string;
  timestamp: number;
  type: 'text' | 'file' | 'screenshot' | 'voice' | 'task' | 'poll';
  fileUrl?: string;
  fileName?: string;
  projectId?: string;
  isRead: boolean;
  isDone: boolean;
  isEdited: boolean;
  replyTo?: string;
  taskId?: string;
  pollId?: string;
}