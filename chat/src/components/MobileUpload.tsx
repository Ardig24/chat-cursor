import React, { useRef, useState } from 'react';
import { Upload, Smartphone } from 'lucide-react';
import Compressor from 'compressorjs';

interface MobileUploadProps {
  onFileSelect: (files: File[]) => void;
}

export function MobileUpload({ onFileSelect }: MobileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = async (files: FileList) => {
    const processedFiles: File[] = [];
    
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        // Compress images before upload
        await new Promise<void>((resolve) => {
          new Compressor(file, {
            quality: 0.8,
            maxWidth: 1920,
            maxHeight: 1920,
            success: (compressedFile) => {
              processedFiles.push(compressedFile as File);
              resolve();
            },
            error: () => {
              processedFiles.push(file);
              resolve();
            },
          });
        });
      } else {
        processedFiles.push(file);
      }
    }
    
    onFileSelect(processedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div 
      className={`relative rounded-lg border-2 border-dashed transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-600'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,application/*"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />

      <div className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <Upload className="w-6 h-6 mb-2 text-blue-400" />
            <span className="text-sm font-medium text-white">Upload Files</span>
          </button>
        </div>

        <div className="flex items-center justify-center text-sm text-zinc-400">
          <Smartphone className="w-4 h-4 mr-2" />
          <span>Drag files or tap to upload</span>
        </div>
      </div>
    </div>
  );
}