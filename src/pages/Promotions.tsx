import { useState } from 'react';
import { promos } from '../services/mockData';
import { Calendar, Plus, Music, Tag, Award, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Promo, PromoType } from '../types';

export default function Promotions() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [showNewPromoModal, setShowNewPromoModal] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<Promo>>({
    name: '',
    type: 'Happy Hour',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    cost: 0,
    expectedRevenue: 0
  });

  const getPromoTypeColor = (type: string): string => {
    switch (type) {
      case 'Happy Hour':
        return 'border-accent-500 bg-accent-50 text-accent-700';
      case 'Live Music':
        return 'border-secondary-500 bg-secondary-50 text-secondary-700';
      case 'Discount':
        return 'border-primary-500 bg-primary-50 text-primary-700';
      case 'Event':
        return 'border-error-500 bg-error-50 text-error-700';
      case 'Special Menu':
        return 'border-success-500 bg-success-50 text-success-700';
      default:
        return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  const getPromoIcon = (type: string) => {
    switch (type) {
      case 'Happy Hour':
        return <Clock className="w-5 h-5" />;
      case 'Live Music':
        return <Music className="w-5 h-5" />;
      case 'Discount':
        return <Tag className="w-5 h-5" />;
      case 'Special Menu':
        return <Award className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPromo({
      ...newPromo,
      [name]: name === 'cost' || name === 'expectedRevenue' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save this to a database
    console.log('New promo created:', newPromo);
    setShowNewPromoModal(false);
    // Reset form
    setNewPromo({
      name: '',
      type: 'Happy Hour',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      cost: 0,
      expectedRevenue: 0
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="text-sm text-gray-500">Manage and track your promotional activities</p>
        </div>
        <button
          onClick={() => setShowNewPromoModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Promotion
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="sm:hidden">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as 'calendar' | 'list')}
          >
            <option value="calendar">Calendar View</option>
            <option value="list">List View</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`${
                  activeTab === 'calendar'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
              >
                Calendar View
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`${
                  activeTab === 'list'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
              >
                List View
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'calendar' ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Promotion Calendar</h2>
          <div className="mb-4 space-y-2">
            {/* Legend */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-accent-500 mr-2"></div>
                <span className="text-sm text-gray-600">Happy Hour</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-secondary-500 mr-2"></div>
                <span className="text-sm text-gray-600">Live Music</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-primary-500 mr-2"></div>
                <span className="text-sm text-gray-600">Discount</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-error-500 mr-2"></div>
                <span className="text-sm text-gray-600">Event</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-success-500 mr-2"></div>
                <span className="text-sm text-gray-600">Special Menu</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 border rounded-lg p-4">
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="bg-gray-50 py-2 text-center">
                  <span className="text-sm font-medium text-gray-500">{day}</span>
                </div>
              ))}
              
              {/* This would normally be generated dynamically based on the current month */}
              {Array.from({ length: 35 }).map((_, i) => {
                const dayPromos = promos.filter(p => {
                  // This is a simplified version; normally you'd use proper date logic
                  return i % 7 === parseISO(p.startDate).getDay();
                });
                
                return (
                  <div key={i} className="bg-white min-h-[100px] p-2 border-t">
                    <div className="text-right">
                      <span className="text-sm text-gray-500">{i + 1}</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {dayPromos.map((promo) => {
                        let bgColor = '';
                        switch (promo.type) {
                          case 'Happy Hour': bgColor = 'bg-accent-200'; break;
                          case 'Live Music': bgColor = 'bg-secondary-200'; break;
                          case 'Discount': bgColor = 'bg-primary-200'; break;
                          case 'Event': bgColor = 'bg-error-200'; break;
                          case 'Special Menu': bgColor = 'bg-success-200'; break;
                          default: bgColor = 'bg-gray-200';
                        }
                        
                        return (
                          <div key={promo.id} className={`text-xs p-1 rounded ${bgColor} truncate`}>
                            {promo.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Promotion
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cost
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Expected Revenue
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actual Revenue
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ROI
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promos.map((promo) => {
                  const roi = promo.actualRevenue 
                    ? ((promo.actualRevenue - promo.cost) / promo.cost * 100).toFixed(0) 
                    : '-';
                    
                  return (
                    <tr key={promo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{promo.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPromoTypeColor(promo.type)}`}>
                          {promo.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(parseISO(promo.startDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${promo.cost}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${promo.expectedRevenue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {promo.actualRevenue ? `$${promo.actualRevenue}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          roi !== '-' && parseInt(roi) > 0
                            ? 'bg-success-100 text-success-800'
                            : roi !== '-' && parseInt(roi) < 0
                            ? 'bg-error-100 text-error-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {roi === '-' ? '-' : `${roi}%`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Promotion Modal */}
      {showNewPromoModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowNewPromoModal(false)}></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Calendar className="h-6 w-6 text-primary-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">New Promotion</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Add a new promotion to your calendar.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 sm:mt-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Promotion Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={newPromo.name}
                        onChange={handleInputChange}
                        required
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <div className="mt-1">
                      <select
                        id="type"
                        name="type"
                        value={newPromo.type}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="Happy Hour">Happy Hour</option>
                        <option value="Live Music">Live Music</option>
                        <option value="Discount">Discount</option>
                        <option value="Event">Event</option>
                        <option value="Special Menu">Special Menu</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                      Cost (NZD)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="cost"
                        id="cost"
                        min="0"
                        value={newPromo.cost}
                        onChange={handleInputChange}
                        required
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={newPromo.startDate}
                        onChange={handleInputChange}
                        required
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={newPromo.endDate}
                        onChange={handleInputChange}
                        required
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="expectedRevenue" className="block text-sm font-medium text-gray-700">
                      Expected Revenue (NZD)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="expectedRevenue"
                        id="expectedRevenue"
                        min="0"
                        value={newPromo.expectedRevenue}
                        onChange={handleInputChange}
                        required
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setShowNewPromoModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}