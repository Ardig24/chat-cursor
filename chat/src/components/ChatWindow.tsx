import React, { useState, useRef } from 'react';
import { User, Message, Project } from '../types';
import { Send, Paperclip, Camera, X, QrCode } from 'lucide-react';
import html2canvas from 'html2canvas';
import { MessageList } from './MessageList';
import { ProjectSelector } from './ProjectSelector';
import { VoiceRecorder } from './VoiceRecorder';
import { NotificationBell } from './NotificationBell';
import { ScreenshotCropper } from './ScreenshotCropper';
import { MobileUpload } from './MobileUpload';
import { QRCodeDialog } from './QRCodeDialog';

interface ChatWindowProps {
  user: User;
  currentUser: User;
  projects: Project[];
  messages: Message[];
  onClose: () => void;
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
}

export function ChatWindow({
  user,
  currentUser,
  projects,
  messages,
  onClose,
  onSendMessage,
}: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<'upload' | 'camera' | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage({
      senderId: currentUser.id,
      receiverId: user.id,
      content: message,
      type: 'text',
      projectId: selectedProject?.id,
      isRead: false,
      isDone: false,
      isEdited: false,
    });
    setMessage('');
  };

  const handleFileUpload = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        onSendMessage({
          senderId: currentUser.id,
          receiverId: user.id,
          content: file.name,
          type: 'file',
          fileUrl: e.target?.result as string,
          fileName: file.name,
          projectId: selectedProject?.id,
          isRead: false,
          isDone: false,
          isEdited: false,
        });
      };
      reader.readAsDataURL(file);
    });
    setActiveMenu(null);
  };

  const takeScreenshot = async () => {
    try {
      const canvas = await html2canvas(document.body);
      setScreenshotData(canvas.toDataURL('image/png'));
      setActiveMenu(null);
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  };

  const handleCroppedScreenshot = (croppedImage: string) => {
    onSendMessage({
      senderId: currentUser.id,
      receiverId: user.id,
      content: 'Screenshot',
      type: 'screenshot',
      fileUrl: croppedImage,
      fileName: 'screenshot.png',
      projectId: selectedProject?.id,
      isRead: false,
      isDone: false,
      isEdited: false,
    });
    setScreenshotData(null);
  };

  const handleVoiceMessage = async (audioBlob: Blob) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onSendMessage({
        senderId: currentUser.id,
        receiverId: user.id,
        content: 'Voice message',
        type: 'voice',
        fileUrl: e.target?.result as string,
        fileName: 'voice-message.webm',
        projectId: selectedProject?.id,
        isRead: false,
        isDone: false,
        isEdited: false,
      });
    };
    reader.readAsDataURL(audioBlob);
  };

  const takePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
    setActiveMenu(null);
  };

  // Generate a unique connection URL for QR code
  const connectionUrl = `${window.location.origin}/connect/${currentUser.id}-${Date.now()}`;

  const toggleMenu = (menu: 'upload' | 'camera') => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <>
      <div className="fixed inset-0 lg:inset-y-4 lg:right-4 lg:left-auto w-full lg:w-[32rem] bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <div className="flex items-center space-x-3">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="text-white font-medium">{user.name}</h3>
              <p className="text-zinc-400 text-sm capitalize">{user.status}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowQRCode(true)}
              className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white"
            >
              <QrCode className="w-5 h-5" />
            </button>
            <NotificationBell />
            <button onClick={onClose} className="text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-zinc-700">
          <ProjectSelector
            projects={projects}
            selectedProject={selectedProject}
            onSelect={setSelectedProject}
          />
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <MessageList
            messages={messages}
            currentUser={currentUser}
            selectedUser={user}
            selectedProject={selectedProject}
            projects={projects}
          />
        </div>

        {activeMenu === 'upload' && (
          <div className="p-4 border-t border-zinc-700">
            <MobileUpload onFileSelect={handleFileUpload} />
          </div>
        )}

        {activeMenu === 'camera' && (
          <div className="p-4 border-t border-zinc-700">
            <div className="space-y-2">
              <button
                onClick={takeScreenshot}
                className="w-full flex items-center space-x-2 p-3 text-white hover:bg-zinc-800 rounded-lg"
              >
                <Camera className="w-5 h-5" />
                <span>Take Screenshot</span>
              </button>
              <button
                onClick={takePhoto}
                className="w-full flex items-center space-x-2 p-3 text-white hover:bg-zinc-800 rounded-lg"
              >
                <Camera className="w-5 h-5" />
                <span>Take Photo</span>
              </button>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-zinc-700">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*,application/*"
              onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
              className="hidden"
            />
            <button
              onClick={() => toggleMenu('upload')}
              className={`p-3 rounded-lg hover:bg-zinc-700 ${
                activeMenu === 'upload' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleMenu('camera')}
              className={`p-3 rounded-lg hover:bg-zinc-700 ${
                activeMenu === 'camera' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Camera className="w-5 h-5" />
            </button>
            <VoiceRecorder onRecordingComplete={handleVoiceMessage} />
            <button
              onClick={handleSend}
              className="p-3 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-700"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {screenshotData && (
        <ScreenshotCropper
          screenshot={screenshotData}
          onComplete={handleCroppedScreenshot}
          onCancel={() => setScreenshotData(null)}
        />
      )}

      <QRCodeDialog
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
        connectionUrl={connectionUrl}
      />
    </>
  );
}