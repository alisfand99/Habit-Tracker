import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Trophy, Lightbulb, Lock, Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';
import useGamification from '../hooks/useGamification';

const AchievementsModal = ({ isOpen, onClose, habits = [], darkMode }) => {
  const { badges, insights } = useGamification(habits);
  const [activeTab, setActiveTab] = useState('badges');
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [readInsightIds, setReadInsightIds] = useState(() => {
    const saved = localStorage.getItem('read_insight_ids');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Save read insights to localStorage
  useEffect(() => {
    localStorage.setItem('read_insight_ids', JSON.stringify(Array.from(readInsightIds)));
  }, [readInsightIds]);

  const handleCardFlip = (insightId) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(insightId)) {
        newSet.delete(insightId);
      } else {
        newSet.add(insightId);
      }
      return newSet;
    });
  };

  const handleGotIt = (insightId) => {
    setReadInsightIds(prev => new Set([...prev, insightId]));
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(insightId);
      return newSet;
    });
  };

  // Separate new and archived insights
  const newInsights = insights.filter(insight => !readInsightIds.has(insight.id));
  const archivedInsights = insights.filter(insight => readInsightIds.has(insight.id));

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full-Screen Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 ${
              darkMode ? 'bg-slate-900/95' : 'bg-slate-50/95'
            } backdrop-blur-xl z-50`}
          />

          {/* Full-Screen Content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed inset-0 ${
              darkMode ? 'bg-slate-900' : 'bg-slate-50'
            } z-50 flex flex-col overflow-hidden`}
          >
            {/* Sticky Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
              darkMode ? 'border-slate-700 bg-slate-900/95 backdrop-blur-sm' : 'border-slate-200 bg-slate-50/95 backdrop-blur-sm'
            }`} style={{ paddingTop: `max(16px, calc(env(safe-area-inset-top) + 16px))` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    Achievements & Insights
                  </h2>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {unlockedCount} of {badges.length} badges unlocked
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-200'
                } transition-colors`}
                aria-label="Close"
              >
                <X className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
              </button>
            </div>

            {/* Tabs */}
            <div className={`flex border-b ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <button
                onClick={() => setActiveTab('badges')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 font-semibold text-sm transition-colors ${
                  activeTab === 'badges'
                    ? darkMode
                      ? 'text-yellow-400 border-b-2 border-yellow-400 bg-slate-800'
                      : 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                    : darkMode
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Trophy className="w-4 h-4" />
                Badges
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 font-semibold text-sm transition-colors ${
                  activeTab === 'insights'
                    ? darkMode
                      ? 'text-yellow-400 border-b-2 border-yellow-400 bg-slate-800'
                      : 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                    : darkMode
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                Insights {newInsights.length > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    darkMode ? 'bg-yellow-500 text-yellow-900' : 'bg-orange-500 text-white'
                  }`}>
                    {newInsights.length}
                  </span>
                )}
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Badges Tab */}
              {activeTab === 'badges' && (
                <div className="p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {badges.map((badge, index) => {
                      const progressPercent = (badge.currentProgress / badge.maxProgress) * 100;
                      const isNew = badge.isUnlocked && badge.unlockedAt && 
                        new Date(badge.unlockedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

                      // Tier-based border and shadow colors
                      const tierStyles = {
                        bronze: {
                          border: badge.isUnlocked ? 'border-orange-400' : 'border-orange-400/30',
                          shadow: badge.isUnlocked ? 'shadow-orange-400/20 shadow-lg' : '',
                        },
                        silver: {
                          border: badge.isUnlocked ? 'border-slate-400' : 'border-slate-400/30',
                          shadow: badge.isUnlocked ? 'shadow-slate-400/20 shadow-lg' : '',
                        },
                        gold: {
                          border: badge.isUnlocked ? 'border-yellow-400' : 'border-yellow-400/30',
                          shadow: badge.isUnlocked ? 'shadow-yellow-400/20 shadow-lg' : '',
                        },
                        diamond: {
                          border: badge.isUnlocked ? 'border-cyan-400' : 'border-cyan-400/30',
                          shadow: badge.isUnlocked ? 'shadow-cyan-400/30 shadow-xl' : '',
                        },
                      };

                      const tierStyle = tierStyles[badge.tier] || tierStyles.bronze;

                      return (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.03 }}
                          whileHover={badge.isUnlocked ? { scale: 1.05 } : {}}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedBadge(badge)}
                          className={`relative rounded-xl p-3 border-2 cursor-pointer transition-all ${
                            badge.isUnlocked
                              ? `bg-gradient-to-br ${badge.color} ${tierStyle.border} ${tierStyle.shadow}`
                              : darkMode
                                ? `bg-slate-800 ${tierStyle.border} opacity-60`
                                : `bg-slate-100 ${tierStyle.border} opacity-60`
                          }`}
                        >
                          {!badge.isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                              <Lock className={`w-6 h-6 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                            </div>
                          )}
                          <div className={`relative ${badge.isUnlocked ? '' : 'opacity-30'}`}>
                            <div className="text-4xl mb-1 text-center">{badge.icon}</div>
                            <div className={`text-center font-bold text-xs mb-1 ${
                              badge.isUnlocked ? 'text-white' : darkMode ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {badge.title}
                            </div>
                            {/* Tier Badge */}
                            {badge.isUnlocked && (
                              <div className={`text-[8px] text-center mb-1 font-semibold ${
                                badge.tier === 'bronze' ? 'text-orange-200'
                                : badge.tier === 'silver' ? 'text-slate-200'
                                : badge.tier === 'gold' ? 'text-yellow-200'
                                : 'text-cyan-200'
                              }`}>
                                {badge.tier === 'bronze' ? '🥉' : badge.tier === 'silver' ? '🥈' : badge.tier === 'gold' ? '🥇' : '💎'}
                              </div>
                            )}
                            {/* Progress Bar for Locked Badges */}
                            {!badge.isUnlocked && badge.maxProgress > 1 && (
                              <div className={`w-full h-1 rounded-full overflow-hidden ${
                                darkMode ? 'bg-slate-700' : 'bg-slate-300'
                              }`}>
                                <div
                                  className={`h-full bg-gradient-to-r ${badge.color} transition-all`}
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            )}
                            {!badge.isUnlocked && badge.maxProgress > 1 && (
                              <div className={`text-[9px] text-center mt-0.5 ${
                                darkMode ? 'text-slate-500' : 'text-slate-500'
                              }`}>
                                {badge.currentProgress}/{badge.maxProgress}
                              </div>
                            )}
                          </div>
                          {badge.isUnlocked && isNew && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full z-20"
                            >
                              New
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Insights Tab - Inbox Flow */}
              {activeTab === 'insights' && (
                <div className="p-4 space-y-6">
                  {/* New Insights Section */}
                  {newInsights.length > 0 && (
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        New Insights ({newInsights.length})
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {newInsights.map((insight, index) => {
                          const isFlipped = flippedCards.has(insight.id);
                          const cardColor = insight.category === 'energy' 
                            ? darkMode ? 'from-blue-600 to-indigo-700' : 'from-blue-400 to-indigo-500'
                            : insight.category === 'streak' || insight.category === 'achievement'
                            ? darkMode ? 'from-orange-600 to-red-700' : 'from-orange-400 to-red-500'
                            : darkMode ? 'from-purple-600 to-pink-700' : 'from-purple-400 to-pink-500';

                          return (
                            <motion.div
                              key={insight.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="h-40 perspective-1000"
                              style={{ perspective: '1000px' }}
                            >
                              <motion.div
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.5, type: 'spring', stiffness: 250, damping: 20 }}
                                className="relative w-full h-full preserve-3d"
                                style={{ transformStyle: 'preserve-3d' }}
                                onClick={() => handleCardFlip(insight.id)}
                              >
                                {/* Front */}
                                <div
                                  className={`absolute inset-0 rounded-xl p-4 border-2 cursor-pointer backface-hidden bg-gradient-to-br ${cardColor} border-transparent shadow-lg flex flex-col items-center justify-center`}
                                  style={{ backfaceVisibility: 'hidden' }}
                                >
                                  <div className="text-3xl mb-2">{insight.icon}</div>
                                  <h4 className={`text-sm font-bold mb-1 text-center text-white`}>
                                    {insight.title}
                                  </h4>
                                  <p className={`text-[10px] text-center text-white/80`}>
                                    Tap to read
                                  </p>
                                </div>

                                {/* Back */}
                                <div
                                  className={`absolute inset-0 rounded-xl p-4 border-2 cursor-pointer backface-hidden bg-gradient-to-br ${cardColor} border-transparent shadow-lg flex flex-col justify-between`}
                                  style={{ 
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)'
                                  }}
                                >
                                  <div className="flex-1 flex flex-col justify-center">
                                    <div className="text-center mb-2">
                                      <span className="text-2xl">{insight.icon}</span>
                                    </div>
                                    <p className={`text-xs font-medium leading-relaxed text-center text-white`}>
                                      {insight.text}
                                    </p>
                                  </div>
                                  <motion.button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleGotIt(insight.id);
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-full py-2 rounded-lg text-xs font-semibold ${
                                      darkMode ? 'bg-white/20 hover:bg-white/30' : 'bg-white/30 hover:bg-white/40'
                                    } text-white transition-colors flex items-center justify-center gap-1`}
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    Got it!
                                  </motion.button>
                                </div>
                              </motion.div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Archived Section */}
                  {archivedInsights.length > 0 && (
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Past Wisdom ({archivedInsights.length})
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {archivedInsights.map((insight, index) => {
                          const isFlipped = flippedCards.has(insight.id);
                          const cardColor = darkMode ? 'from-slate-700 to-slate-800' : 'from-slate-200 to-slate-300';

                          return (
                            <motion.div
                              key={insight.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.03 }}
                              className="h-32 perspective-1000 opacity-60"
                              style={{ perspective: '1000px' }}
                            >
                              <motion.div
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative w-full h-full preserve-3d"
                                style={{ transformStyle: 'preserve-3d' }}
                                onClick={() => handleCardFlip(insight.id)}
                              >
                                {/* Front */}
                                <div
                                  className={`absolute inset-0 rounded-lg p-3 border cursor-pointer backface-hidden bg-gradient-to-br ${cardColor} border-slate-400/30 shadow-sm flex flex-col items-center justify-center`}
                                  style={{ backfaceVisibility: 'hidden' }}
                                >
                                  <div className="text-2xl mb-1">{insight.icon}</div>
                                  <h4 className={`text-xs font-semibold text-center ${
                                    darkMode ? 'text-slate-300' : 'text-slate-600'
                                  }`}>
                                    {insight.title}
                                  </h4>
                                </div>

                                {/* Back */}
                                <div
                                  className={`absolute inset-0 rounded-lg p-3 border cursor-pointer backface-hidden bg-gradient-to-br ${cardColor} border-slate-400/30 shadow-sm flex flex-col justify-center`}
                                  style={{ 
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)'
                                  }}
                                >
                                  <p className={`text-[10px] leading-tight text-center ${
                                    darkMode ? 'text-slate-300' : 'text-slate-600'
                                  }`}>
                                    {insight.text}
                                  </p>
                                </div>
                              </motion.div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {insights.length === 0 && (
                    <div className={`text-center py-20 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Lightbulb className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                      <p>Complete more habits to unlock insights!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Badge Detail Modal */}
          <AnimatePresence>
            {selectedBadge && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedBadge(null)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`fixed bottom-0 left-0 right-0 ${
                    darkMode ? 'bg-slate-900' : 'bg-white'
                  } rounded-t-3xl shadow-2xl z-[60] flex flex-col max-h-[85vh]`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className={`flex-shrink-0 flex items-center justify-between p-4 border-b ${
                    darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
                  }`} style={{ paddingTop: `max(16px, calc(env(safe-area-inset-top) + 16px))` }}>
                    <div className="flex items-center gap-3">
                      <div className={`text-5xl ${selectedBadge.isUnlocked ? '' : 'opacity-50 grayscale'}`}>
                        {selectedBadge.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-lg font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                            {selectedBadge.title}
                          </h3>
                          {selectedBadge.tier && (
                            <span className={`text-lg ${
                              selectedBadge.tier === 'bronze' ? 'text-orange-400'
                              : selectedBadge.tier === 'silver' ? 'text-slate-400'
                              : selectedBadge.tier === 'gold' ? 'text-yellow-400'
                              : 'text-cyan-400'
                            }`}>
                              {selectedBadge.tier === 'bronze' ? '🥉' : selectedBadge.tier === 'silver' ? '🥈' : selectedBadge.tier === 'gold' ? '🥇' : '💎'}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {selectedBadge.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBadge(null)}
                      className={`p-1.5 rounded-full ${
                        darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                      } transition-colors`}
                    >
                      <X className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
                    <div className="p-6 space-y-4">
                      {/* Status */}
                      <div className={`p-4 rounded-xl ${
                        selectedBadge.isUnlocked
                          ? darkMode ? 'bg-emerald-900/30 border-emerald-700/50' : 'bg-emerald-50 border-emerald-200'
                          : darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                      } border-2`}>
                        {selectedBadge.isUnlocked ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            <div>
                              <p className={`font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                Unlocked
                              </p>
                              {selectedBadge.unlockedAt && (
                                <p className={`text-xs ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                  on {formatDate(selectedBadge.unlockedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className={`font-semibold mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                              Locked
                            </p>
                            {selectedBadge.maxProgress > 1 && (
                              <>
                                <div className={`w-full h-2 rounded-full overflow-hidden mb-2 ${
                                  darkMode ? 'bg-slate-700' : 'bg-slate-300'
                                }`}>
                                  <div
                                    className={`h-full bg-gradient-to-r ${selectedBadge.color} transition-all`}
                                    style={{ width: `${(selectedBadge.currentProgress / selectedBadge.maxProgress) * 100}%` }}
                                  />
                                </div>
                                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                  Progress: {selectedBadge.currentProgress} / {selectedBadge.maxProgress}
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          Description
                        </h4>
                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {selectedBadge.description}
                        </p>
                      </div>

                      {/* Scientific Fact */}
                      <div className={`p-4 rounded-xl border-2 ${
                        darkMode ? 'bg-yellow-900/20 border-yellow-700/50' : 'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          <Lightbulb className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            darkMode ? 'text-yellow-400' : 'text-yellow-600'
                          }`} />
                          <div>
                            <h4 className={`text-sm font-semibold mb-1 ${
                              darkMode ? 'text-yellow-300' : 'text-yellow-800'
                            }`}>
                              The Science
                            </h4>
                            <p className={`text-sm leading-relaxed ${
                              darkMode ? 'text-yellow-200' : 'text-yellow-900'
                            }`}>
                              {selectedBadge.scienceNote}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className={`flex-shrink-0 p-4 border-t ${
                    darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
                  }`}>
                    <button
                      onClick={() => setSelectedBadge(null)}
                      className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
                        darkMode
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default AchievementsModal;
