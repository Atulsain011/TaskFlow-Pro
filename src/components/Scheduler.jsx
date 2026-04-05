import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronRight, AlertCircle, CheckCircle2, LayoutGrid, List, Inbox } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// A lightweight read-only task row for the scheduler (no drag-drop needed)
const SchedulerTaskRow = ({ task, updateTask, deleteTask, startEdit }) => {
  const priorityColors = {
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };
  const priorityBar = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all backdrop-blur-xl overflow-hidden ${
        task.completed
          ? 'bg-black/20 border-white/5 opacity-50'
          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
      }`}
    >
      {/* Priority bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${priorityBar[task.priority || 'medium']}`} />

      {/* Checkbox */}
      <button
        onClick={() => updateTask(task._id, { completed: !task.completed })}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          task.completed
            ? 'bg-neon-green border-neon-green text-black'
            : 'border-white/20 hover:border-neon-green'
        }`}
      >
        {task.completed && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      {/* Title & meta */}
      <div className="flex-grow min-w-0">
        <p className={`text-sm font-bold truncate ${task.completed ? 'line-through text-white/30' : 'text-white'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {task.priority && (
            <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded border ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          )}
          {task.labels?.filter(Boolean).map((label, i) => (
            <span key={i} className="text-[8px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/40">
              {label}
            </span>
          ))}
          {task.dueDate && (
            <span className="text-[9px] text-white/30 font-mono">
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={() => startEdit(task)}
          className="p-1.5 text-white/30 hover:text-white hover:bg-white/10 rounded-lg transition-all text-xs"
        >
          ✏️
        </button>
        <button
          onClick={() => deleteTask(task._id)}
          className="p-1.5 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all text-xs"
        >
          🗑️
        </button>
      </div>
    </motion.div>
  );
};

const Scheduler = ({ tasks, updateTask, deleteTask, startEdit }) => {
  const { t } = useTranslation();
  const [view, setView] = useState('grouped');

  const scheduledTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const groups = { overdue: [], today: [], tomorrow: [], upcoming: [], unscheduled: [] };

    (tasks || []).forEach(task => {
      if (!task.dueDate) {
        groups.unscheduled.push(task);
        return;
      }
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate < today && !task.completed) {
        groups.overdue.push(task);
      } else if (taskDate.getTime() === today.getTime()) {
        groups.today.push(task);
      } else if (taskDate.getTime() === tomorrow.getTime()) {
        groups.tomorrow.push(task);
      } else if (taskDate >= dayAfterTomorrow) {
        groups.upcoming.push(task);
      } else {
        groups.unscheduled.push(task);
      }
    });

    return groups;
  }, [tasks]);

  // For timeline view: all tasks with dates sorted by date
  const timelineTasks = useMemo(() => {
    return (tasks || [])
      .filter(t => t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [tasks]);

  const sections = [
    { key: 'overdue', title: t('Overdue'), icon: AlertCircle, color: 'text-red-400', dot: 'bg-red-500' },
    { key: 'today', title: t('Today'), icon: Clock, color: 'text-neon-green', dot: 'bg-neon-green' },
    { key: 'tomorrow', title: t('Tomorrow'), icon: Calendar, color: 'text-blue-400', dot: 'bg-blue-400' },
    { key: 'upcoming', title: t('Upcoming'), icon: ChevronRight, color: 'text-purple-400', dot: 'bg-purple-400' },
    { key: 'unscheduled', title: t('Unscheduled'), icon: Inbox, color: 'text-white/30', dot: 'bg-white/20' },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('Smart')} <span className="text-neon-green font-light">{t('Scheduler')}</span>
          </h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-medium mt-1">
            {t('Timeline & Roadmap')}
          </p>
        </div>

        <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
          <button
            onClick={() => setView('grouped')}
            className={`p-2 rounded-lg transition-all ${view === 'grouped' ? 'bg-neon-green text-black shadow-neon' : 'text-white/40 hover:text-white'}`}
            title="Grouped View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView('timeline')}
            className={`p-2 rounded-lg transition-all ${view === 'timeline' ? 'bg-neon-green text-black shadow-neon' : 'text-white/40 hover:text-white'}`}
            title="Timeline View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── GROUPED VIEW ── */}
        {view === 'grouped' && (
          <motion.div
            key="grouped"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            {sections.map(({ key, title, icon: Icon, color, dot }) => {
              const sectionTasks = scheduledTasks[key] || [];
              return (
                <div key={key}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                      <Icon size={16} />
                    </div>
                    <h3 className={`text-xs font-bold uppercase tracking-[0.2em] ${color}`}>{title}</h3>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-white/40 font-mono">
                      {sectionTasks.length}
                    </span>
                  </div>

                  {sectionTasks.length === 0 ? (
                    <p className="text-[10px] text-white/15 uppercase tracking-widest pl-12">
                      {t('No tasks scheduled')}
                    </p>
                  ) : (
                    <div className="space-y-3 pl-2 border-l-2 border-white/5 ml-4">
                      {sectionTasks.map(task => (
                        <SchedulerTaskRow
                          key={task._id}
                          task={task}
                          updateTask={updateTask}
                          deleteTask={deleteTask}
                          startEdit={startEdit}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ── TIMELINE VIEW ── */}
        {view === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {timelineTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-20 gap-4">
                <Calendar size={48} strokeWidth={1} />
                <p className="text-xs font-mono uppercase tracking-[0.4em]">{t('No scheduled tasks')}</p>
              </div>
            ) : (
              <div className="relative pl-6 border-l-2 border-white/10 space-y-6">
                {timelineTasks.map((task, i) => {
                  const date = new Date(task.dueDate);
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative"
                    >
                      {/* Timeline dot */}
                      <div className={`absolute -left-[29px] top-4 w-3.5 h-3.5 rounded-full border-2 border-black ${
                        isToday ? 'bg-neon-green shadow-neon' : task.completed ? 'bg-white/20' : 'bg-blue-400'
                      }`} />

                      {/* Date label */}
                      <p className={`text-[9px] font-mono font-bold uppercase tracking-widest mb-2 ${
                        isToday ? 'text-neon-green' : 'text-white/30'
                      }`}>
                        {isToday ? `⚡ ${t('Today')}` : date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>

                      <SchedulerTaskRow
                        task={task}
                        updateTask={updateTask}
                        deleteTask={deleteTask}
                        startEdit={startEdit}
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scheduler;
