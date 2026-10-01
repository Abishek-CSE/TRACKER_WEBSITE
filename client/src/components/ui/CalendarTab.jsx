import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight, Edit3, X, Save } from 'lucide-react';
import axios from 'axios';

const CalendarTab = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [entries, setEntries] = useState({});
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
        const res = await axios.get('http://localhost:5000/api/journal', config);
        
        // Convert array to object map { 'YYYY-MM-DD': entryObject }
        const entriesMap = {};
        res.data.forEach(entry => {
          entriesMap[entry.date] = entry;
        });
        setEntries(entriesMap);
      } catch (err) {
        console.error("Failed to fetch calendar notes");
      }
    };
    fetchEntries();
  }, []);

  const handleDayClick = (day) => {
    const dateStr = formatDate(day);
    setSelectedDate(dateStr);
    setNoteContent(entries[dateStr]?.content || '');
  };

  const saveNote = async () => {
    setIsSaving(true);
    try {
      const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
      const res = await axios.post('http://localhost:5000/api/journal', {
        date: selectedDate,
        content: noteContent
      }, config);
      
      setEntries(prev => ({
        ...prev,
        [selectedDate]: res.data
      }));
      setSelectedDate(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  // Calendar logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  // Generate calendar grid
  const renderCalendar = () => {
    const blanks = Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }, (_, i) => (
      <div key={`blank-${i}`} className="p-2 md:p-4 aspect-square"></div>
    ));

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
      const dateStr = formatDate(dateObj);
      const hasNote = !!entries[dateStr]?.content;
      const isToday = formatDate(new Date()) === dateStr;

      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          key={dayNum}
          onClick={() => handleDayClick(dateObj)}
          className={`relative p-2 md:p-4 aspect-square rounded-xl border flex flex-col items-center justify-center transition-all ${
            isToday ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10 hover:border-primary/50'
          }`}
        >
          <span className={`text-lg md:text-xl font-bold ${isToday ? 'text-primary' : 'text-text'}`}>
            {dayNum}
          </span>
          {hasNote && (
            <span className="absolute bottom-2 w-2 h-2 rounded-full bg-purple shadow-[0_0_8px_rgba(129,140,248,0.8)]"></span>
          )}
        </motion.button>
      );
    });

    return [...blanks, ...days];
  };

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-primary" /> 
            Calendar & Notes
          </h2>
          <p className="text-muted text-sm">Select any day of the year to log your thoughts.</p>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={prevMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h3 className="text-2xl font-bold tracking-wider">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-sm font-semibold text-muted uppercase tracking-wider">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {renderCalendar()}
        </div>
      </div>

      {/* Note Editor Modal */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-lg p-6 relative"
            >
              <button 
                onClick={() => setSelectedDate(null)}
                className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-purple" />
                Daily Note
              </h3>
              <p className="text-muted text-sm mb-6">{new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

              <textarea 
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="How did today go? What are you grateful for? Any challenges?"
                className="glass-input w-full h-48 p-4 resize-none mb-4"
              />

              <div className="flex justify-end gap-3">
                <button onClick={() => setSelectedDate(null)} className="px-5 py-2 rounded-xl text-muted hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={saveNote} disabled={isSaving} className="btn-primary py-2 px-6 flex items-center gap-2">
                  <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarTab;
