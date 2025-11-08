'use client';

import { useAuth } from '../../context/authInfo';
import { useEffect, useState } from 'react';
import {
  Heart,
  Users,
  MapPin,
  Droplets,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    livesImpacted: 0,
    nearbyRequests: 0,
    nearbyDonors: 0,
    upcomingAppointments: 0,
    emergencyAlerts: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      // Replace with actual API calls
      setStats({
        totalDonations: 8,
        livesImpacted: 24,
        nearbyRequests: 2,
        nearbyDonors: 3,
        upcomingAppointments: 1,
        emergencyAlerts: 1,
      });
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Donations',
      value: stats.totalDonations,
      color: 'red',
      icon: Droplets,
      description: 'Lifetime donations',
    },
    {
      label: 'Lives Impacted',
      value: stats.livesImpacted,
      color: 'green',
      icon: Heart,
      description: "People you've helped",
    },
    {
      label: 'Nearby Requests',
      value: stats.nearbyRequests,
      color: 'orange',
      icon: AlertCircle,
      description: 'Within 10km radius',
    },
    {
      label: 'Nearby Donors',
      value: stats.nearbyDonors,
      color: 'blue',
      icon: Users,
      description: 'Available in your area',
    },
    {
      label: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      color: 'purple',
      icon: Calendar,
      description: 'Scheduled donations',
    },
    {
      label: 'Emergency Alerts',
      value: stats.emergencyAlerts,
      color: 'yellow',
      icon: AlertCircle,
      description: 'Urgent needs',
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
      yellow:
        'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'Donor'}! 👋
        </h1>
        <p className="text-red-100 opacity-90">
          Ready to save lives today? Check nearby blood requests or schedule
          your next donation.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <span className="text-sm font-medium">Find Requests</span>
          </div>
        </button>
        <button className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="text-center">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <span className="text-sm font-medium">Schedule</span>
          </div>
        </button>
        <button className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="text-center">
            <Heart className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <span className="text-sm font-medium">My Impact</span>
          </div>
        </button>
        <button className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="text-center">
            <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <span className="text-sm font-medium">Community</span>
          </div>
        </button>
      </div>

      {/* Statistics Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Your Impact Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map(({ label, value, color, icon: Icon, description }) => (
            <div
              key={label}
              className={`rounded-2xl shadow-sm p-6 bg-white dark:bg-gray-800 border-l-4 ${getColorClasses(color)} transition-transform hover:scale-105 duration-200`}
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
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Heart className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-sm">Donation Completed</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                2 days ago at City Blood Bank
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Users className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-sm">New Request Nearby</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Blood type O+ needed within 5km
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
