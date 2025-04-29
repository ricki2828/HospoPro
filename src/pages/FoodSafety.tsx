import React from 'react';
import { mockFoodSafetyTasks } from '../services/mockData';
import { FoodSafetyTask } from '../types';
import { format, parseISO, isToday, isPast, startOfDay } from 'date-fns';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

// Function to determine task status based on due date
const getTaskStatus = (dueDate: string): { text: string; icon: React.ReactNode; color: string } => {
  const today = startOfDay(new Date());
  const parsedDueDate = startOfDay(parseISO(dueDate));

  if (isToday(parsedDueDate)) {
    return { text: 'Due Today', icon: <AlertCircle className="w-4 h-4 mr-1 text-red-600" />, color: 'text-red-600' };
  }
  if (isPast(parsedDueDate)) {
    // You might add logic here to check if it was completed late vs. still overdue
    return { text: 'Overdue', icon: <AlertCircle className="w-4 h-4 mr-1 text-red-800" />, color: 'text-red-800 font-bold' };
  }
  // You could add more states like 'Upcoming' within a week
  return { text: 'Scheduled', icon: <Clock className="w-4 h-4 mr-1 text-gray-500" />, color: 'text-gray-600' };
};

const FoodSafety: React.FC = () => {
  // Sort tasks by due date
  const sortedTasks = [...mockFoodSafetyTasks].sort((a, b) => 
    parseISO(a.nextDueDate).getTime() - parseISO(b.nextDueDate).getTime()
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Food Safety Tasks</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTasks.map((task) => {
              const status = getTaskStatus(task.nextDueDate);
              return (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.category || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.frequency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(task.nextDueDate), 'EEE, dd MMM yyyy')}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${status.color} flex items-center`}>
                    {status.icon}
                    {status.text}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Placeholder for logging action */}
                    <button className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 text-xs" disabled={isPast(parseISO(task.nextDueDate))}>
                      Log Task
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodSafety; 