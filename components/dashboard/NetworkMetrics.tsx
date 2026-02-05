"use client";

import {
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
import { Wifi, Signal } from "lucide-react";

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
              {entry.name?.includes('throughput') || entry.name?.includes('Throughput') ? ' Mbps' : ''}
              {entry.name?.includes('TTFB') || entry.name?.includes('ttfb') ? 'ms' : ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Client-Perceived TTFB per Segment
const segmentTTFBData = [
  { segment: "0", ttfb: 45 },
  { segment: "1", ttfb: 38 },
  { segment: "2", ttfb: 42 },
  { segment: "3", ttfb: 52 },
  { segment: "4", ttfb: 48 },
  { segment: "5", ttfb: 35 },
  { segment: "6", ttfb: 41 },
  { segment: "7", ttfb: 46 },
  { segment: "8", ttfb: 39 },
  { segment: "9", ttfb: 44 },
  { segment: "10", ttfb: 50 },
  { segment: "11", ttfb: 43 },
  { segment: "12", ttfb: 37 },
  { segment: "13", ttfb: 40 },
  { segment: "14", ttfb: 49 },
];

// Throughput Over Time
const throughputData = [
  { time: "0s", throughput: 8.2 },
  { time: "30s", throughput: 9.5 },
  { time: "60s", throughput: 11.2 },
  { time: "90s", throughput: 10.8 },
  { time: "120s", throughput: 7.4 },
  { time: "150s", throughput: 9.1 },
  { time: "180s", throughput: 12.3 },
  { time: "210s", throughput: 11.7 },
  { time: "240s", throughput: 10.2 },
  { time: "270s", throughput: 9.8 },
  { time: "300s", throughput: 11.4 },
];

// Connection Waterfall with p50/p95 timing breakdown
const waterfallData = [
  { 
    phase: "DNS Lookup",
    p50: 8,
    p95: 15,
    color: "#8b5cf6",
  },
  { 
    phase: "TCP Connect",
    p50: 12,
    p95: 22,
    color: "#3b82f6",
  },
  { 
    phase: "TLS Handshake",
    p50: 18,
    p95: 32,
    color: "#06b6d4",
  },
  { 
    phase: "TTFB",
    p50: 45,
    p95: 89,
    color: "#f59e0b",
  },
  { 
    phase: "Download",
    p50: 245,
    p95: 412,
    color: "#10b981",
  },
];

// Sample requests for detailed view
const sampleRequests = [
  { resource: "manifest.m3u8", dns: 8, tcp: 12, tls: 18, ttfb: 5, download: 12, total: 55 },
  { resource: "segment-001.ts", dns: 0, tcp: 0, tls: 0, ttfb: 8, download: 245, total: 253 },
  { resource: "segment-002.ts", dns: 0, tcp: 0, tls: 0, ttfb: 6, download: 238, total: 244 },
  { resource: "segment-003.ts", dns: 0, tcp: 0, tls: 0, ttfb: 7, download: 251, total: 258 },
];

// Connection Type Distribution
const connectionTypeData = [
  { name: "WiFi", value: 52.3, color: "#10b981" },
  { name: "4G", value: 31.8, color: "#3b82f6" },
  { name: "3G", value: 12.4, color: "#f59e0b" },
  { name: "2G", value: 3.5, color: "#ef4444" },
];

export default function NetworkMetrics() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100">Network Metrics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client-Perceived TTFB per Segment */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Client-Perceived TTFB per Segment</h3>
            <div className="flex items-center space-x-2">
              <Signal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Last 15 segments</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={segmentTTFBData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-700" />
                <XAxis
                  dataKey="segment"
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                  label={{ value: "Segment #", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                  label={{ value: "TTFB (ms)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                {/* Reference line for acceptable TTFB */}
                <ReferenceLine 
                  y={50} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  label={{ 
                    value: 'Threshold (50ms)', 
                    fill: '#ef4444',
                    fontSize: 12,
                    position: 'right'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ttfb"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="TTFB"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Average TTFB</p>
              <p className="text-lg font-semibold text-zinc-100">43ms</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Min TTFB</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">35ms</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Max TTFB</p>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">52ms</p>
            </div>
          </div>
        </div>

        {/* Throughput Over Time */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Throughput Over Time</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">5 min window</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={throughputData}>
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
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                {/* Reference line for minimum recommended throughput */}
                <ReferenceLine 
                  y={8} 
                  stroke="#f59e0b" 
                  strokeDasharray="5 5"
                  label={{ 
                    value: 'Min (8 Mbps)', 
                    fill: '#f59e0b',
                    fontSize: 12,
                    position: 'right'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="throughput"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  name="Throughput"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Average: <span className="font-semibold text-zinc-100">10.1 Mbps</span>
          </p>
        </div>

        {/* Connection Type Distribution */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Connection Type Distribution</h3>
            <Wifi className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={connectionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {connectionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {connectionTypeData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-zinc-400">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Waterfall Visualization */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Connection Waterfall</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">DNS → TCP → TLS → TTFB → Download</span>
          </div>

          {/* Phase Breakdown with p50/p95 */}
          <div className="space-y-4 mb-8">
            {waterfallData.map((phase, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-zinc-100">{phase.phase}</span>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-zinc-400">
                      p50: <span className="font-semibold text-zinc-100">{phase.p50}ms</span>
                    </span>
                    <span className="text-zinc-400">
                      p95: <span className="font-semibold text-zinc-100">{phase.p95}ms</span>
                    </span>
                  </div>
                </div>
                
                {/* Horizontal bar showing p50 and p95 */}
                <div className="relative h-10 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                  {/* p50 bar */}
                  <div
                    className="absolute h-full flex items-center px-2 text-xs font-medium text-white"
                    style={{ 
                      width: `${(phase.p50 / 450) * 100}%`,
                      backgroundColor: phase.color,
                      opacity: 0.8
                    }}
                  >
                    {phase.p50 > 20 && `p50: ${phase.p50}ms`}
                  </div>
                  
                  {/* p95 indicator */}
                  <div
                    className="absolute h-full border-r-4 border-dashed"
                    style={{ 
                      left: `${(phase.p95 / 450) * 100}%`,
                      borderColor: phase.color
                    }}
                  >
                    <div className="absolute -top-1 -right-8 text-xs font-semibold" style={{ color: phase.color }}>
                      p95
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sample Requests Timeline */}
          <div className="border-t border-zinc-700 pt-6">
            <h4 className="text-sm font-semibold text-zinc-100 mb-4">Sample Request Timeline</h4>
            <div className="space-y-3">
              {sampleRequests.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-zinc-100 font-mono">{item.resource}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.total}ms</span>
                  </div>
                  <div className="flex h-6 rounded overflow-hidden">
                    {item.dns > 0 && (
                      <div
                        className="bg-purple-500 flex items-center justify-center text-xs text-white"
                        style={{ width: `${(item.dns / item.total) * 100}%` }}
                        title={`DNS: ${item.dns}ms`}
                      >
                        {item.dns > 8 && "DNS"}
                      </div>
                    )}
                    {item.tcp > 0 && (
                      <div
                        className="bg-blue-500 flex items-center justify-center text-xs text-white"
                        style={{ width: `${(item.tcp / item.total) * 100}%` }}
                        title={`TCP: ${item.tcp}ms`}
                      >
                        {item.tcp > 10 && "TCP"}
                      </div>
                    )}
                    {item.tls > 0 && (
                      <div
                        className="bg-cyan-500 flex items-center justify-center text-xs text-white"
                        style={{ width: `${(item.tls / item.total) * 100}%` }}
                        title={`TLS: ${item.tls}ms`}
                      >
                        {item.tls > 10 && "TLS"}
                      </div>
                    )}
                    <div
                      className="bg-yellow-500 flex items-center justify-center text-xs text-white"
                      style={{ width: `${(item.ttfb / item.total) * 100}%` }}
                      title={`TTFB: ${item.ttfb}ms`}
                    >
                      {item.ttfb > 5 && "TTFB"}
                    </div>
                    <div
                      className="bg-green-500 flex items-center justify-center text-xs text-white"
                      style={{ width: `${(item.download / item.total) * 100}%` }}
                      title={`Download: ${item.download}ms`}
                    >
                      DL
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-zinc-400">DNS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-zinc-400">TCP</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-500 rounded"></div>
              <span className="text-zinc-400">TLS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-zinc-400">TTFB</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-zinc-400">Download</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
