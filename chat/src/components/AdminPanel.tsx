import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';

export const AdminPanel: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'users' | 'projects'>('users');

    // User form state
    const [newUser, setNewUser] = useState({
        name: '',
        role: '',
        avatar: ''
    });

    // Project form state
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        status: 'active'
    });

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApi.createUser({
                id: crypto.randomUUID(),
                ...newUser
            });
            setNewUser({ name: '', role: '', avatar: '' });
            // You might want to refresh the users list here
        } catch (error) {
            console.error('Failed to create user:', error);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApi.createProject({
                id: crypto.randomUUID(),
                ...newProject
            });
            setNewProject({ name: '', description: '', status: 'active' });
            // You might want to refresh the projects list here
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                        Back to Chat
                    </button>
                </div>

                <div className="flex space-x-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500' : 'bg-gray-700'
                            } text-white`}
                        onClick={() => setActiveTab('users')}
                    >
                        Manage Users
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'projects' ? 'bg-blue-500' : 'bg-gray-700'
                            } text-white`}
                        onClick={() => setActiveTab('projects')}
                    >
                        Manage Projects
                    </button>
                </div>

                {activeTab === 'users' && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-white mb-4">Create New User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-white mb-2">Name</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Role</label>
                                <input
                                    type="text"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({
                                        ...newUser, role:
                                            e.target.value
                                    })}
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Avatar URL</label>
                                <input
                                    type="text"
                                    value={newUser.avatar}
                                    onChange={(e) => setNewUser({ ...newUser, avatar: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            >
                                Create User
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-white mb-4">Create New Project</h2>
                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <div>
                                <label className="block text-white mb-2">Project Name</label>
                                <input
                                    type="text"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Description</label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Status</label>
                                <select
                                    value={newProject.status}
                                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                >
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="on-hold">On Hold</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            >
                                Create Project
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
