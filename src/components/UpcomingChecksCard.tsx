import React from 'react';
import { mockFoodSafetyTasks } from '../services/mockData';
import { FoodSafetyTask } from '../types';
import { ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, startOfDay } from 'date-fns';
import { Link } from 'react-router-dom';

const UpcomingChecksCard: React.FC = () => {
  const today = startOfDay(new Date());

  // Filter tasks due today or tomorrow
  const upcomingTasks = mockFoodSafetyTasks.filter(task => {
    const dueDate = startOfDay(parseISO(task.nextDueDate));
    return isToday(dueDate) || isTomorrow(dueDate);
  }).sort((a, b) => parseISO(a.nextDueDate).getTime() - parseISO(b.nextDueDate).getTime()); // Sort by due date

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center mb-3">
        <ShieldCheck className="w-6 h-6 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-700">Upcoming Checks</h3>
      </div>
      
      {upcomingTasks.length > 0 ? (
        <ul className="space-y-2">
          {upcomingTasks.map(task => {
            const dueDate = startOfDay(parseISO(task.nextDueDate));
            const isDueToday = isToday(dueDate);
            return (
              <li key={task.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1 last:border-b-0">
                <span className="text-gray-700 flex items-center">
                  {isDueToday ? (
                      <AlertCircle className="w-4 h-4 mr-1.5 text-red-500 flex-shrink-0" /> 
                  ) : (
                      <Clock className="w-4 h-4 mr-1.5 text-blue-500 flex-shrink-0" />
                  )}
                  {task.name}
                </span>
                <span className={`font-medium ${isDueToday ? 'text-red-600' : 'text-blue-600'}`}>
                  {isDueToday ? 'Today' : 'Tomorrow'}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No checks due today or tomorrow.</p>
      )}

      <p className="text-xs text-gray-400 mt-3">
        <Link to="/food-safety" className="text-indigo-600 hover:text-indigo-800">View all tasks</Link>
      </p>
    </div>
  );
};

export default UpcomingChecksCard; 