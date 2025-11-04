'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Users, CreditCard } from 'lucide-react';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, boolean>;
  timestamp: string;
}

interface MetricCard {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'yellow' | 'red';
}

export function MonitoringDashboard() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthStatus();
    const interval = setInterval(fetchHealthStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      console.error('Failed to fetch health status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'unhealthy':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'unhealthy':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Mock metrics - in production, these would come from your analytics service
  const metrics: MetricCard[] = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: <Users className="w-6 h-6" />,
      color: 'blue',
    },
    {
      title: 'Premium Conversions',
      value: '89',
      change: '+23%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'green',
    },
    {
      title: 'Revenue (30d)',
      value: '€1,780',
      change: '+18%',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'green',
    },
    {
      title: 'Auth Success Rate',
      value: '98.5%',
      change: '+0.2%',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'green',
    },
  ];

  const getMetricColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-50';
      case 'blue':
        return 'text-blue-600 bg-blue-50';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50';
      case 'red':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Monitoring</h1>
        <p className="text-gray-600">Real-time system health and performance metrics</p>
      </div>

      {/* System Health Status */}
      <div className="mb-8">
        <div className={`p-4 rounded-lg border ${healthStatus ? getStatusColor(healthStatus.status) : 'text-gray-600 bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {healthStatus ? getStatusIcon(healthStatus.status) : <AlertCircle className="w-5 h-5 text-gray-500" />}
              <div>
                <h3 className="font-semibold">
                  System Status: {healthStatus?.status ? healthStatus.status.charAt(0).toUpperCase() + healthStatus.status.slice(1) : 'Unknown'}
                </h3>
                <p className="text-sm opacity-75">
                  Last checked: {healthStatus?.timestamp ? new Date(healthStatus.timestamp).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>
            <button
              onClick={fetchHealthStatus}
              className="px-3 py-1 text-sm bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
            >
              Refresh
            </button>
          </div>

          {healthStatus?.checks && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(healthStatus.checks).map(([service, status]) => (
                <div key={service} className="flex items-center space-x-2">
                  {status ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm capitalize">{service.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${getMetricColor(metric.color)}`}>
                {metric.icon}
              </div>
              {metric.change && (
                <span className="text-sm text-green-600 font-medium">
                  {metric.change}
                </span>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">User registration successful</span>
            <span className="text-gray-400">2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Payment processed successfully</span>
            <span className="text-gray-400">5 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Rate limit triggered for user</span>
            <span className="text-gray-400">12 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}