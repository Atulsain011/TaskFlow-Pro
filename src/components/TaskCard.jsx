import { motion, AnimatePresence } from 'framer-motion';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, Edit2, Check, GripVertical, Calendar, Bell, ListChecks, Tag, Circle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TaskCard = ({ task, index, updateTask, deleteTask, startEdit, isMini = false }) => {
  const { t } = useTranslation();

  if (!task || !task._id) {
    console.warn('TaskCard: Missing task or task._id', task);
    return null;
  }

  const handleToggle = () => {
    updateTask(task._id, { completed: !task.completed });
  };

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <Draggable draggableId={String(task._id)} index={index}>
      {(provided, snapshot) => (
        <motion.div
          layout
          {...provided.draggableProps}
          ref={provided.innerRef}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          whileHover={{ x: isMini ? 2 : 5 }}
          className={`group flex items-start gap-4 p-5 mb-4 rounded-2xl border transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
            snapshot.isDragging 
              ? 'bg-neon-green/10 border-neon-green shadow-[0_0_30px_rgba(57,255,20,0.2)] rotate-1 z-50' 
              : task.completed 
                ? 'bg-black/20 border-white/5 opacity-60' 
                : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08] shadow-lg'
          } ${isMini ? 'p-3 mb-2 gap-3' : 'p-5 mb-4 gap-4'}`}
        >
          {/* Priority Vertical Bar */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${
            task.priority === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
          }`} />

          <div {...provided.dragHandleProps} className="mt-1 text-white/20 hover:text-white/60 transition-colors cursor-grab active:cursor-grabbing">
            <GripVertical size={16} />
          </div>

          <button
            onClick={handleToggle}
            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
              task.completed
                ? 'bg-neon-green border-neon-green text-black shadow-neon rotate-[360deg]'
                : 'border-white/20 hover:border-neon-green group-hover:scale-110'
            }`}
          >
            {task.completed && <Check size={14} strokeWidth={3} />}
          </button>

          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`font-bold tracking-tight transition-all truncate ${
                task.completed ? 'line-through text-white/30' : 'text-white'
              } ${isMini ? 'text-sm' : 'text-lg'}`}>
                {task.title}
              </span>

              {/* Badges */}
              {!isMini && (
                <div className="flex gap-1.5">
                  {task.priority && (
                    <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                      task.priority === 'high' 
                        ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]' 
                        : task.priority === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {task.priority}
                    </span>
                  )}
                  {task.labels?.map((label, i) => (
                    <span key={i} className="text-[8px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 flex items-center gap-1">
                      <Tag size={8} />
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {!isMini && task.description && (
              <p className={`text-xs mb-3 transition-all line-clamp-2 ${
                task.completed ? 'opacity-30' : 'text-white/50'
              }`}>
                {task.description}
              </p>
            )}

            {/* Subtask Progress */}
            {totalSubtasks > 0 && (
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1 text-[8px] font-bold uppercase tracking-widest text-white/30">
                  <span className="flex items-center gap-1">
                    <ListChecks size={10} className="text-blue-400" />
                    Subtasks ({completedSubtasks}/{totalSubtasks})
                  </span>
                  <span>{Math.round(subtaskProgress)}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${subtaskProgress}%` }}
                    className="h-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.5)]"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              {task.dueDate && (
                <span className="text-[9px] text-white/30 flex items-center gap-1 font-mono">
                  <Calendar size={10} className="text-neon-green opacity-60" />
                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              )}
              {task.reminderTime && (
                <span className="text-[9px] text-yellow-400/60 flex items-center gap-1 font-mono animate-pulse">
                  <Bell size={10} />
                  {new Date(task.reminderTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>

          {!isMini && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
              <button
                onClick={() => startEdit(task)}
                className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="p-2 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </Draggable>
  );
};

export default TaskCard;
