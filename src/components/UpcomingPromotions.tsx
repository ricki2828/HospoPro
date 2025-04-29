import { Promo } from '../types';
import { format, parseISO, addDays, isWithinInterval, startOfDay } from 'date-fns';
import { Clock, Music, Tag, Calendar, Award } from 'lucide-react';

interface UpcomingPromotionsProps {
  promotions: Promo[];
  viewMode: 'week' | 'month';
}

export default function UpcomingPromotions({ promotions, viewMode }: UpcomingPromotionsProps) {
  const getPromoIcon = (type: string) => {
    switch (type) {
      case 'Happy Hour':
        return <Clock className="w-5 h-5 text-accent-500" />;
      case 'Live Music':
        return <Music className="w-5 h-5 text-secondary-500" />;
      case 'Discount':
        return <Tag className="w-5 h-5 text-primary-500" />;
      case 'Event':
        return <Calendar className="w-5 h-5 text-error-500" />;
      case 'Special Menu':
        return <Award className="w-5 h-5 text-success-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  // Sort promotions by start date
  const sortedPromos = [...promotions].sort((a, b) => 
    parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
  );

  // Filter promotions based on viewMode
  const now = startOfDay(new Date());
  const endPeriod = viewMode === 'week' ? addDays(now, 7) : addDays(now, 30);

  const upcomingPromos = sortedPromos.filter(promo => {
    const startDate = parseISO(promo.startDate);
    // Check if the promo starts between now and the end of the period
    return isWithinInterval(startDate, { start: now, end: endPeriod });
  });

  return (
    <div className="space-y-3">
      {/* Show 3 for week, up to 6 for month */}
      {upcomingPromos.slice(0, viewMode === 'week' ? 3 : 6).map((promo) => (
        <div
          key={promo.id}
          className="bg-white p-3 rounded-lg shadow-sm border-l-4 hover:shadow-md transition"
          style={{
            borderLeftColor:
              promo.type === 'Happy Hour'
                ? '#F59E0B'
                : promo.type === 'Live Music'
                ? '#0D9488'
                : promo.type === 'Discount'
                ? '#4338CA'
                : promo.type === 'Event'
                ? '#EF4444'
                : '#22C55E',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3">{getPromoIcon(promo.type)}</div>
              <div>
                <h3 className="text-sm font-medium">{promo.name}</h3>
                <p className="text-xs text-gray-500">
                  {format(parseISO(promo.startDate), 'EEE, MMM d')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">${promo.expectedRevenue}</p>
              <p className="text-xs text-gray-500">Expected</p>
            </div>
          </div>
        </div>
      ))}
      <a 
        href="/promotions" 
        className="block text-center text-sm text-primary-600 hover:text-primary-800 mt-2"
      >
        View all promotions
      </a>
    </div>
  );
}