import { useState } from 'react';
import { Save, RefreshCw, Check, X } from 'lucide-react';

export default function Settings() {
  const [posConnected, setPosConnected] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testApiSuccess, setTestApiSuccess] = useState<boolean | null>(null);

  const [generalSettings, setGeneralSettings] = useState({
    businessName: 'The Craft Bar',
    address: '123 Lambton Quay',
    city: 'Wellington',
    email: 'info@thecraftbar.co.nz',
    phone: '04 123 4567',
  });

  const [posSettings, setPosSettings] = useState({
    apiKey: '••••••••••••••••',
    syncFrequency: 'hourly',
    syncSales: true,
    syncBookings: true,
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handlePosChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setPosSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const testConnection = () => {
    setIsConnecting(true);
    setTestApiSuccess(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsConnecting(false);
      setTestApiSuccess(true);
    }, 1500);
  };

  const refreshConnection = () => {
    setPosConnected(false);
    setIsConnecting(true);
    
    // Simulate reconnection
    setTimeout(() => {
      setIsConnecting(false);
      setPosConnected(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your business settings and connections
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Save className="-ml-1 mr-2 h-5 w-5" />
            Save All Settings
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Business Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your general business details
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="businessName"
                  id="businessName"
                  value={generalSettings.businessName}
                  onChange={handleGeneralChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={generalSettings.address}
                  onChange={handleGeneralChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={generalSettings.city}
                  onChange={handleGeneralChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={generalSettings.email}
                  onChange={handleGeneralChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={generalSettings.phone}
                  onChange={handleGeneralChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            IdealPOS Integration
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Connect to your POS system for sales and booking data
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="pb-6 mb-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                  posConnected ? 'bg-success-100' : 'bg-error-100'
                }`}>
                  {posConnected ? (
                    <Check className="h-6 w-6 text-success-600" />
                  ) : (
                    <X className="h-6 w-6 text-error-600" />
                  )}
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    {posConnected ? 'Connected to IdealPOS' : 'Not Connected'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {posConnected 
                      ? 'Last sync: Today at 10:30 AM' 
                      : 'Connection required to sync data'
                    }
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={refreshConnection}
                disabled={isConnecting}
                className={`inline-flex items-center px-4 py-2 border ${
                  posConnected 
                    ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    : 'border-transparent text-white bg-primary-600 hover:bg-primary-700'
                } rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    {posConnected ? 'Refreshing...' : 'Connecting...'}
                  </>
                ) : (
                  <>
                    <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
                    {posConnected ? 'Refresh Connection' : 'Connect'}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                API Key
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="apiKey"
                  id="apiKey"
                  value={posSettings.apiKey}
                  onChange={handlePosChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="syncFrequency" className="block text-sm font-medium text-gray-700">
                Sync Frequency
              </label>
              <div className="mt-1">
                <select
                  id="syncFrequency"
                  name="syncFrequency"
                  value={posSettings.syncFrequency}
                  onChange={handlePosChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="realtime">Real-time</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="syncSales"
                    name="syncSales"
                    type="checkbox"
                    checked={posSettings.syncSales}
                    onChange={handlePosChange}
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="syncSales" className="font-medium text-gray-700">
                    Sync Sales Data
                  </label>
                  <p className="text-gray-500">Pull daily sales figures from IdealPOS</p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="syncBookings"
                    name="syncBookings"
                    type="checkbox"
                    checked={posSettings.syncBookings}
                    onChange={handlePosChange}
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="syncBookings" className="font-medium text-gray-700">
                    Sync Booking Data
                  </label>
                  <p className="text-gray-500">Pull booking information from IdealPOS</p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-6">
              <button
                type="button"
                onClick={testConnection}
                disabled={isConnecting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Testing...
                  </>
                ) : (
                  'Test API Connection'
                )}
              </button>
              
              {testApiSuccess !== null && (
                <div className={`mt-2 text-sm ${testApiSuccess ? 'text-success-600' : 'text-error-600'}`}>
                  {testApiSuccess
                    ? 'Connection successful! The API key is valid.'
                    : 'Connection failed. Please check your API key and try again.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Weather API Integration
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Connect to a weather service for forecast data
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="weatherApiKey" className="block text-sm font-medium text-gray-700">
                OpenWeather API Key
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="weatherApiKey"
                  id="weatherApiKey"
                  defaultValue="••••••••••••••••"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location"
                  id="location"
                  defaultValue="Wellington, NZ"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Test Weather API
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Data Management
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Export and manage your business data
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Export Data</h4>
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Export Sales Data (CSV)
                  </button>
                </div>
                <div className="sm:col-span-3">
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Export Promotions (CSV)
                  </button>
                </div>
                <div className="sm:col-span-3">
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Export Bookings (CSV)
                  </button>
                </div>
                <div className="sm:col-span-3">
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Export Forecasts (CSV)
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Data Retention</h4>
              <div className="mt-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="retainData"
                      name="retainData"
                      type="checkbox"
                      defaultChecked
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="retainData" className="font-medium text-gray-700">
                      Retain historical data for 12 months
                    </label>
                    <p className="text-gray-500">
                      Keeping historical data improves forecast accuracy but uses more storage
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}