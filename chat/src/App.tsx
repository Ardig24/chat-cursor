import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCard } from './components/UserCard';
import { ChatWindow } from './components/ChatWindow';
import { TodoList } from './components/TodoList';
import { useChatStore } from './store';
import { Message } from './types';
import { Users } from 'lucide-react';

function App() {
  const navigate = useNavigate();

  const {
    currentUser,
    users,
    projects,
    messages,
    selectedUser,
    setSelectedUser,
    addMessage
  } = useChatStore();

  const handleSendMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    addMessage({
      ...messageData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Users className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Workplace Chat</h1>
          <button
            onClick={() => navigate('/admin')}
            className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Admin Panel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <UserCard
                key={currentUser.id}
                user={currentUser}
                onClick={setSelectedUser}
              />
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onClick={setSelectedUser}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <TodoList />
          </div>
        </div>

        {selectedUser && (
          <ChatWindow
            user={selectedUser}
            currentUser={currentUser}
            projects={projects}
            messages={messages}
            onClose={() => setSelectedUser(null)}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
}

export default App;