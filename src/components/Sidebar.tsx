import { Link, useLocation } from 'react-router-dom';
import { 
  Home, BarChart4, Calendar, Users, TrendingUp, Settings, CupSoda,
  ClipboardList
} from 'lucide-react';

type SidebarProps = {
  onCloseSidebar?: () => void;
};

export default function Sidebar({ onCloseSidebar }: SidebarProps) {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Promotions', href: '/promotions', icon: Calendar },
    { name: 'Bookings', href: '/bookings', icon: Users },
    { name: 'Roster', href: '/roster', icon: ClipboardList },
    { name: 'Analytics', href: '/analytics', icon: BarChart4 },
    { name: 'Forecasting', href: '/forecasting', icon: TrendingUp },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-950">
        <Link to="/" className="flex items-center" onClick={onCloseSidebar}>
          <CupSoda className="h-8 w-auto text-secondary-500" />
          <span className="ml-2 text-white text-lg font-semibold">HospoPro</span>
        </Link>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onCloseSidebar}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'bg-primary-100 text-primary-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <item.icon 
                  className={`
                    mr-3 h-5 w-5 transition-colors
                    ${isActive ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'}
                  `} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center">
            <span className="text-primary-700 font-medium text-sm">NZ</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Botanic Bar</p>
            <p className="text-xs text-gray-500">Christchurch, NZ</p>
          </div>
        </div>
      </div>
    </div>
  );
}