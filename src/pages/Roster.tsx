import React, { useState } from 'react';
import { staffMembers, mockShifts } from '../services/mockData';
import { StaffMember, Team, Shift } from '../types';
import { format, addDays, startOfWeek, eachDayOfInterval, parseISO, formatISO, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DndContext, useDraggable, useDroppable, closestCenter, DragEndEvent } from '@dnd-kit/core';

// Helper to get staff member name by ID
const getStaffName = (staffId: string): string => {
  const staff = staffMembers.find(s => s.id === staffId);
  return staff ? staff.name : 'Unknown Staff';
};

// --- Draggable Shift Component ---
interface DraggableShiftProps {
  shift: Shift;
  children: React.ReactNode;
}

function DraggableShift({ shift, children }: DraggableShiftProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: shift.id, // Unique ID for the draggable item (shift ID)
    data: { shift }, // Pass shift data for use in onDragEnd
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100, // Ensure dragged item is on top
    cursor: 'grabbing',
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

// --- Droppable Cell Component ---
interface DroppableCellProps {
  staffId: string;
  day: Date;
  children: React.ReactNode;
}

function DroppableCell({ staffId, day, children }: DroppableCellProps) {
  const dateString = format(day, 'yyyy-MM-dd');
  const droppableId = `cell-${staffId}-${dateString}`;

  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
    data: { staffId, dateString }, // Pass cell data for use in onDragEnd
  });

  const style = {
    backgroundColor: isOver ? 'rgba(199, 210, 254, 0.5)' : undefined, // Highlight when hovering
  };

  return (
    <td 
      ref={setNodeRef} 
      style={style}
      key={formatISO(day)} 
      className="px-1 py-1 md:px-3 md:py-2 whitespace-normal text-xs text-gray-700 align-top min-w-[80px] md:min-w-[100px] border-l border-gray-100 h-20" // Added fixed height
    >
      {children}
    </td>
  );
}

// --- Roster Component ---
const Roster: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  // --- Use state for shifts --- 
  const [shifts, setShifts] = useState<Shift[]>(mockShifts); 

  const weekInterval = {
    start: currentDate,
    end: addDays(currentDate, 6),
  };
  const weekDays = eachDayOfInterval(weekInterval);

  // Filter shifts for the current week (from state)
  const currentWeekShifts = shifts.filter(shift => {
    const shiftDate = parseISO(shift.date);
    return shiftDate >= weekInterval.start && shiftDate <= weekInterval.end;
  });

  // Group shifts by staff member ID (from state)
  const shiftsByStaff = currentWeekShifts.reduce((acc, shift) => {
    if (!acc[shift.staffId]) {
      acc[shift.staffId] = [];
    }
    acc[shift.staffId].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

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

  // --- Drag and Drop Handler ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeShift = active.data.current?.shift as Shift;
      const targetCellData = over.data.current as { staffId: string; dateString: string };

      if (!activeShift || !targetCellData) {
        console.error("Drag and drop error: Missing data", { active, over });
        return; 
      }

      // Update the shift in the state
      setShifts((prevShifts) =>
        prevShifts.map((shift) =>
          shift.id === activeShift.id
            ? { ...shift, staffId: targetCellData.staffId, date: targetCellData.dateString }
            : shift
        )
      );
    }
  };

  return (
    // --- Wrap with DndContext ---
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="p-2 md:p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">Staff Roster</h1>

        {/* Roster controls (Week navigation) */}
        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-white rounded-lg shadow flex items-center justify-between">
          <button 
            onClick={handlePreviousWeek} 
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base md:text-lg font-semibold text-center text-gray-700">
            Week of {format(currentDate, 'do MMMM yyyy')}
          </h2>
          <button 
            onClick={handleNextWeek} 
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Roster Grid */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 md:px-3 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 w-32 md:w-40 border-r">Staff</th>
                {weekDays.map(day => (
                  <th key={formatISO(day)} className="px-1 py-2 md:px-3 md:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] md:min-w-[100px]">
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
                     {/* Make sure team header spans all columns including staff */}
                    <td colSpan={weekDays.length + 1} className="px-2 py-1 md:px-3 md:py-2 bg-indigo-50 text-indigo-800 text-xs md:text-sm font-semibold sticky left-0 z-20 w-32 md:w-40 border-r">
                      {team}
                    </td>
                  </tr>
                  {/* Staff Rows */}
                  {members.map(staff => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-2 py-2 md:px-3 md:py-2 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900 sticky left-0 bg-white hover:bg-gray-50 z-10 w-32 md:w-40 border-r">{staff.name}</td>
                      {weekDays.map(day => {
                        const dayString = format(day, 'yyyy-MM-dd');
                        const staffShiftsForDay = (shiftsByStaff[staff.id] || []).filter(shift => shift.date === dayString);
                        return (
                          // --- Wrap cell content with DroppableCell ---
                          <DroppableCell key={`${staff.id}-${dayString}`} staffId={staff.id} day={day}>
                            <div className="space-y-1 h-full"> {/* Ensure div takes height */}
                              {staffShiftsForDay.map(shift => (
                                // --- Wrap shift with DraggableShift ---
                                <DraggableShift key={shift.id} shift={shift}>
                                  <div className="bg-blue-100 hover:bg-blue-200 cursor-grab text-blue-800 p-1 rounded text-center text-[10px] md:text-xs leading-tight shadow-sm">
                                    {format(shift.startTime, 'HH:mm')} - {format(shift.endTime, 'HH:mm')}
                                  </div>
                                </DraggableShift>
                              ))}
                              {/* Show placeholder if empty for drop indication */}
                              {staffShiftsForDay.length === 0 && (
                                <div className="text-gray-300 text-center h-full flex items-center justify-center">-</div> 
                              )}
                            </div>
                          </DroppableCell>
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
    </DndContext>
  );
};

export default Roster; 