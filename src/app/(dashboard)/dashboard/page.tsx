'use client';

import { useAuth } from '../../context/authInfo';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, MapPin, AlertCircle, Search, UserPlus } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    nearbyRequests: 0,
    nearbyDonors: 0,
    myRequests: 0,
    activeDonors: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      // Replace with actual API calls
      setStats({
        nearbyRequests: 2,
        nearbyDonors: 3,
        myRequests: 1,
        activeDonors: 15,
      });
    };
    fetchStats();
  }, []);

  const quickActions = [
    {
      label: 'Find Donors',
      icon: Search,
      color: 'blue',
      description: 'Search for available donors',
      route: '/donors',
    },
    {
      label: 'Register as Donor',
      icon: UserPlus,
      color: 'green',
      description: 'Become a blood donor',
      route: '/donors/register',
    },
    {
      label: 'Find Requests',
      icon: MapPin,
      color: 'orange',
      description: 'See blood requests nearby',
      route: '/requests',
    },
    {
      label: 'Create Request',
      icon: AlertCircle,
      color: 'red',
      description: 'Post a blood requirement',
      route: '/requests/create',
    },
  ];

  const statCards = [
    {
      label: 'Nearby Requests',
      value: stats.nearbyRequests,
      color: 'orange',
      icon: AlertCircle,
      description: 'Blood requests in your area',
      route: '/requests',
    },
    {
      label: 'Available Donors',
      value: stats.nearbyDonors,
      color: 'blue',
      icon: Users,
      description: 'Donors near you',
      route: '/donors',
    },
    {
      label: 'My Requests',
      value: stats.myRequests,
      color: 'red',
      icon: AlertCircle,
      description: 'Your blood requests',
      route: '/requests',
    },
    {
      label: 'Active Donors',
      value: stats.activeDonors,
      color: 'green',
      icon: Users,
      description: 'Total registered donors',
      route: '/donors',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      red: 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600',
      green: 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600',
      orange:
        'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600',
      blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600',
      purple:
        'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-red-100 opacity-90">
          Ready to save lives today? Find donors, create requests, or register
          as a donor.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {quickActions.map(
            ({ label, icon: Icon, color, description, route }) => (
              <button
                key={label}
                onClick={() => handleNavigation(route)}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <div className="text-center">
                  <div
                    className={`p-3 rounded-full ${getColorClasses(color)} bg-opacity-20 inline-flex mb-3`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium block mb-1">
                    {label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {description}
                  </span>
                </div>
              </button>
            )
          )}
        </div>
      </div>

      {/* Statistics Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map(
            ({ label, value, color, icon: Icon, description, route }) => (
              <div
                key={label}
                onClick={() => handleNavigation(route)}
                className={`rounded-2xl shadow-sm p-6 bg-white dark:bg-gray-800 border-l-4 ${getColorClasses(color)} transition-transform hover:scale-105 duration-200 cursor-pointer hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      {label}
                    </p>
                    <p className="text-3xl font-bold mb-2">{value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {description}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${getColorClasses(color)} bg-opacity-20`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div
            onClick={() => handleNavigation('/donors')}
            className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer transition-colors"
          >
            <UserPlus className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-sm">Donor Registered</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                New donor registered in your area 2 days ago
              </p>
            </div>
          </div>
          <div
            onClick={() => handleNavigation('/donors')}
            className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer transition-colors"
          >
            <Users className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-sm">New Donor Available</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Blood type O+ donor registered nearby
              </p>
            </div>
          </div>
          <div
            onClick={() => handleNavigation('/requests')}
            className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 cursor-pointer transition-colors"
          >
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-medium text-sm">New Request Created</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                You posted a blood request yesterday
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
