import { Booking } from '../types';
import { format, parseISO, addDays, isWithinInterval, startOfDay } from 'date-fns';

interface BookingsListProps {
  bookings: Booking[];
  viewMode: 'week' | 'month';
}

export default function BookingsList({ bookings, viewMode }: BookingsListProps) {
  const allSortedBookings = [...bookings].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
  );

  const now = startOfDay(new Date());
  const endPeriod = viewMode === 'week' ? addDays(now, 7) : addDays(now, 30);

  const upcomingBookings = allSortedBookings.filter(booking => {
    const bookingDate = parseISO(booking.date);
    return isWithinInterval(bookingDate, { start: now, end: endPeriod });
  });

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date & Time
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Party Size
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Source
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No-Show Risk
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {upcomingBookings.slice(0, 5).map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  <div className="font-medium text-gray-900">
                    {format(parseISO(booking.date), 'E, MMM d')}
                  </div>
                  <div className="text-gray-500">{booking.time}</div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {booking.customerName}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {booking.partySize}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {booking.source}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      booking.noShowRisk === 'low'
                        ? 'bg-success-50 text-success-700'
                        : booking.noShowRisk === 'medium'
                        ? 'bg-accent-50 text-accent-700'
                        : 'bg-error-50 text-error-700'
                    }`}
                  >
                    {booking.noShowRisk.charAt(0).toUpperCase() + booking.noShowRisk.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {upcomingBookings.length === 0 && (
        <div className="py-4 text-center text-sm text-gray-500">
          No upcoming bookings {viewMode === 'week' ? 'this week' : 'this month'}
        </div>
      )}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-right">
        <a
          href="/bookings"
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          View all bookings
        </a>
      </div>
    </div>
  );
}