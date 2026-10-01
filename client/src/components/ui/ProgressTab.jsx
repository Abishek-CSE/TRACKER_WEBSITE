import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Activity, Target, CalendarDays } from 'lucide-react';

const emptyWeeklyData = [
  { name: 'Mon', progress: 0 },
  { name: 'Tue', progress: 0 },
  { name: 'Wed', progress: 0 },
  { name: 'Thu', progress: 0 },
  { name: 'Fri', progress: 0 },
  { name: 'Sat', progress: 0 },
  { name: 'Sun', progress: 0 },
];

const emptyMonthlyData = [
  { name: 'Week 1', progress: 0 },
  { name: 'Week 2', progress: 0 },
  { name: 'Week 3', progress: 0 },
  { name: 'Week 4', progress: 0 },
];

const emptyYearlyData = [
  { name: 'Jan', progress: 0 },
  { name: 'Feb', progress: 0 },
  { name: 'Mar', progress: 0 },
  { name: 'Apr', progress: 0 },
  { name: 'May', progress: 0 },
  { name: 'Jun', progress: 0 },
  { name: 'Jul', progress: 0 },
  { name: 'Aug', progress: 0 },
  { name: 'Sep', progress: 0 },
  { name: 'Oct', progress: 0 },
  { name: 'Nov', progress: 0 },
  { name: 'Dec', progress: 0 },
];

const ProgressTab = ({ stats }) => {
  const [timeframe, setTimeframe] = useState('weekly');
  
  const { avgCompletion = 0, currentStreak = 0, goalsMet = 0, perfectDays = 0 } = stats || {};

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" /> 
            Analytics & Progress
          </h2>
          <p className="text-muted text-sm">Track your consistency across different timeframes.</p>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-md">
          {['daily', 'weekly', 'monthly', 'yearly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-300 ${
                timeframe === tf ? 'bg-primary/20 text-primary shadow-sm' : 'text-muted hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Completion', value: `${avgCompletion}%`, icon: Target, color: 'text-primary' },
          { label: 'Current Streak', value: `${currentStreak} Days`, icon: Activity, color: 'text-orange-400' },
          { label: 'Goals Met', value: goalsMet.toString(), icon: TrendingUp, color: 'text-purple' },
          { label: 'Perfect Days', value: perfectDays.toString(), icon: CalendarDays, color: 'text-success' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 min-h-[400px] flex flex-col relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        
        <h3 className="text-xl font-bold mb-6 capitalize">{timeframe} Performance</h3>
        
        <div className="flex-1 w-full h-[300px]">
          {timeframe === 'weekly' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emptyWeeklyData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="progress" fill="#60A5FA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {timeframe === 'monthly' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={emptyMonthlyData}>
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="progress" stroke="#818CF8" fillOpacity={1} fill="url(#colorProgress)" />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {timeframe === 'yearly' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emptyYearlyData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="progress" stroke="#BAE6FD" strokeWidth={3} dot={{ fill: '#0B1220', stroke: '#BAE6FD', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#BAE6FD' }} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {timeframe === 'daily' && (
            <div className="h-full flex items-center justify-center flex-col text-center">
              <div className="w-48 h-48 relative mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <motion.circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="#EF4444" 
                    strokeWidth="10" 
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0, 300" }}
                    animate={{ strokeDasharray: `${(avgCompletion / 100) * 282.7}, 300` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{avgCompletion}%</span>
                  <span className="text-sm text-muted">Today</span>
                </div>
              </div>
              <p className="text-muted">
                {avgCompletion === 0 
                  ? "No goals progressed today yet. Set your trajectory!" 
                  : avgCompletion === 100 
                  ? "Flawless victory today! Rest up." 
                  : "Keep pushing! You're making solid progress today."}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressTab;
