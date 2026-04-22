import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
      setError('Failed to fetch tasks');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, { title, description, status });
      } else {
        await api.post('/tasks', { title, description });
      }
      setTitle('');
      setDescription('');
      setStatus('pending');
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <div className="header">
        <h2>Task Dashboard {user.role === 'admin' ? '(Admin View)' : ''}</h2>
        <div className="flex items-center gap-4">
          <span>Welcome, <strong>{user.username}</strong></span>
          <button onClick={handleLogout} className="danger">Logout</button>
        </div>
      </div>
      
      <div className="container">
        {error && <div className="error-message">{error}</div>}
        
        <div className="card mb-4">
          <h3>{editingId ? 'Edit Task' : 'Create New Task'}</h3>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Task Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
            <textarea 
              placeholder="Task Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={3}
            />
            {editingId && (
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            )}
            <div className="flex gap-2">
              <button type="submit">{editingId ? 'Update Task' : 'Add Task'}</button>
              {editingId && (
                <button type="button" onClick={() => {
                  setEditingId(null);
                  setTitle('');
                  setDescription('');
                  setStatus('pending');
                }} className="danger">Cancel</button>
              )}
            </div>
          </form>
        </div>

        <h3>Your Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks found. Create one above!</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {tasks.map(task => (
              <div key={task.id} className="card">
                <div className="flex justify-between items-center mb-4">
                  <h4 style={{ margin: 0 }}>{task.title}</h4>
                  <span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>{task.description}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(task)} style={{ flex: 1, backgroundColor: 'var(--surface-hover)' }}>Edit</button>
                  <button onClick={() => handleDelete(task.id)} className="danger" style={{ flex: 1 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
