import { useState } from 'react';
import { Menu, Bell, HelpCircle, ChevronDown } from 'lucide-react';

type HeaderProps = {
  onOpenSidebar: () => void;
};

export default function Header({ onOpenSidebar }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 lg:hidden"
        onClick={onOpenSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 lg:block hidden">
            HospoPro
          </h1>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          {/* IdealPOS connection status */}
          <div className="mr-3">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-success-500 mr-2"></div>
              <span className="text-xs text-gray-600">IdealPOS: Connected</span>
            </div>
          </div>

          {/* Help button */}
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span className="sr-only">View help</span>
            <HelpCircle className="h-6 w-6" />
          </button>

          {/* Notification dropdown */}
          <div className="ml-3 relative">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>

            {isNotificationOpen && (
              <div 
                className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                onClick={() => setIsNotificationOpen(false)}  
              >
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Notifications</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <p className="font-medium">Forecast Updated</p>
                      <p className="text-xs text-gray-500">Revenue forecast for Friday has been adjusted based on weather data</p>
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <p className="font-medium">New Booking</p>
                      <p className="text-xs text-gray-500">Group booking for 12 people on Saturday evening</p>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white">
                  JD
                </div>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
              </button>
            </div>

            {isUserMenuOpen && (
              <div 
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}