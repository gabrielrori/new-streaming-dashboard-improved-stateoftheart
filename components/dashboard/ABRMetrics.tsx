"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts";
import { Activity } from "lucide-react";
import { generateABRMetrics } from "@/lib/mock-data/abr";
import { DataSourceBadge } from "@/components/shared/DataSourceBadge";

export default function ABRMetrics() {
  // Generate mock data
  const abrData = useMemo(() => generateABRMetrics(1440), []);

  // Transform data for charts
  const bitrateData = abrData.bitrateHistory
    .filter((_, i) => i % 60 === 0) // Sample every 60 points
    .slice(-24) // Last 24 hours
    .map((point) => ({
      time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      bitrate: point.value,
      '1080p': point.value > 4 ? point.value * 0.7 : 0,
      '720p': point.value > 2 && point.value <= 4 ? point.value * 0.8 : point.value > 4 ? point.value * 0.2 : 0,
      '480p': point.value <= 2 ? point.value : point.value * 0.1,
    }));

  const qualityTimeData = [
    { name: "1080p", value: abrData.distribution['1080p'], color: "#10b981" },
    { name: "720p", value: abrData.distribution['720p'], color: "#f59e0b" },
    { name: "480p", value: abrData.distribution['480p'], color: "#ef4444" },
  ];

  const bufferData = [
    { time: "0s", buffer: 8.2 },
    { time: "30s", buffer: 6.5 },
    { time: "60s", buffer: 7.8 },
    { time: "90s", buffer: 4.2 },
    { time: "120s", buffer: 1.8 },
    { time: "150s", buffer: 5.4 },
    { time: "180s", buffer: 7.1 },
    { time: "210s", buffer: 8.5 },
    { time: "240s", buffer: 6.9 },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-bold text-zinc-100">Adaptive Bitrate Metrics</h2>
        </div>
        <DataSourceBadge source="Video.js VHS" />
      </div>

      {/* TOP: 4 Mini Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Bitrate */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-4">
          <div className="text-xs font-medium text-zinc-400 mb-2">Current Bitrate</div>
          <div className="text-2xl font-bold text-zinc-100">{abrData.currentBitrateMbps}</div>
          <div className="text-xs text-zinc-500 mt-1">Mbps</div>
        </div>

        {/* Avg Quality Level */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-4">
          <div className="text-xs font-medium text-zinc-400 mb-2">Avg Quality Level</div>
          <div className="text-2xl font-bold text-zinc-100">1080p</div>
          <div className="text-xs text-zinc-500 mt-1">{abrData.distribution['1080p']}% of time</div>
        </div>

        {/* Switch Rate */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-4">
          <div className="text-xs font-medium text-zinc-400 mb-2">Switch Rate</div>
          <div className="text-2xl font-bold text-zinc-100">2.4</div>
          <div className="text-xs text-zinc-500 mt-1">/min</div>
        </div>

        {/* Buffer Health */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-4">
          <div className="text-xs font-medium text-zinc-400 mb-2">Buffer Health</div>
          <div className="text-2xl font-bold text-green-400">6.8</div>
          <div className="text-xs text-zinc-500 mt-1">seconds</div>
        </div>
      </div>

      {/* MAIN: Bitrate Over Time (Full Width, Prominent) */}
      <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">Bitrate Over Time</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bitrateData}>
              <defs>
                <linearGradient id="color1080p" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="color720p" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="color480p" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
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
                label={{ value: "Mbps", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Area 
                type="monotone" 
                dataKey="1080p" 
                stackId="1"
                stroke="#10b981" 
                fill="url(#color1080p)" 
                name="1080p"
              />
              <Area 
                type="monotone" 
                dataKey="720p" 
                stackId="1"
                stroke="#f59e0b" 
                fill="url(#color720p)" 
                name="720p"
              />
              <Area 
                type="monotone" 
                dataKey="480p" 
                stackId="1"
                stroke="#ef4444" 
                fill="url(#color480p)" 
                name="480p"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-around text-sm border-t border-zinc-700 pt-4">
          <div className="text-center">
            <p className="text-gray-400">Current</p>
            <p className="font-semibold text-zinc-100">{abrData.currentBitrateMbps} Mbps</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Average</p>
            <p className="font-semibold text-zinc-100">{abrData.averageBitrateMbps} Mbps</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Switches</p>
            <p className="font-semibold text-zinc-100">{abrData.switchCount}</p>
          </div>
        </div>
      </div>

      {/* BOTTOM: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Distribution */}
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Quality Distribution</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityTimeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {qualityTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-700">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Upshifts / Downshifts</span>
              <span className="font-medium text-zinc-100">{abrData.upshifts} / {abrData.downshifts}</span>
            </div>
          </div>
        </div>

        {/* Buffer Health Timeline */}
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Buffer Health Timeline</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bufferData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-700" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                />
                <YAxis
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                  label={{ value: "Buffer (s)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <ReferenceLine 
                  y={2} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3" 
                  label={{ value: "Danger Zone", fill: "#ef4444", fontSize: 12 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="buffer" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  name="Buffer"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
