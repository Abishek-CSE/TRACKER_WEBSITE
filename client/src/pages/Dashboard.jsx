import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Target, CalendarDays, BookOpen, Settings, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoalsTab from '../components/ui/GoalsTab';
import ProgressTab from '../components/ui/ProgressTab';
import SettingsTab from '../components/ui/SettingsTab';
import CalendarTab from '../components/ui/CalendarTab';

const FireParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen">
    {[...Array(25)].map((_, i) => {
      const size = Math.random() * 10 + 5;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-t from-violet-500 to-fuchsia-400 opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `-20px`,
            width: size,
            height: size,
            filter: 'blur(3px) drop-shadow(0 0 10px #A78BFA)'
          }}
          animate={{
            y: [0, -Math.random() * 600 - 200],
            x: [0, Math.random() * 100 - 50, Math.random() * 150 - 75],
            opacity: [0, 0.8, 0],
            scale: [1, Math.random() * 2 + 0.5, 0]
          }}
          transition={{
            duration: Math.random() * 4 + 2,
            repeat: Infinity,
            ease: "easeIn",
            delay: Math.random() * 3
          }}
        />
      );
    })}
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'progress', icon: TrendingUp, label: 'Progress' },
    { id: 'calendar', icon: CalendarDays, label: 'Calendar' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const config = { headers: { 'x-auth-token': token } };

    const fetchData = async () => {
      try {
        const userRes = await axios.get('http://localhost:5000/api/auth/me', config);
        const goalsRes = await axios.get('http://localhost:5000/api/goals', config);
        const journalRes = await axios.get('http://localhost:5000/api/journal', config);
        
        setUser(userRes.data);
        setGoals(goalsRes.data);
        setJournals(journalRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  if (loading || !user) {
    return <div className="flex h-screen bg-background items-center justify-center text-white"><p>Loading your Arc...</p></div>;
  }

  // Calculate day based on user creation or winterArcStart (fallback to Day 1)
  const startDate = new Date(user.winterArcStart || user.createdAt);
  const diffTime = Math.abs(new Date() - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const currentDay = diffDays > 0 ? diffDays : 1;
  const totalDays = user.winterArcLength || 90;

  // Calculate connected stats
  const avgCompletion = goals.length ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length) : 0;
  const goalsMet = goals.filter(g => g.progress === 100).length;
  
  // Real consecutive streak calculation based on App Logins / Opens
  const rawLoginDates = user.loginDates || [];
  const uniqueDates = [...new Set(rawLoginDates)].sort().reverse();
  let calculatedStreak = 0;
  
  if (uniqueDates.length > 0) {
    const todayStr = new Date().toISOString().split('T')[0];
    let currentDate = new Date(todayStr);

    if (uniqueDates.includes(todayStr)) {
      calculatedStreak = 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() - 1);
      if (uniqueDates.includes(currentDate.toISOString().split('T')[0])) {
        calculatedStreak = 1;
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }

    if (calculatedStreak > 0) {
      while (uniqueDates.includes(currentDate.toISOString().split('T')[0])) {
        calculatedStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }
  }

  const perfectDays = uniqueDates.length;
  const currentStreak = calculatedStreak;

  const stats = { avgCompletion, currentStreak, goalsMet, perfectDays };

  // Quick Add Goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    try {
      const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
      const res = await axios.post('http://localhost:5000/api/goals', {
        title: newGoalTitle,
        description: '',
        deadline: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        tasks: []
      }, config);
      setGoals([res.data, ...goals]);
      setNewGoalTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Remove Goal
  const handleRemoveGoal = async (id) => {
    try {
      const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
      await axios.delete(`http://localhost:5000/api/goals/${id}`, config);
      setGoals(goals.filter(goal => goal._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return <SettingsTab user={user} setUser={setUser} />;
      case 'goals':
        return <GoalsTab goals={goals} setGoals={setGoals} />;
      case 'progress':
        return <ProgressTab stats={stats} />;
      case 'calendar':
        return <CalendarTab />;
      case 'dashboard':
      default:
        return (
          <>
            <header className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-1">Good Evening, {user.name.split(' ')[0]}</h1>
                <p className="text-muted italic text-sm">"Discipline {'>'} Motivation"</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-primary uppercase tracking-widest mb-1 animate-pulse">Current Streak</p>
                  <motion.p 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-500 flex items-center justify-end gap-2"
                  >
                    {currentStreak} Days 
                    <span className="text-violet-400 inline-block animate-fire">🔥</span>
                  </motion.p>
                </div>
              </div>
            </header>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats Row */}
              <div className="lg:col-span-3 grid grid-cols-3 gap-4">
                {[
                  { label: 'Day', value: currentDay, sub: `/ ${totalDays}` },
                  { label: 'Goal', value: `${avgCompletion}%`, sub: 'Avg' },
                  { label: 'Streak', value: currentStreak.toString(), sub: 'Days' }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20, rotateX: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05, rotateX: 10, rotateY: 5, zIndex: 10, boxShadow: "0 25px 50px -12px rgba(167, 139, 250, 0.25)" }}
                    style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                    className="glass-card p-4 md:p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 border border-primary/20 bg-gradient-to-b from-card/80 to-card/95"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-full blur-2xl -mr-8 -mt-8 animate-pulse"></div>
                    <p className="text-primary text-xs md:text-sm font-bold uppercase tracking-widest mb-1 md:mb-2 translate-z-10">{stat.label}</p>
                    <div className="flex items-baseline gap-1 translate-z-20">
                      <h3 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]">{stat.value}</h3>
                      <span className="text-muted text-sm font-bold">{stat.sub}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Add Goals (Replaced Habits) */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ rotateY: 2, scale: 1.01 }}
                style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                className="lg:col-span-2 glass-card p-6 border border-primary/30 shadow-[0_0_30px_rgba(167,139,250,0.1)] relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl"></div>
                
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="font-extrabold text-xl flex items-center gap-3 drop-shadow-[0_0_10px_rgba(167,139,250,0.3)]">
                    <Target className="w-6 h-6 text-primary" /> Active Goals
                  </h3>
                  <span className="text-sm font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">{goals.length} Tracked</span>
                </div>
                
                <form onSubmit={handleAddGoal} className="mb-6 relative z-10 flex gap-2">
                  <input 
                    type="text"
                    placeholder="Forge a new goal..."
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="glass-input flex-1 border-primary/20 focus:border-primary focus:ring-primary/50 text-lg font-medium"
                  />
                  <button type="submit" className="btn-primary flex items-center justify-center p-3 rounded-xl">
                    <Plus className="w-6 h-6" />
                  </button>
                </form>

                <div className="space-y-3 relative z-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {goals.length === 0 ? (
                    <p className="text-muted text-center py-8 font-medium">No active goals. Set your trajectory.</p>
                  ) : (
                    goals.map((goal) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ x: 5, backgroundColor: 'rgba(167, 139, 250, 0.1)' }}
                        key={goal._id} 
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 group transition-all"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-3 h-3 rounded-full ${goal.progress === 100 ? 'bg-success shadow-[0_0_10px_#22c55e]' : 'bg-primary shadow-[0_0_10px_#a78bfa]'}`}></div>
                          <div>
                            <div className="flex items-center gap-3">
                              <p className={`font-bold text-lg ${goal.progress === 100 ? 'line-through text-muted' : 'text-white drop-shadow-md'}`}>
                                {goal.title}
                              </p>
                              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                {goal.progress}%
                              </span>
                            </div>
                            <div className="w-48 h-1.5 bg-background rounded-full mt-2 overflow-hidden border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                className="h-full bg-gradient-to-r from-primary to-purple-400"
                              />
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveGoal(goal._id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Weekly Progress Mini */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6 flex flex-col"
              >
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple" /> Weekly Focus
                </h3>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    {/* SVG Progress Ring Mock */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                      <motion.circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#A78BFA" 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0, 300" }}
                        animate={{ strokeDasharray: `${(avgCompletion / 100) * 282.7}, 300` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">{avgCompletion}%</span>
                      <span className="text-xs text-muted">Completion</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted">
                    {avgCompletion === 0 
                      ? "Ready to crush this week? Start forging goals!" 
                      : avgCompletion === 100 
                      ? "Unstoppable! You cleared the board." 
                      : "Keep the momentum going!"}
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden relative">
      <div className="app-bg"></div>
      <FireParticles />
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass-card border-l-0 border-t-0 border-b-0 rounded-none h-full z-10 relative">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple flex items-center justify-center shadow-[0_0_15px_rgba(96,165,250,0.4)]">
              <span className="text-xl">❄</span>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight tracking-wide">WINTER ARC</h2>
              <span className="text-xs text-primary font-medium tracking-wider uppercase">Day {currentDay} / {totalDays}</span>
            </div>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                  activeTab === item.id 
                    ? 'text-white' 
                    : 'text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-white/10 border border-white/20 rounded-xl z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 relative z-10 ${activeTab === item.id ? 'text-primary' : ''}`} />
                <span className="font-medium relative z-10">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-6">
          <div className="glass-card p-4 rounded-xl border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-white/20 flex items-center justify-center text-xl uppercase font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  On Track
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 z-10 scroll-smooth">
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full glass-card border-b-0 border-l-0 border-r-0 rounded-t-2xl z-50 p-2 px-6 pb-6">
        <div className="flex justify-between items-center">
          {[
            { id: 'dashboard', icon: LayoutDashboard },
            { id: 'goals', icon: Target },
            { id: 'progress', icon: TrendingUp },
            { id: 'settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-xl transition-all relative ${activeTab === item.id ? 'text-primary' : 'text-muted'}`}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="mobileTab" 
                  className="absolute inset-0 bg-primary/10 rounded-xl z-0"
                />
              )}
              <item.icon className="w-6 h-6 relative z-10" />
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
