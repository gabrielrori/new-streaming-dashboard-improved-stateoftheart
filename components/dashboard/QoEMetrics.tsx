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
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { DataSourceBadge } from "@/components/shared/DataSourceBadge";

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

export default function QoEMetrics() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-bold text-zinc-100">Quality of Experience</h2>
        </div>
        <DataSourceBadge source="Video.js VHS" />
      </div>

      {/* TOP ROW: 3 Large Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TTFF p50 */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="text-sm font-medium text-zinc-400">TTFF p50</div>
            <div className="flex items-center gap-1 text-green-400">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs">-8%</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-zinc-100 mb-1">1.2s</div>
          <div className="text-xs text-zinc-500">Time to First Frame (median)</div>
        </div>

        {/* Rebuffer Ratio */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="text-sm font-medium text-zinc-400">Rebuffer Ratio</div>
            <div className="flex items-center gap-1 text-green-400">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs">-12%</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-zinc-100 mb-1">1.2%</div>
          <div className="text-xs text-zinc-500">Percentage of playback time buffering</div>
        </div>

        {/* Startup Failure */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="text-sm font-medium text-zinc-400">Startup Failure</div>
            <div className="flex items-center gap-1 text-red-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">+3%</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-zinc-100 mb-1">0.3%</div>
          <div className="text-xs text-zinc-500">Failed playback attempts</div>
        </div>
      </div>

      {/* MIDDLE: TTFF Distribution (Full Width) */}
      <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">TTFF Distribution</h3>
        <div className="min-h-80">
          <ResponsiveContainer width="100%" height={320}>
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
        <div className="mt-4 flex justify-around text-sm border-t border-zinc-700 pt-4">
          <div className="text-center">
            <p className="text-gray-400">p50</p>
            <p className="font-semibold text-zinc-100">720ms</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">p95</p>
            <p className="font-semibold text-zinc-100">2.1s</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">p99</p>
            <p className="font-semibold text-zinc-100">5.8s</p>
          </div>
        </div>
      </div>

      {/* BOTTOM: 2 Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rebuffer Timeline */}
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Rebuffer Timeline</h3>
          <div className="flex-1">
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
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="line"
                />
                <ReferenceLine 
                  y={2} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  label={{ 
                    value: 'Danger Zone', 
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
        </div>

        {/* Error Breakdown */}
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Error Breakdown</h3>
          <div className="flex-1">
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
                  wrapperStyle={{ paddingTop: '10px' }}
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
        </div>
      </div>
    </div>
  );
}
