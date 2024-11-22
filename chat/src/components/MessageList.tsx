import React, { useState } from 'react';
import { Message, User, Project, Task } from '../types';
import { FileText, Image } from 'lucide-react';
import { MessageContextMenu } from './MessageContextMenu';
import { CalendarEventDialog } from './CalendarEventDialog';
import { useChatStore } from '../store';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface MessageListProps {
  messages: Message[];
  currentUser: User;
  selectedUser: User;
  selectedProject: Project | null;
  projects: Project[];
}

export function MessageList({
  messages,
  currentUser,
  selectedUser,
  selectedProject,
  projects,
}: MessageListProps) {
  const { 
    editMessage, 
    deleteMessage, 
    toggleMessageStatus,
    addTask,
    addMessage
  } = useChatStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filteredMessages = messages.filter(
    (msg) =>
      ((msg.senderId === currentUser.id && msg.receiverId === selectedUser.id) ||
        (msg.senderId === selectedUser.id && msg.receiverId === currentUser.id)) &&
      (!selectedProject || msg.projectId === selectedProject.id)
  );

  const handleEdit = (message: Message) => {
    setEditingId(message.id);
    setEditContent(message.content);
  };

  const saveEdit = () => {
    if (editingId && editContent.trim()) {
      editMessage(editingId, editContent);
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleAddToTodo = (message: Message) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title: message.content,
      completed: false,
      assignedTo: [currentUser.id],
      messageId: message.id,
      projectId: message.projectId,
    };
    addTask(task);
  };

  const handleCreateEvent = (message: Message) => {
    setSelectedMessage(message);
    setShowCalendarDialog(true);
  };

  const handleSendToAll = (message: Message) => {
    addMessage({
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      receiverId: 'all',
      senderId: currentUser.id,
    });
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="space-y-4">
        {filteredMessages.map((message) => {
          const isCurrentUser = message.senderId === currentUser.id;
          const project = message.projectId
            ? projects.find((p) => p.id === message.projectId)
            : null;

          return (
            <MessageContextMenu
              key={message.id}
              message={message}
              isCurrentUser={isCurrentUser}
              onEdit={() => handleEdit(message)}
              onDelete={() => deleteMessage(message.id)}
              onToggleRead={() => toggleMessageStatus(message.id, 'read')}
              onToggleDone={() => toggleMessageStatus(message.id, 'done')}
              onReply={() => {}}
              onAddToTodo={() => handleAddToTodo(message)}
              onSendToAll={() => handleSendToAll(message)}
              onCreateEvent={() => handleCreateEvent(message)}
            >
              <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`relative max-w-[80%] ${
                    isCurrentUser ? 'bg-blue-600' : 'bg-zinc-700'
                  } rounded-lg p-3 group`}
                >
                  {project && (
                    <div
                      className="text-xs mb-1 px-2 py-0.5 rounded inline-block"
                      style={{ backgroundColor: project.color + '40' }}
                    >
                      {project.name}
                    </div>
                  )}

                  {message.replyTo && (
                    <div className="text-xs text-zinc-400 mb-1">
                      Replying to a message
                    </div>
                  )}

                  {editingId === message.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        className="flex-1 bg-zinc-800 text-white rounded px-2 py-1"
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="text-xs text-zinc-300 hover:text-white"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      {message.type === 'text' && (
                        <p className="text-white">{message.content}</p>
                      )}

                      {message.type === 'file' && message.fileUrl && (
                        <div
                          onClick={() => downloadFile(message.fileUrl!, message.fileName!)}
                          className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
                        >
                          <FileText className="w-4 h-4 text-white" />
                          <span className="text-white underline">
                            {message.fileName}
                          </span>
                        </div>
                      )}

                      {message.type === 'screenshot' && message.fileUrl && (
                        <div
                          onClick={() => downloadFile(message.fileUrl!, message.fileName!)}
                          className="cursor-pointer hover:opacity-80"
                        >
                          <Image className="w-4 h-4 text-white mb-1" />
                          <img
                            src={message.fileUrl}
                            alt="Screenshot"
                            className="max-w-full rounded"
                          />
                        </div>
                      )}

                      {message.type === 'voice' && message.fileUrl && (
                        <div className="w-48">
                          <AudioPlayer
                            src={message.fileUrl}
                            showJumpControls={false}
                            customControlsSection={['MAIN_CONTROLS']}
                            customProgressBarSection={['PROGRESS_BAR']}
                            className="rounded"
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="text-xs text-zinc-300 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                    {message.isEdited && (
                      <span className="ml-1 text-zinc-400">(edited)</span>
                    )}
                  </div>
                </div>
              </div>
            </MessageContextMenu>
          );
        })}
      </div>

      {showCalendarDialog && selectedMessage && (
        <CalendarEventDialog
          isOpen={showCalendarDialog}
          onClose={() => {
            setShowCalendarDialog(false);
            setSelectedMessage(null);
          }}
          messageContent={selectedMessage.content}
          attendees={[selectedUser.id]}
        />
      )}
    </>
  );
}