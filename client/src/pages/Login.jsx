import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Snowfall from '../components/ui/Snowfall';
import axios from 'axios';
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://tracker-website-4t7p.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-text bg-background flex items-center justify-center">
      <div className="app-bg"></div>
      <div className="aurora-gradient"></div>
      <Snowfall />

      {/* Navbar Mock */}
      <nav className="absolute top-0 w-full p-6 z-50 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xl">❄</span>
          </div>
          <span className="text-xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-ice">
            Winter Arc
          </span>
        </Link>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10 px-4"
      >
        <div className="glass-card p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/30 rounded-full blur-[60px] pointer-events-none"></div>
          
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-muted mb-8 text-sm">Continue your Winter Arc journey.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted" />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="glass-input w-full pl-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted" />
              <input 
                type="password" 
                placeholder="Password" 
                className="glass-input w-full pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <a href="#" className="text-xs text-primary hover:text-ice transition-colors">Forgot Password?</a>
            </div>
            <button type="submit" className="btn-primary w-full flex justify-center items-center gap-2">
              Login <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Don't have an account? <Link to="/register" className="text-primary hover:text-white transition-colors">Start Your Arc</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
