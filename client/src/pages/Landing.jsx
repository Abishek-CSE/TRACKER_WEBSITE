import { motion } from 'framer-motion';
import { ArrowRight, Activity, Calendar, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Snowfall from '../components/ui/Snowfall';

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden text-text bg-background">
      <div className="app-bg"></div>
      <div className="aurora-gradient"></div>
      <Snowfall />

      {/* Navbar Mock */}
      <nav className="absolute top-0 w-full p-6 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xl">❄</span>
          </div>
          <span className="text-xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-ice">
            Winter Arc
          </span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 text-sm font-medium hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg border border-white/10 transition-all">
            Join Arc
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-ice to-purple">WINTER ARC</span><br/>
            STARTS NOW.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl text-lg md:text-xl text-muted mb-10"
        >
          90 days. One mission. Become a better version of yourself.
          Embrace the cold, focus on your goals, and emerge transformed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/register" className="btn-primary flex items-center justify-center gap-2 group">
            Start Your Arc <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Feature Cards Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full px-4"
        >
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
              <Activity />
            </div>
            <h3 className="text-xl font-bold mb-2">Track Habits</h3>
            <p className="text-muted text-sm">Build discipline with daily tracking and streak maintenance.</p>
          </div>
          
          <div className="glass-card p-6 flex flex-col items-center text-center translate-y-0 md:-translate-y-8">
            <div className="w-12 h-12 bg-purple/20 rounded-full flex items-center justify-center mb-4 text-purple">
              <Trophy />
            </div>
            <h3 className="text-xl font-bold mb-2">Crush Goals</h3>
            <p className="text-muted text-sm">Set ambitious targets for the 90 days and monitor progress.</p>
          </div>

          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-ice/20 rounded-full flex items-center justify-center mb-4 text-ice">
              <Calendar />
            </div>
            <h3 className="text-xl font-bold mb-2">Daily Journal</h3>
            <p className="text-muted text-sm">Reflect on your wins, challenges, and plan for tomorrow.</p>
          </div>
        </motion.div>
      </main>

      {/* Cinematic elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-screen"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple/20 rounded-full blur-[120px] -z-10 mix-blend-screen"></div>
    </div>
  );
};

export default Landing;
