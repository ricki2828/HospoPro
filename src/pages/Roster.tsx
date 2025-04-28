import React, { useState } from 'react';
import { staffMembers, mockShifts } from '../services/mockData';
import { StaffMember, Team, Shift } from '../types';
import { format, addDays, startOfWeek, eachDayOfInterval, parseISO, formatISO, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Helper to get staff member name by ID
const getStaffName = (staffId: string): string => {
  const staff = staffMembers.find(s => s.id === staffId);
  return staff ? staff.name : 'Unknown Staff';
};

const Roster: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 })); // Start week on Monday

  const weekInterval = {
    start: currentDate,
    end: addDays(currentDate, 6),
  };
  const weekDays = eachDayOfInterval(weekInterval);

  // Filter shifts for the current week
  const currentWeekShifts = mockShifts.filter(shift => {
    const shiftDate = parseISO(shift.date); // Parse the string date
    return shiftDate >= weekInterval.start && shiftDate <= weekInterval.end;
  });

  // Group shifts by staff member ID
  const shiftsByStaff = currentWeekShifts.reduce((acc, shift) => {
    if (!acc[shift.staffId]) {
      acc[shift.staffId] = [];
    }
    acc[shift.staffId].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

  // Group staff by team for display rows
  const staffByTeam = staffMembers.reduce((acc, staff) => {
    if (!acc[staff.team]) {
      acc[staff.team] = [];
    }
    acc[staff.team].push(staff);
    return acc;
  }, {} as Record<Team, StaffMember[]>);

  const handlePreviousWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Staff Roster</h1>

      {/* Roster controls (Week navigation) */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow flex items-center justify-between">
        <button 
          onClick={handlePreviousWeek} 
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-center text-gray-700">
          Week of {format(currentDate, 'do MMMM yyyy')}
        </h2>
        <button 
          onClick={handleNextWeek} 
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Roster Grid */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 w-40">Staff</th>
              {weekDays.map(day => (
                <th key={formatISO(day)} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  {format(day, 'EEE dd/MM')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(staffByTeam).map(([team, members]) => (
              <React.Fragment key={team}>
                {/* Team Header Row */}
                <tr>
                  <td colSpan={weekDays.length + 1} className="px-3 py-2 bg-indigo-50 text-indigo-800 text-sm font-semibold sticky left-0 z-10 w-40">
                    {team}
                  </td>
                </tr>
                {/* Staff Rows */}
                {members.map(staff => (
                  <tr key={staff.id}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 w-40">{staff.name}</td>
                    {weekDays.map(day => {
                      const dayString = format(day, 'yyyy-MM-dd');
                      const staffShiftsForDay = (shiftsByStaff[staff.id] || []).filter(shift => shift.date === dayString);
                      return (
                        <td key={formatISO(day)} className="px-3 py-2 whitespace-normal text-xs text-gray-700 align-top min-w-[100px] border-l border-gray-100">
                          {staffShiftsForDay.length > 0 ? (
                            <div className="space-y-1">
                              {staffShiftsForDay.map(shift => (
                                <div key={shift.id} className="bg-blue-100 text-blue-800 p-1 rounded text-center">
                                  {format(shift.startTime, 'HH:mm')} - {format(shift.endTime, 'HH:mm')}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-400">-</div> // Placeholder for empty slot
                          )}
                          {/* Placeholder for dropping shifts */}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Area for Unassigned Shifts / Staff List for Dragging (Future) */}
      {/* ... */}

    </div>
  );
};

export default Roster; 