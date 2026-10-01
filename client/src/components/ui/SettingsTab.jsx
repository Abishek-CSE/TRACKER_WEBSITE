import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SettingsTab = ({ user, setUser }) => {
  const [name, setName] = useState(user.name);
  
  // Calculate current day offset
  const startDate = new Date(user.winterArcStart || user.createdAt);
  const diffTime = Math.abs(new Date() - startDate);
  const currentCalculatedDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  
  const [dayOverride, setDayOverride] = useState(currentCalculatedDay);
  const [totalDays, setTotalDays] = useState(user.winterArcLength || 90);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Calculate what the start date SHOULD be based on the day they inputted
      const newStartDate = new Date();
      newStartDate.setDate(newStartDate.getDate() - (dayOverride - 1)); // if they want Day 1 today, we subtract 0 days
      
      const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
      const res = await axios.put('https://tracker-website-4t7p.onrender.com/api/auth/settings', {
        name,
        winterArcStart: newStartDate.toISOString(),
        winterArcLength: totalDays
      }, config);
      
      setUser(res.data);
      alert('Settings updated successfully! Your day has been adjusted.');
    } catch (err) {
      console.error(err);
      alert('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-1 flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-muted" /> 
          Settings
        </h2>
        <p className="text-muted text-sm">Configure your Winter Arc parameters.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <form onSubmit={handleSave} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Display Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Current Winter Arc Day Override</label>
            <p className="text-xs text-muted mb-3">
              Did you start your Winter Arc early, or forget to log in? Adjust your current day here. 
              We will retroactively calculate your start date for you.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-primary">Day</span>
              <input 
                type="number" 
                min="1"
                max={totalDays}
                value={dayOverride}
                onChange={(e) => setDayOverride(parseInt(e.target.value))}
                className="glass-input w-24 text-center text-xl font-bold text-white"
              />
              <span className="text-2xl font-bold text-muted">/</span>
              <input 
                type="number" 
                min="1"
                value={totalDays}
                onChange={(e) => setTotalDays(parseInt(e.target.value))}
                className="glass-input w-24 text-center text-xl font-bold text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <button 
              type="button" 
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="btn-primary py-2 px-6 flex items-center gap-2"
            >
              <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default SettingsTab;
