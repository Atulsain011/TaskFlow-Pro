import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus, Search, Calendar, Zap, AlertCircle, Check, BarChart3, LayoutGrid, Sparkles, Clock, Bell, Wand2, Tag, History } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import PomodoroTimer from '../components/PomodoroTimer';
import Scheduler from '../components/Scheduler';
import AiAssistantModal from '../components/AiAssistantModal';
import AnalyticsPanel from '../components/AnalyticsPanel';
import ActivityLog from '../components/ActivityLog';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');
  const [isAdding, setIsAdding] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [activityLogs, setActivityLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tf_logs') || '[]'); } catch { return []; }
  });

  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium', 
    dueDate: '',
    labels: [],
    subtasks: [],
    reminderTime: ''
  });

  const API_URL = 'http://localhost:5000/api/tasks';
  
  const getConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${user?.token}` }
  }), [user?.token]);

  const addLog = useCallback((action, taskTitle) => {
    const entry = { id: Date.now(), action, taskTitle, timestamp: new Date().toISOString() };
    setActivityLogs(prev => {
      const updated = [entry, ...prev].slice(0, 100); // keep last 100
      localStorage.setItem('tf_logs', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(API_URL, getConfig());
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch ERROR:', err);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) fetchTasks();
  }, [user?.token]);

  const handleUpdate = useCallback(async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates, getConfig());
      setTasks(prev => prev.map(t => t._id === id ? res.data : t));
      if ('completed' in updates) {
        const task = tasks.find(t => t._id === id);
        addLog(updates.completed ? 'completed' : 'uncompleted', task?.title || 'Task');
      } else {
        const task = tasks.find(t => t._id === id);
        addLog('edited', task?.title || 'Task');
      }
    } catch (err) {
      console.error(err);
    }
  }, [tasks, user?.token]);

  const handleDelete = useCallback(async (id) => {
    const task = tasks.find(t => t._id === id);
    try {
      await axios.delete(`${API_URL}/${id}`, getConfig());
      setTasks(prev => prev.filter(t => t._id !== id));
      addLog('deleted', task?.title || 'Task');
    } catch (err) {
      console.error(err);
    }
  }, [tasks, user?.token]);

  const onDragEnd = useCallback(async (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
    try {
      await axios.put(`${API_URL}/reorder`, {
        tasks: items.map((item, index) => ({ id: item._id, order: index }))
      }, getConfig());
    } catch (err) {
      fetchTasks();
    }
  }, [tasks, user?.token]);

  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    try {
      if (editTask) {
        await handleUpdate(editTask._id, formData);
      } else {
        const res = await axios.post(API_URL, formData, getConfig());
        setTasks(prev => [res.data, ...prev]);
        addLog('created', formData.title);
      }
      resetForm();
    } catch (err) {
      console.error('Submit ERROR:', err);
    }
  }, [editTask, formData, user?.token]);

  const resetForm = () => {
    setFormData({ title: '', description: '', priority: 'medium', dueDate: '', labels: [], subtasks: [], reminderTime: '' });
    setIsAdding(false);
    setEditTask(null);
  };

  const handleAiApply = (aiData) => {
    setFormData({
      ...formData,
      title: aiData.improvedTitle || formData.title,
      dueDate: aiData.deadline || formData.dueDate,
      subtasks: aiData.subtasks.map(s => ({ title: s, completed: false }))
    });
    setIsAiOpen(false);
  };

  const filteredTasks = useMemo(() => tasks.filter(task => {
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'pending' && task.completed) return false;
    if (searchQuery && !task.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [tasks, filter, searchQuery]);

  const stats = useMemo(() => ({
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
  }), [tasks]);

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-8 flex flex-col gap-8 md:px-8">
      
      {/* SaaS Dashboard UI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-3 flex flex-col gap-6 sticky top-24">
          <PomodoroTimer />
          
          <div className="glass p-4 rounded-[2rem] border border-white/5 space-y-2">
            {[
              { id: 'tasks', label: 'Command Center', icon: LayoutGrid },
              { id: 'schedule', label: 'Timeline', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'log', label: 'Log File', icon: History }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm tracking-tight ${
                  activeTab === tab.id
                    ? 'bg-neon-green text-black shadow-neon'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'tasks' && (
              <motion.div 
                key="tasks-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Header Section */}
                <div className="glass p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-white/5">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 rounded-full blur-[100px] -z-10" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-neon-green mb-1">
                        <Sparkles size={14} className="animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono">{t('System')} ONLINE</span>
                      </div>
                      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-none">
                        Active <span className="text-white/40 font-light">Missions</span>
                      </h1>
                    </div>

                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 self-start">
                      {['all', 'pending', 'completed'].map(f => (
                        <button
                          key={f}
                          onClick={() => setFilter(f)}
                          className={`px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all ${
                            filter === f ? 'bg-neon-green text-black shadow-neon' : 'text-white/40 hover:text-white'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative group mb-8">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-green transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="SCAN DATA... [Ctrl+K]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl text-sm focus:border-neon-green/50 focus:outline-none transition-all placeholder:text-white/10 font-mono"
                    />
                  </div>

                  {/* Task Form */}
                  <AnimatePresence>
                    {(isAdding || editTask) ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <form onSubmit={handleFormSubmit} className="glass-neon p-8 rounded-[2rem] border-neon-green/20 space-y-6 bg-black/40 mb-8">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono font-bold text-neon-green uppercase tracking-widest">
                              {editTask ? '[RE-PROGRAMMING]' : '[INITIATING TASK]'}
                            </span>
                            <button 
                              type="button"
                              onClick={() => setIsAiOpen(true)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all font-bold text-[10px] uppercase tracking-widest"
                            >
                              <Wand2 size={14} /> Smart Suggest
                            </button>
                          </div>

                          <input 
                            type="text" 
                            placeholder="Enter task title..."
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className="w-full bg-black/60 border border-white/5 p-5 rounded-2xl text-xl font-bold text-white focus:border-neon-green outline-none transition-all placeholder:text-white/10"
                            autoFocus
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
                                <Tag size={12} /> Labels
                              </label>
                              <input 
                                type="text"
                                placeholder="work, urgent, personal..."
                                onChange={e => setFormData({...formData, labels: e.target.value.split(',').map(l => l.trim())})}
                                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-xs focus:border-neon-green outline-none text-white/80"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
                                <Clock size={12} /> Schedule
                              </label>
                              <input 
                                type="date"
                                value={formData.dueDate}
                                onChange={e => setFormData({...formData, dueDate: e.target.value})}
                                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-xs focus:border-neon-green outline-none text-white/80"
                              />
                            </div>
                          </div>

                          <div className="flex gap-4 pt-4">
                            <button type="submit" className="btn-neon flex-grow py-5 text-lg shadow-neon group">
                              EXECUTE <span className="ml-2 font-bold">»</span>
                            </button>
                            <button 
                              type="button" 
                              onClick={resetForm}
                              className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/5 transition-all text-sm uppercase tracking-widest"
                            >
                              Abort
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    ) : (
                      <button 
                        onClick={() => setIsAdding(true)}
                        className="w-full h-24 border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center gap-4 hover:border-neon-green/50 hover:bg-neon-green/5 transition-all group overflow-hidden relative"
                      >
                        <div className="flex items-center gap-4 group-hover:scale-105 transition-transform z-10">
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-neon-green group-hover:text-black transition-all shadow-lg border border-white/5">
                            <Plus size={24} />
                          </div>
                          <span className="text-xl font-bold text-white/20 group-hover:text-white transition-colors tracking-tight">Deploy New Task Component</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                      </button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Task List */}
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="tasks">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 min-h-[400px]">
                        <AnimatePresence>
                          {filteredTasks.length === 0 ? (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="py-20 flex flex-col items-center gap-4 opacity-20"
                            >
                              <LayoutGrid size={48} strokeWidth={1} />
                              <span className="text-xs font-mono uppercase tracking-[0.5em]">No data records found</span>
                            </motion.div>
                          ) : (
                            filteredTasks.map((task, idx) => (
                              <TaskCard 
                                key={task._id} 
                                task={task} 
                                index={idx} 
                                updateTask={handleUpdate} 
                                deleteTask={handleDelete}
                                startEdit={(t) => {
                                  setEditTask(t);
                                  setFormData({
                                    title: t.title,
                                    description: t.description || '',
                                    priority: t.priority || 'medium',
                                    dueDate: t.dueDate ? t.dueDate.substring(0, 10) : '',
                                    labels: t.labels || [],
                                    subtasks: t.subtasks || [],
                                    reminderTime: t.reminderTime ? t.reminderTime.substring(0, 16) : ''
                                  });
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                              />
                            ))
                          )}
                        </AnimatePresence>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <motion.div 
                key="schedule-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass p-8 md:p-12 rounded-[3rem] border-white/5"
              >
                <Scheduler 
                  tasks={tasks} 
                  updateTask={handleUpdate} 
                  deleteTask={handleDelete} 
                  startEdit={(t) => {
                    setEditTask(t);
                    setActiveTab('tasks');
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div 
                key="analytics-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass p-8 md:p-12 rounded-[3rem] border-white/5"
              >
                <AnalyticsPanel stats={stats} tasks={tasks} />
              </motion.div>
            )}

            {activeTab === 'log' && (
              <motion.div
                key="log-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass p-8 md:p-12 rounded-[3rem] border-white/5"
              >
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => {
                      setActivityLogs([]);
                      localStorage.removeItem('tf_logs');
                    }}
                    className="text-[10px] uppercase tracking-widest text-red-400/50 hover:text-red-400 border border-red-400/10 hover:border-red-400/30 px-4 py-2 rounded-xl transition-all"
                  >
                    Clear Log
                  </button>
                </div>
                <ActivityLog logs={activityLogs} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        taskTitle={formData.title}
        onApply={handleAiApply}
      />
    </div>
  );
};

export default Dashboard;
