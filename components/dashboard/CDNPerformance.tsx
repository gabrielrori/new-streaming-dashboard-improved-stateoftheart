"use client";

import {
  BarChart,
  Bar,
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
} from "recharts";
import { Globe, TrendingDown, TrendingUp } from "lucide-react";
import { DataSourceBadge } from "@/components/shared/DataSourceBadge";

// Cache Status Distribution
const cacheStatusData = [
  { name: "HIT", value: 68.5, color: "#10b981" },
  { name: "MISS", value: 18.2, color: "#f59e0b" },
  { name: "EXPIRED", value: 8.7, color: "#ef4444" },
  { name: "DYNAMIC", value: 4.6, color: "#6b7280" },
];

// Edge TTFB Histogram
const edgeTTFBData = [
  { range: "<10ms", count: 3200 },
  { range: "10-20ms", count: 4800 },
  { range: "20-50ms", count: 3600 },
  { range: "50-100ms", count: 1200 },
  { range: "100-200ms", count: 480 },
  { range: ">200ms", count: 120 },
];

// Bandwidth Over Time
const bandwidthData = [
  { time: "00:00", bandwidth: 2.4 },
  { time: "04:00", bandwidth: 2.8 },
  { time: "08:00", bandwidth: 3.9 },
  { time: "12:00", bandwidth: 5.2 },
  { time: "16:00", bandwidth: 6.8 },
  { time: "20:00", bandwidth: 5.4 },
  { time: "24:00", bandwidth: 3.6 },
];

// Sparkline data for stat cards
const sparklineData = [
  { value: 65 },
  { value: 67 },
  { value: 66 },
  { value: 68 },
  { value: 69 },
  { value: 68.5 },
];

const ttfbSparklineData = [
  { value: 22 },
  { value: 20 },
  { value: 19 },
  { value: 18 },
  { value: 17 },
  { value: 18 },
];

const originSparklineData = [
  { value: 95 },
  { value: 92 },
  { value: 88 },
  { value: 85 },
  { value: 83 },
  { value: 82 },
];

const errorSparklineData = [
  { value: 0.8 },
  { value: 0.7 },
  { value: 0.6 },
  { value: 0.5 },
  { value: 0.52 },
  { value: 0.51 },
];

export default function CDNPerformance() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="w-7 h-7 text-orange-400" />
          <h2 className="text-2xl font-bold text-zinc-100">CDN Performance</h2>
        </div>
        <DataSourceBadge source="Cloudflare Logpush" />
      </div>

      {/* TOP: 4 Stat Cards with Sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cache Hit Rate */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs font-medium text-zinc-400">Cache Hit Rate</div>
            <div className="flex items-center gap-1 text-green-400">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">+2.5%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-zinc-100 mb-2">68.5%</div>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Edge TTFB */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs font-medium text-zinc-400">Edge TTFB</div>
            <div className="flex items-center gap-1 text-green-400">
              <TrendingDown className="w-3 h-3" />
              <span className="text-xs">-18%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-zinc-100 mb-2">18ms</div>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ttfbSparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Origin TTFB */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs font-medium text-zinc-400">Origin TTFB</div>
            <div className="flex items-center gap-1 text-green-400">
              <TrendingDown className="w-3 h-3" />
              <span className="text-xs">-14%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-zinc-100 mb-2">82ms</div>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={originSparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Rate */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs font-medium text-zinc-400">Error Rate</div>
            <div className="flex items-center gap-1 text-green-400">
              <TrendingDown className="w-3 h-3" />
              <span className="text-xs">-36%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-zinc-100 mb-2">0.51%</div>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={errorSparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MIDDLE: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cache Status Distribution */}
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Cache Status</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cacheStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cacheStatusData.map((entry, index) => (
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
        </div>

        {/* TTFB Histogram */}
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">TTFB Histogram</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={edgeTTFBData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-700" />
                <XAxis
                  dataKey="range"
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: "currentColor" }} className="text-zinc-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM: Bandwidth Timeline (Full Width) */}
      <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">Bandwidth Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bandwidthData}>
              <defs>
                <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
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
                label={{ value: "Gbps", angle: -90, position: "insideLeft" }}
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
                dataKey="bandwidth"
                stroke="#f97316"
                fillOpacity={1}
                fill="url(#colorBandwidth)"
                name="Bandwidth"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-around text-sm border-t border-zinc-700 pt-4">
          <div className="text-center">
            <p className="text-gray-400">Peak</p>
            <p className="font-semibold text-zinc-100">6.8 Gbps</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Average</p>
            <p className="font-semibold text-zinc-100">4.2 Gbps</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Total (24h)</p>
            <p className="font-semibold text-zinc-100">362 TB</p>
          </div>
        </div>
      </div>

      {/* Geographic Distribution Map */}
      <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-100">Geographic Distribution</h3>
        </div>
        
        {/* Simple World Map */}
        <div className="relative h-96 bg-gray-900/50 rounded-lg p-4 border border-zinc-700/30">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            {/* US - 45% */}
            <g className="cursor-pointer group" data-region="US">
              <rect x="100" y="150" width="180" height="150" rx="8" 
                className="fill-orange-600 opacity-90 hover:opacity-100 transition-opacity" />
              <text x="190" y="215" className="text-3xl font-bold fill-white text-center" textAnchor="middle">US</text>
              <text x="190" y="245" className="text-xl fill-white text-center" textAnchor="middle">45%</text>
            </g>
            
            {/* EU - 30% */}
            <g className="cursor-pointer group" data-region="EU">
              <rect x="450" y="120" width="150" height="140" rx="8" 
                className="fill-orange-500 opacity-75 hover:opacity-100 transition-opacity" />
              <text x="525" y="180" className="text-3xl font-bold fill-white text-center" textAnchor="middle">EU</text>
              <text x="525" y="210" className="text-xl fill-white text-center" textAnchor="middle">30%</text>
            </g>
            
            {/* LATAM - 15% */}
            <g className="cursor-pointer group" data-region="LATAM">
              <rect x="220" y="320" width="130" height="120" rx="8" 
                className="fill-orange-400 opacity-60 hover:opacity-100 transition-opacity" />
              <text x="285" y="370" className="text-2xl font-bold fill-white text-center" textAnchor="middle">LATAM</text>
              <text x="285" y="400" className="text-lg fill-white text-center" textAnchor="middle">15%</text>
            </g>
            
            {/* APAC - 10% */}
            <g className="cursor-pointer group" data-region="APAC">
              <rect x="720" y="200" width="140" height="120" rx="8" 
                className="fill-orange-300 opacity-50 hover:opacity-100 transition-opacity" />
              <text x="790" y="250" className="text-2xl font-bold fill-white text-center" textAnchor="middle">APAC</text>
              <text x="790" y="280" className="text-lg fill-white text-center" textAnchor="middle">10%</text>
            </g>
            
            {/* Decorative map elements */}
            <circle cx="190" cy="225" r="60" className="fill-orange-600 opacity-20" />
            <circle cx="525" cy="190" r="55" className="fill-orange-500 opacity-20" />
            <circle cx="285" cy="380" r="45" className="fill-orange-400 opacity-20" />
            <circle cx="790" cy="260" r="50" className="fill-orange-300 opacity-20" />
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg border border-zinc-700/30">
            <div className="w-4 h-4 rounded bg-orange-600"></div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">US</div>
              <div className="text-xs text-zinc-400">45% viewers</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg border border-zinc-700/30">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">EU</div>
              <div className="text-xs text-zinc-400">30% viewers</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg border border-zinc-700/30">
            <div className="w-4 h-4 rounded bg-orange-400"></div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">LATAM</div>
              <div className="text-xs text-zinc-400">15% viewers</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg border border-zinc-700/30">
            <div className="w-4 h-4 rounded bg-orange-300"></div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">APAC</div>
              <div className="text-xs text-zinc-400">10% viewers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
