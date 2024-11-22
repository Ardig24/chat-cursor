import React, { useState, useRef } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface ScreenshotCropperProps {
  screenshot: string;
  onComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export function ScreenshotCropper({ screenshot, onComplete, onCancel }: ScreenshotCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const imgRef = useRef<HTMLImageElement>(null);

  const getCroppedImg = () => {
    if (!imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    canvas.width = crop.width! * scaleX;
    canvas.height = crop.height! * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width! * scaleX,
      crop.height! * scaleY
    );

    onComplete(canvas.toDataURL('image/png'));
  };

  return (
    <Dialog.Root open={true} onOpenChange={onCancel}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75" />
        <Dialog.Content className="fixed inset-10 bg-zinc-900 rounded-lg p-4 overflow-hidden flex flex-col">
          <Dialog.Title className="text-lg font-medium text-white mb-4">
            Crop Screenshot
          </Dialog.Title>
          
          <div className="flex-1 overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={screenshot}
                alt="Screenshot to crop"
                className="max-w-full"
              />
            </ReactCrop>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={getCroppedImg}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-500 rounded"
            >
              Send Screenshot
            </button>
          </div>

          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}