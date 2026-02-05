"use client";

import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts";

// Custom Tooltip Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-white/20 rounded-lg p-3 shadow-xl backdrop-blur-sm">
        <p className="text-sm font-semibold text-white mb-2">{label}</p>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="font-semibold text-white">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              {entry.name?.includes('Ratio') ? '%' : entry.name?.includes('TTFF') ? '' : ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// TTFF Distribution Data
const ttffData = [
  { range: "<500ms", count: 1240, percentile: "" },
  { range: "500-1s", count: 2180, percentile: "p50: 720ms" },
  { range: "1-2s", count: 1680, percentile: "" },
  { range: "2-3s", count: 420, percentile: "p95: 2.1s" },
  { range: "3-5s", count: 180, percentile: "" },
  { range: ">5s", count: 65, percentile: "p99: 5.8s" },
];

// Rebuffer Ratio Over Time
const rebufferData = [
  { time: "00:00", ratio: 0.8 },
  { time: "04:00", ratio: 1.2 },
  { time: "08:00", ratio: 0.9 },
  { time: "12:00", ratio: 1.5 },
  { time: "16:00", ratio: 2.1 },
  { time: "20:00", ratio: 1.7 },
  { time: "24:00", ratio: 1.3 },
];

// Player Error Breakdown
const errorData = [
  { type: "Network", count: 245, color: "#ef4444" },
  { type: "Decode", count: 89, color: "#f59e0b" },
  { type: "MSE", count: 34, color: "#8b5cf6" },
  { type: "Other", count: 12, color: "#6b7280" },
];

// Seek Latency Distribution
const seekLatencyData = [
  { range: "<100ms", count: 3200 },
  { range: "100-200ms", count: 4500 },
  { range: "200-500ms", count: 2100 },
  { range: "500ms-1s", count: 680 },
  { range: ">1s", count: 220 },
];

export default function QoEMetrics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-100">Quality of Experience Metrics</h2>
        <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
          Video.js VHS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TTFF Distribution */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">TTFF Distribution</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Video.js VHS</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ttffData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-700" />
                <XAxis
                  dataKey="range"
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                />
                <YAxis tick={{ fill: "currentColor" }} className="text-zinc-400" />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-around text-sm">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">p50</p>
              <p className="font-semibold text-zinc-100">720ms</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">p95</p>
              <p className="font-semibold text-zinc-100">2.1s</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">p99</p>
              <p className="font-semibold text-zinc-100">5.8s</p>
            </div>
          </div>
        </div>

        {/* Rebuffer Ratio Over Time */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Rebuffer Ratio Over Time</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Video.js VHS</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rebufferData}>
                <defs>
                  <linearGradient id="colorRebuffer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-700" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                />
                <YAxis
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                  label={{ value: "%", angle: -90, position: "insideLeft" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                {/* Reference line for danger zone threshold */}
                <ReferenceLine 
                  y={2} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  label={{ 
                    value: 'Danger Zone (>2%)', 
                    fill: '#ef4444',
                    fontSize: 12,
                    position: 'right'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ratio"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorRebuffer)"
                  name="Rebuffer Ratio"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <p className="text-zinc-400">
              Average: <span className="font-semibold text-zinc-100">1.36%</span>
            </p>
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              Below threshold
            </span>
          </div>
        </div>

        {/* Startup Failure Rate */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Startup Failure Rate</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Video.js VHS</span>
          </div>
          <div className="flex items-center justify-center h-72">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - 2.3 / 100)}`}
                  className="text-green-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-zinc-100">2.3%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">Failure Rate</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Total Attempts</span>
              <span className="font-medium text-zinc-100">12,456</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Failed</span>
              <span className="font-medium text-red-600 dark:text-red-400">287</span>
            </div>
          </div>
        </div>

        {/* Player Error Breakdown */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Player Error Breakdown</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Video.js VHS</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-700" />
                <XAxis type="number" tick={{ fill: "currentColor" }} className="text-zinc-400" />
                <YAxis
                  type="category"
                  dataKey="type"
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="square"
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Error Count">
                  {errorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Total Errors: <span className="font-semibold text-zinc-100">380</span>
          </p>
        </div>

        {/* Seek Latency Distribution */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Seek Latency Distribution</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Video.js VHS</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seekLatencyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-700" />
                <XAxis
                  dataKey="range"
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                />
                <YAxis tick={{ fill: "currentColor" }} className="text-zinc-400" />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Seeks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Median Seek Latency: <span className="font-semibold text-zinc-100">180ms</span>
          </p>
        </div>
      </div>
    </div>
  );
}
