import React, { useState } from 'react';
import { Task } from '../types';
import { useChatStore } from '../store';
import { CheckSquare, Square, Trash2, Calendar, ListTodo } from 'lucide-react';
import { format } from 'date-fns';

export function TodoList() {
  const { tasks, toggleTaskComplete, deleteTask } = useChatStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="bg-zinc-900 rounded-lg p-4 h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <ListTodo className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-white">Tasks</h2>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex-1 ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex-1 ${
              filter === 'active' 
                ? 'bg-blue-600 text-white' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex-1 ${
              filter === 'completed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            Done
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-zinc-800 p-3 rounded group hover:bg-zinc-750 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <button
                onClick={() => toggleTaskComplete(task.id)}
                className="text-zinc-400 hover:text-white transition-colors flex-shrink-0"
              >
                {task.completed ? (
                  <CheckSquare className="w-4 h-4 text-green-500" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <span className={`text-sm block truncate ${
                  task.completed ? 'line-through text-zinc-500' : 'text-white'
                }`}>
                  {task.title}
                </span>
                {task.dueDate && (
                  <div className="flex items-center text-zinc-400 text-xs mt-0.5">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(task.dueDate, 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity ml-3 flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <ListTodo className="w-8 h-8 text-zinc-700 mb-2" />
            <p className="text-zinc-500 text-sm">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}