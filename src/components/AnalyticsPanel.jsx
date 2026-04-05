import { motion } from 'framer-motion';
import { Target, Zap, TrendingUp, CheckCircle, BarChart3, Clock, PieChart } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, colorClass, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-neon p-6 rounded-3xl border border-white/5 bg-black/20 flex items-center justify-between group hover:border-white/10 transition-all"
  >
    <div className="flex flex-col">
      <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mb-1">{label}</span>
      <span className="text-2xl font-bold text-white tracking-tighter">{value}</span>
    </div>
    <div className={`p-3 rounded-2xl bg-white/5 ${colorClass} group-hover:scale-110 transition-transform`}>
      <Icon size={20} />
    </div>
  </motion.div>
);

const ProgressCircle = ({ percentage, label, colorClass }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48" cy="48" r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          <motion.circle
            cx="48" cy="48" r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={colorClass}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white font-mono">{percentage}%</span>
        </div>
      </div>
      <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold text-center">{label}</span>
    </div>
  );
};

const AnalyticsPanel = ({ stats, tasks }) => {
  const total = stats?.totalTasks || 0;
  const completed = stats?.completedTasks || 0;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Calculate average priority
  const priorityMap = { high: 3, medium: 2, low: 1 };
  const avgPriority = tasks.length > 0 
    ? (tasks.reduce((sum, t) => sum + priorityMap[t.priority || 'medium'], 0) / tasks.length).toFixed(1) 
    : 0;

  const highPriorityTasks = tasks.filter(t => t.priority === 'high');
  const highPriorityDone = highPriorityTasks.length > 0
    ? Math.round((highPriorityTasks.filter(t => t.completed).length / highPriorityTasks.length) * 100)
    : 0;

  // Productivity score: weighted average of completion rate + high-priority completion
  const productivityScore = Math.min(100, Math.round((rate * 0.6) + (highPriorityDone * 0.4)));

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-neon-green/20 rounded-xl flex items-center justify-center shadow-neon">
          <BarChart3 className="text-neon-green" size={20} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-tight">System <span className="text-neon-green font-light">Analytics</span></h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1">Real-time Performance Metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Tasks" value={total} icon={Target} colorClass="text-blue-400" />
        <StatCard label="Completed" value={completed} icon={CheckCircle} colorClass="text-neon-green" delay={0.1} />
        <StatCard label="Pending" value={pending} icon={Clock} colorClass="text-yellow-400" delay={0.2} />
        <StatCard label="Productivity Score" value={`${productivityScore}%`} icon={TrendingUp} colorClass="text-purple-400" delay={0.3} />
      </div>

      <div className="glass-neon p-10 rounded-[2.5rem] border border-white/5 bg-black/30">
        <div className="flex flex-col md:flex-row items-center justify-around gap-12">
          <ProgressCircle percentage={rate} label="Completion Rate" colorClass="text-neon-green" />
          
          <div className="flex-grow max-w-sm space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Avg. Priority Level</span>
                <span className="text-xs text-blue-400 font-mono">{avgPriority} / 3.0</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(avgPriority / 3) * 100}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">High Priority Done</span>
                <span className="text-xs text-neon-green font-mono">{highPriorityDone}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${highPriorityDone}%` }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-neon-green shadow-neon"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5 flex items-center gap-3">
              <Zap size={14} className="text-yellow-400 animate-pulse" />
              <p className="text-[10px] text-white/30 italic uppercase tracking-wider">
                Productivity Score = 60% Completion Rate + 40% High Priority Done
              </p>
            </div>
          </div>

          <ProgressCircle percentage={productivityScore} label="Productivity Score" colorClass="text-purple-400" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
