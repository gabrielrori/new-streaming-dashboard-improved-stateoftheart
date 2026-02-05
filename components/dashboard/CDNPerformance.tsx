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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Globe } from "lucide-react";

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

// Origin Response Time Breakdown
const originResponseData = [
  { time: "00:00", dns: 8, tcp: 12, tls: 18, response: 45 },
  { time: "04:00", dns: 7, tcp: 11, tls: 17, response: 42 },
  { time: "08:00", dns: 9, tcp: 13, tls: 19, response: 48 },
  { time: "12:00", dns: 6, tcp: 10, tls: 16, response: 38 },
  { time: "16:00", dns: 8, tcp: 12, tls: 18, response: 44 },
  { time: "20:00", dns: 7, tcp: 11, tls: 17, response: 41 },
  { time: "24:00", dns: 8, tcp: 12, tls: 18, response: 43 },
];

// HTTP Error Rates by Content Type
const errorRateData = [
  { type: ".ts segments", errors: 234, requests: 45600, rate: 0.51 },
  { type: ".m3u8 manifest", errors: 12, requests: 8900, rate: 0.13 },
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

// Geographic Distribution - using static SVG visualization below
// const geoData = [
//   { region: "North America", requests: 45200, hitRate: 72.3 },
//   { region: "Europe", requests: 38600, hitRate: 68.9 },
//   { region: "Asia Pacific", requests: 29400, hitRate: 65.4 },
//   { region: "South America", requests: 8900, hitRate: 61.2 },
//   { region: "Africa", requests: 4200, hitRate: 58.7 },
// ];

export default function CDNPerformance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-100">CDN Performance</h2>
        <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full">
          Cloudflare Logpush
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cache Status Distribution */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Cache Status Distribution</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Cloudflare Logpush</span>
          </div>
          <div className="h-72 flex items-center justify-center">
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
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {cacheStatusData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-zinc-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Edge TTFB Histogram */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Edge TTFB Distribution</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Cloudflare Logpush</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={edgeTTFBData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-700" />
                <XAxis
                  dataKey="range"
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                />
                <YAxis tick={{ fill: "currentColor" }} className="text-zinc-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Median TTFB: <span className="font-semibold text-zinc-100">18ms</span>
          </p>
        </div>

        {/* Origin Response Time Breakdown */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Origin Response Time Breakdown</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Cloudflare Logpush</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={originResponseData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-700" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                />
                <YAxis
                  tick={{ fill: "currentColor" }}
                  className="text-zinc-400"
                  label={{ value: "Time (ms)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="dns" stackId="a" fill="#8b5cf6" name="DNS" />
                <Bar dataKey="tcp" stackId="a" fill="#3b82f6" name="TCP" />
                <Bar dataKey="tls" stackId="a" fill="#10b981" name="TLS" />
                <Bar dataKey="response" stackId="a" fill="#f59e0b" name="Response" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Average Total Time: <span className="font-semibold text-zinc-100">83ms</span>
          </p>
        </div>

        {/* HTTP Error Rates by Content Type */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">HTTP Error Rates</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Cloudflare Logpush</span>
          </div>
          <div className="space-y-4">
            {errorRateData.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-zinc-100">{item.type}</span>
                  <span className={`text-sm font-bold ${
                    item.rate > 0.5 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                  }`}>
                    {item.rate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.rate > 0.5 ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(item.rate * 20, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{item.errors.toLocaleString()} errors</span>
                  <span>{item.requests.toLocaleString()} requests</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> .ts segments have higher error rates due to client-side issues and network interruptions.
            </p>
          </div>
        </div>

        {/* Bandwidth Over Time */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Bandwidth Over Time</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Cloudflare Logpush</span>
          </div>
          <div className="h-72">
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
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bandwidth"
                  stroke="#f97316"
                  fillOpacity={1}
                  fill="url(#colorBandwidth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Peak Bandwidth: <span className="font-semibold text-zinc-100">6.8 Gbps</span>
          </p>
        </div>

        {/* Geographic Distribution Map */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-100">Geographic Distribution</h3>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Cloudflare Logpush</span>
            </div>
          </div>
          
          {/* Simple World Map */}
          <div className="relative h-96 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
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
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="w-4 h-4 rounded bg-orange-600"></div>
              <div>
                <div className="text-sm font-semibold text-zinc-100">US</div>
                <div className="text-xs text-zinc-400">45% viewers</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <div>
                <div className="text-sm font-semibold text-zinc-100">EU</div>
                <div className="text-xs text-zinc-400">30% viewers</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="w-4 h-4 rounded bg-orange-400"></div>
              <div>
                <div className="text-sm font-semibold text-zinc-100">LATAM</div>
                <div className="text-xs text-zinc-400">15% viewers</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="w-4 h-4 rounded bg-orange-300"></div>
              <div>
                <div className="text-sm font-semibold text-zinc-100">APAC</div>
                <div className="text-xs text-zinc-400">10% viewers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
