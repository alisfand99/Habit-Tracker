import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Bell, Trash2, Edit2, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import NotificationConfigDrawer from './NotificationConfigDrawer';

const CATEGORIES = ['General', 'Health', 'Fitness', 'Learning', 'Work', 'Personal', 'Social'];

const HabitManagerModal = ({ 
  isOpen, 
  onClose, 
  habits, 
  onAdd, 
  onUpdate, 
  onDelete, 
  updateNotificationSettings,
  darkMode 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedHabitForNotification, setSelectedHabitForNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    emoji: '✨',
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setShowAddForm(false);
      setEditingHabit(null);
      setSelectedHabitForNotification(null);
      setFormData({ name: '', category: 'General', emoji: '✨' });
      setShowEmojiPicker(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingHabit) {
      setFormData({
        name: editingHabit.name,
        category: editingHabit.category || 'General',
        emoji: editingHabit.emoji || '✨',
      });
    }
  }, [editingHabit]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        emojiButtonRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [showEmojiPicker]);

  const handleAddSubmit = () => {
    if (formData.name.trim()) {
      onAdd(formData);
      setFormData({ name: '', category: 'General', emoji: '✨' });
      setShowAddForm(false);
      setShowEmojiPicker(false);
    }
  };

  const handleEditSubmit = () => {
    if (formData.name.trim() && editingHabit) {
      onUpdate(editingHabit.id, formData);
      setEditingHabit(null);
      setFormData({ name: '', category: 'General', emoji: '✨' });
      setShowEmojiPicker(false);
    }
  };

  const handleDelete = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      onDelete(habitId);
    }
  };

  const handleEmojiSelect = (emojiData) => {
    setFormData({ ...formData, emoji: emojiData.emoji });
    setShowEmojiPicker(false);
  };

  const getSettingsSummary = (habit) => {
    if (!habit.notificationSettings || !habit.notificationSettings.enabled) {
      return 'No notifications';
    }
    const { days, times } = habit.notificationSettings;
    if (!days || days.length === 0 || !times || times.length === 0) {
      return 'Not configured';
    }
    const dayCount = days.length === 7 ? 'Daily' : `${days.length} days`;
    const timeCount = times.length === 1 ? times[0] : `${times.length} times`;
    return `${dayCount} at ${timeCount}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 ${darkMode ? 'bg-slate-900/95' : 'bg-slate-50/95'} backdrop-blur-xl z-50`}
          />

          {/* Main Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed inset-0 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'} z-50 flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className={`flex-shrink-0 flex items-center justify-between p-4 border-b ${
              darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
            }`} style={{ paddingTop: `max(16px, calc(env(safe-area-inset-top) + 16px))` }}>
              <h2 className={`text-lg font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Manage Habits
              </h2>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-full ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                } transition-colors`}
                aria-label="Close"
              >
                <X className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain pb-20">
              <div className="p-4 space-y-4">
                {/* Add New Habit Form */}
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-xl border-2 ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Create New Habit
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Habit name"
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          darkMode
                            ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400'
                            : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
                        } focus:outline-none focus:border-indigo-500`}
                        autoFocus
                      />
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          darkMode
                            ? 'bg-slate-700 border-slate-600 text-slate-200'
                            : 'bg-white border-slate-300 text-slate-800'
                        } focus:outline-none focus:border-indigo-500`}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="relative">
                        <button
                          ref={emojiButtonRef}
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className={`w-full px-3 py-2 rounded-lg border flex items-center justify-between ${
                            darkMode
                              ? 'bg-slate-700 border-slate-600 text-slate-200'
                              : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        >
                          <span className="text-xl">{formData.emoji}</span>
                          <Smile className="w-4 h-4" />
                        </button>
                        {showEmojiPicker && (
                          <div ref={emojiPickerRef} className="absolute z-10 mt-2">
                            <EmojiPicker
                              onEmojiClick={handleEmojiSelect}
                              theme={darkMode ? 'dark' : 'light'}
                              className={darkMode ? 'epr-dark' : ''}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowAddForm(false);
                            setFormData({ name: '', category: 'General', emoji: '✨' });
                          }}
                          className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                            darkMode
                              ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                              : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                          } transition-colors`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddSubmit}
                          className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Create
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Add Button (when form is hidden) */}
                {!showAddForm && !editingHabit && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setShowAddForm(true)}
                    className={`w-full p-4 rounded-xl border-2 ${
                      darkMode
                        ? 'bg-slate-800 border-slate-700 hover:border-indigo-600'
                        : 'bg-white border-slate-200 hover:border-indigo-300'
                    } transition-all flex items-center justify-center gap-2`}
                  >
                    <Plus className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Add New Habit
                    </span>
                  </motion.button>
                )}

                {/* Edit Form */}
                {editingHabit && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-xl border-2 ${
                      darkMode ? 'bg-slate-800 border-indigo-700' : 'bg-white border-indigo-300'
                    }`}
                  >
                    <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Edit Habit
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          darkMode
                            ? 'bg-slate-700 border-slate-600 text-slate-200'
                            : 'bg-white border-slate-300 text-slate-800'
                        } focus:outline-none focus:border-indigo-500`}
                        autoFocus
                      />
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          darkMode
                            ? 'bg-slate-700 border-slate-600 text-slate-200'
                            : 'bg-white border-slate-300 text-slate-800'
                        } focus:outline-none focus:border-indigo-500`}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="relative">
                        <button
                          ref={emojiButtonRef}
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className={`w-full px-3 py-2 rounded-lg border flex items-center justify-between ${
                            darkMode
                              ? 'bg-slate-700 border-slate-600 text-slate-200'
                              : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        >
                          <span className="text-xl">{formData.emoji}</span>
                          <Smile className="w-4 h-4" />
                        </button>
                        {showEmojiPicker && (
                          <div ref={emojiPickerRef} className="absolute z-10 mt-2">
                            <EmojiPicker
                              onEmojiClick={handleEmojiSelect}
                              theme={darkMode ? 'dark' : 'light'}
                              className={darkMode ? 'epr-dark' : ''}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingHabit(null);
                            setFormData({ name: '', category: 'General', emoji: '✨' });
                          }}
                          className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                            darkMode
                              ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                              : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                          } transition-colors`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleEditSubmit}
                          className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Habits List */}
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    Your Habits ({habits.length})
                  </h3>
                  {habits.length === 0 ? (
                    <div className={`text-center py-8 rounded-xl ${
                      darkMode ? 'bg-slate-800' : 'bg-white'
                    }`}>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        No habits yet. Create your first one!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {habits.map((habit) => (
                        <motion.div
                          key={habit.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg border ${
                            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl flex-shrink-0">{habit.emoji}</span>
                            <div 
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => setEditingHabit(habit)}
                            >
                              <h4 className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                {habit.name}
                              </h4>
                              <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {getSettingsSummary(habit)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setSelectedHabitForNotification(habit)}
                                className={`p-2 rounded-lg ${
                                  habit.notificationSettings?.enabled
                                    ? darkMode
                                      ? 'bg-indigo-900/50 text-indigo-400 hover:bg-indigo-900'
                                      : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                    : darkMode
                                      ? 'hover:bg-slate-700 text-slate-400'
                                      : 'hover:bg-slate-100 text-slate-500'
                                } transition-colors`}
                                aria-label="Notification settings"
                              >
                                <Bell className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(habit.id)}
                                className={`p-2 rounded-lg ${
                                  darkMode
                                    ? 'hover:bg-red-900/30 text-red-400'
                                    : 'hover:bg-red-50 text-red-500'
                                } transition-colors`}
                                aria-label="Delete habit"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notification Config Drawer */}
          {selectedHabitForNotification && (
            <NotificationConfigDrawer
              habit={selectedHabitForNotification}
              updateNotificationSettings={updateNotificationSettings}
              darkMode={darkMode}
              onClose={() => setSelectedHabitForNotification(null)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default HabitManagerModal;

