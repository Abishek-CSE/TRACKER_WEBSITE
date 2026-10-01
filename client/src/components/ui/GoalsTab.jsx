import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import axios from 'axios';

const GoalsTab = ({ goals, setGoals }) => {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  
  // Get token for auth header
  const getConfig = () => ({
    headers: { 'x-auth-token': localStorage.getItem('token') }
  });

  // Add a new goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    
    const newGoalPayload = {
      title: newGoalTitle,
      progress: 0,
      deadline: '2027-01-01',
      tasks: [
        { title: 'My first task', completed: false }
      ]
    };

    try {
      const res = await axios.post('http://localhost:5000/api/goals', newGoalPayload, getConfig());
      setGoals([res.data, ...goals]);
      setNewGoalTitle('');
    } catch (err) {
      console.error(err);
      alert('Failed to add goal');
    }
  };

  // Remove a goal
  const handleRemoveGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/goals/${id}`, getConfig());
      setGoals(goals.filter(goal => goal._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete goal');
    }
  };

  // Toggle a task's completion status
  const toggleTask = async (goalId, taskId) => {
    const goalToUpdate = goals.find(g => g._id === goalId);
    
    const updatedTasks = goalToUpdate.tasks.map(task => 
      task._id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    // Calculate new progress percentage
    const completedCount = updatedTasks.filter(t => t.completed).length;
    const newProgress = Math.round((completedCount / updatedTasks.length) * 100) || 0;

    // Optimistic UI update
    setGoals(goals.map(goal => 
      goal._id === goalId ? { ...goal, tasks: updatedTasks, progress: newProgress } : goal
    ));

    // Backend sync
    try {
      await axios.put(`http://localhost:5000/api/goals/${goalId}`, {
        tasks: updatedTasks,
        progress: newProgress
      }, getConfig());
    } catch (err) {
      console.error(err);
      alert('Failed to sync progress');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <Target className="w-8 h-8 text-purple" /> 
            Your Goals
          </h2>
          <p className="text-muted text-sm">Set targets and crush them step by step.</p>
        </div>
      </div>

      {/* Add Goal Form */}
      <form onSubmit={handleAddGoal} className="glass-card p-4 flex gap-4">
        <input 
          type="text" 
          value={newGoalTitle}
          onChange={(e) => setNewGoalTitle(e.target.value)}
          placeholder="What do you want to achieve?" 
          className="glass-input flex-1"
        />
        <button type="submit" className="btn-primary py-2 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Goal
        </button>
      </form>

      {/* Goals List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnimatePresence>
          {goals.map((goal) => (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 flex flex-col relative overflow-hidden group"
            >
              {/* Progress Background Glow */}
              <div 
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary to-purple transition-all duration-500"
                style={{ width: `${goal.progress}%` }}
              ></div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{goal.title}</h3>
                  <p className="text-sm text-muted">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => handleRemoveGoal(goal._id)}
                  className="text-muted hover:text-red-400 transition-colors p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted">Progress</span>
                  <span className="font-bold text-primary">{goal.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-purple h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1">
                <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Tasks</h4>
                {goal.tasks.map((task) => (
                  <div 
                    key={task._id} 
                    onClick={() => toggleTask(goal._id, task._id)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 cursor-pointer transition-all"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted" />
                    )}
                    <span className={task.completed ? 'text-muted line-through decoration-muted/50' : 'text-text'}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GoalsTab;
