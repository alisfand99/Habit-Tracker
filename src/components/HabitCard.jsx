import { Check, Trash2, Flame } from 'lucide-react';

const HabitCard = ({ habit, isCompleted, streak, onToggle, onDelete }) => {
  return (
    <div className={`glass-effect rounded-xl p-4 shadow-md transition-all duration-200 hover:shadow-lg ${
      isCompleted ? 'ring-2 ring-green-300 bg-green-50/50' : ''
    }`}>
      <div className="flex items-start gap-4">
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            isCompleted
              ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-purple-400 bg-white'
          }`}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted && <Check className="w-4 h-4" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{habit.emoji}</span>
            <h3 className={`font-semibold text-gray-800 ${
              isCompleted ? 'line-through text-gray-500' : ''
            }`}>
              {habit.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              {habit.category}
            </span>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-medium">{streak} day{streak !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={onDelete}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
          aria-label="Delete habit"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HabitCard;



