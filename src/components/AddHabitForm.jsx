import { useState, useEffect, useRef } from 'react';
import { X, Plus, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';

const CATEGORIES = ['General', 'Health', 'Fitness', 'Learning', 'Work', 'Personal', 'Social'];

const AddHabitForm = ({ isOpen, onClose, onAdd, onUpdate, editingHabit, darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    emoji: '✨',
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  useEffect(() => {
    if (editingHabit) {
      setFormData({
        name: editingHabit.name,
        category: editingHabit.category || 'General',
        emoji: editingHabit.emoji || '✨',
      });
    } else {
      setFormData({ name: '', category: 'General', emoji: '✨' });
    }
    setShowEmojiPicker(false);
  }, [editingHabit, isOpen]);

  // Close emoji picker when clicking outside
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      if (editingHabit) {
        onUpdate(editingHabit.id, formData);
      } else {
        onAdd(formData);
      }
      setFormData({ name: '', category: 'General', emoji: '✨' });
      setShowEmojiPicker(false);
      onClose();
    }
  };

  const handleEmojiSelect = (emojiData) => {
    setFormData({ ...formData, emoji: emojiData.emoji });
    setShowEmojiPicker(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 safe-area-inset-bottom"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none"
          >
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-md shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {editingHabit ? 'Edit Habit' : 'Add New Habit'}
                </h2>
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 ${darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'} rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center`}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Drink 8 glasses of water"
                    className={`w-full px-4 py-3 border ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' : 'border-slate-300'} rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all min-h-[44px]`}
                    autoFocus
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-4 py-3 border ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-200' : 'border-slate-300'} rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all min-h-[44px]`}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                    Emoji
                  </label>
                  <div className="flex items-center gap-3">
                    <motion.button
                      ref={emojiButtonRef}
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center justify-center w-16 h-16 text-3xl rounded-xl border-2 transition-all ${
                        showEmojiPicker
                          ? darkMode 
                            ? 'bg-indigo-600 border-indigo-400' 
                            : 'bg-indigo-200 border-indigo-400'
                          : darkMode 
                            ? 'bg-slate-700 border-slate-600 hover:border-slate-500' 
                            : 'bg-slate-100 border-slate-300 hover:border-slate-400'
                      } min-h-[64px] min-w-[64px]`}
                    >
                      {formData.emoji || <Smile className="w-6 h-6" />}
                    </motion.button>
                    <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Tap to choose emoji
                    </span>
                  </div>
                  
                  {showEmojiPicker && (
                    <motion.div
                      ref={emojiPickerRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 mt-2"
                    >
                      <div className={darkMode ? 'epr-dark' : ''}>
                        <EmojiPicker
                          onEmojiClick={handleEmojiSelect}
                          theme={darkMode ? 'dark' : 'light'}
                          width="100%"
                          height="350px"
                          searchDisabled={false}
                          skinTonesDisabled={false}
                          previewConfig={{
                            showPreview: false
                          }}
                          lazyLoadEmojis={true}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 px-4 py-3 border ${darkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'} rounded-xl transition-colors font-medium min-h-[44px]`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all font-medium shadow-md flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" />
                    {editingHabit ? 'Update Habit' : 'Add Habit'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddHabitForm;
