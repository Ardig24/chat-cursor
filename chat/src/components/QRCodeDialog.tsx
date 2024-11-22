import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';

interface QRCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  connectionUrl: string;
}

export function QRCodeDialog({ isOpen, onClose, connectionUrl }: QRCodeDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 rounded-lg p-6 shadow-xl w-[90vw] max-w-md">
          <Dialog.Title className="text-xl font-semibold text-white mb-4">
            Connect Your Phone
          </Dialog.Title>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={connectionUrl}
                size={200}
                level="H"
                includeMargin
              />
            </div>
            <p className="text-zinc-400 text-center text-sm">
              Scan this QR code with your phone's camera to connect instantly
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}