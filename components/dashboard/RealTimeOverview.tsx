"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Eye, Activity, Radio, AlertTriangle } from "lucide-react";
import { useRealtimeData, randomVariation, clamp } from "@/lib/hooks/useRealtimeData";

const alerts = [
  { id: 1, severity: "critical", message: "High rebuffer rate on stream-042", time: "2m ago" },
  { id: 2, severity: "warning", message: "CDN cache hit ratio below threshold", time: "5m ago" },
  { id: 3, severity: "info", message: "Bitrate optimization triggered", time: "12m ago" },
];

export default function RealTimeOverview() {
  // Real-time concurrent viewers with sparkline data
  const { data: viewersData } = useRealtimeData({
    initialValue: {
      current: 47200,
      sparkline: [
        { value: 42000 },
        { value: 43500 },
        { value: 45000 },
        { value: 44200 },
        { value: 46800 },
        { value: 47200 },
      ],
      change: 8.3,
    },
    updateInterval: 5000,
    generateUpdate: (current) => {
      const newValue = Math.round(randomVariation(current.current, 1000));
      const clampedValue = clamp(newValue, 40000, 50000);
      const newSparkline = [...current.sparkline.slice(1), { value: clampedValue }];
      const oldValue = current.sparkline[0].value;
      const change = ((clampedValue - oldValue) / oldValue) * 100;
      
      return {
        current: clampedValue,
        sparkline: newSparkline,
        change: parseFloat(change.toFixed(1)),
      };
    },
  });

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Concurrent Viewers */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700 relative overflow-hidden">
          {/* Live Indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">LIVE</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Concurrent Viewers</p>
            <p className="text-3xl font-bold text-zinc-100 transition-all duration-500">
              {(viewersData.current / 1000).toFixed(1)}K
            </p>
            <div className="h-12 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewersData.sparkline}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className={`text-xs transition-colors duration-300 ${
              viewersData.change >= 0 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            }`}>
              {viewersData.change >= 0 ? '+' : ''}{viewersData.change}% from last hour
            </p>
          </div>
        </div>

        {/* Global QoE Score */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Global QoE Score</p>
            <div className="flex items-center justify-center my-4">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - 87 / 100)}`}
                    className="text-green-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-zinc-100">87</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-zinc-400">out of 100</p>
          </div>
        </div>

        {/* Active Streams */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Radio className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Active Streams</p>
            <p className="text-3xl font-bold text-zinc-100">156</p>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Live</span>
                <span className="font-medium text-zinc-100">142</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">VOD</span>
                <span className="font-medium text-zinc-100">14</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Active Alerts</p>
            <p className="text-3xl font-bold text-zinc-100">3</p>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-xs">
                <span className="text-red-600 dark:text-red-400">Critical</span>
                <span className="font-medium text-zinc-100">1</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-yellow-600 dark:text-yellow-400">Warning</span>
                <span className="font-medium text-zinc-100">1</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-600 dark:text-blue-400">Info</span>
                <span className="font-medium text-zinc-100">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="bg-zinc-800 rounded-lg shadow-lg border border-zinc-700">
        <div className="px-6 py-4 border-b border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-100">Recent Alerts</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {alerts.map((alert) => (
            <div key={alert.id} className="px-6 py-4 flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${
                alert.severity === "critical" ? "bg-red-100 dark:bg-red-900" :
                alert.severity === "warning" ? "bg-yellow-100 dark:bg-yellow-900" :
                "bg-blue-100 dark:bg-blue-900"
              }`}>
                <AlertTriangle className={`w-4 h-4 ${
                  alert.severity === "critical" ? "text-red-600 dark:text-red-400" :
                  alert.severity === "warning" ? "text-yellow-600 dark:text-yellow-400" :
                  "text-blue-600 dark:text-blue-400"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100">{alert.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.time}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                alert.severity === "critical" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                alert.severity === "warning" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              }`}>
                {alert.severity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
