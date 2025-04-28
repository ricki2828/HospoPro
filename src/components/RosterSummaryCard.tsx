import React from 'react';
import { staffMembers, mockShifts } from '../services/mockData';
import { Team, StaffMember, Shift } from '../types';
import { ClipboardList } from 'lucide-react';
import { format, startOfDay } from 'date-fns';

const RosterSummaryCard: React.FC = () => {
  const todayString = format(startOfDay(new Date()), 'yyyy-MM-dd');

  // Filter shifts for today
  const todayShifts = mockShifts.filter(shift => shift.date === todayString);

  // Get unique staff IDs working today
  const staffWorkingTodayIds = new Set(todayShifts.map(shift => shift.staffId));

  // Get staff details for those working today and count per team
  const staffCountsToday = staffMembers
    .filter(staff => staffWorkingTodayIds.has(staff.id))
    .reduce((acc, staff) => {
      acc[staff.team] = (acc[staff.team] || 0) + 1;
      return acc;
    }, {} as Record<Team, number>);
    
  const totalStaffWorkingToday = staffWorkingTodayIds.size;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center mb-3">
        <ClipboardList className="w-6 h-6 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-700">Today's Roster</h3>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        Staff scheduled to work today: <span className="font-semibold text-gray-800">{totalStaffWorkingToday}</span>
      </p>
      <div className="space-y-1">
        {Object.entries(staffCountsToday).length > 0 ? (
          Object.entries(staffCountsToday).map(([team, count]) => (
            <div key={team} className="flex justify-between items-center text-xs">
              <span className="text-gray-600">{team}:</span>
              <span className="font-medium text-gray-800">{count} Staff</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500">No staff scheduled for today.</p>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        (Full roster details on the Roster page)
      </p>
    </div>
  );
};

export default RosterSummaryCard; 