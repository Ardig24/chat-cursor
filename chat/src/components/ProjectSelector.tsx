import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { FolderOpen, ChevronDown } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelect: (project: Project | null) => void;
}

export function ProjectSelector({ projects, selectedProject, onSelect }: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Set General as default project on component mount
  useEffect(() => {
    if (!selectedProject) {
      const generalProject = projects.find(p => p.id === 'general');
      if (generalProject) {
        onSelect(generalProject);
      }
    }
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button 
          className="flex items-center space-x-2 bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          <FolderOpen className="w-4 h-4 text-zinc-400" />
          <span>{selectedProject?.name || 'General'}</span>
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 rounded-lg shadow-xl w-64">
          <Dialog.Title className="sr-only">Select Project</Dialog.Title>
          <div className="p-1">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  onSelect(project);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded text-left ${
                  selectedProject?.id === project.id
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span>{project.name}</span>
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}