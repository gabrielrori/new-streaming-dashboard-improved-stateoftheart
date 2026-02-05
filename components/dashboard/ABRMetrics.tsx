"use client";

import { useMemo, useEffect, useRef } from "react";
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
import { ArrowUp, ArrowDown } from "lucide-react";
import { generateABRMetrics } from "@/lib/mock-data/abr";
import { DataSourceBadge } from "@/components/shared/DataSourceBadge";

export default function ABRMetrics() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Generate mock data
  const abrData = useMemo(() => generateABRMetrics(1440), []);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Transform data for charts
  const bitrateData = abrData.bitrateHistory
    .filter((_, i) => i % 60 === 0) // Sample every 60 points
    .slice(-24) // Last 24 hours
    .map((point) => ({
      time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      bitrate: point.value,
    }));

  const qualitySwitches = [
    { time: 0, from: "720p", to: "1080p", direction: "up" },
    { time: 15, from: "1080p", to: "720p", direction: "down" },
    { time: 45, from: "720p", to: "1080p", direction: "up" },
    { time: 78, from: "1080p", to: "4K", direction: "up" },
    { time: 112, from: "4K", to: "1080p", direction: "down" },
    { time: 156, from: "1080p", to: "1440p", direction: "up" },
  ];

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

  const throughputData = bitrateData.map(d => ({
    time: d.time,
    estimated: d.bitrate * 1.05,
    actual: d.bitrate,
  }));

  return (
    <div ref={sectionRef} className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-100">Adaptive Bitrate Metrics</h2>
        <DataSourceBadge source="Video.js VHS" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bitrate Over Time */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700 lg:col-span-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Bitrate Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bitrateData}>
                <defs>
                  <linearGradient id="colorBitrate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
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
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area type="monotone" dataKey="bitrate" stroke="#3b82f6" fill="url(#colorBitrate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-around text-sm">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Current</p>
              <p className="font-semibold text-zinc-100">{abrData.currentBitrateMbps} Mbps</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Average</p>
              <p className="font-semibold text-zinc-100">{abrData.averageBitrateMbps} Mbps</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Switches</p>
              <p className="font-semibold text-zinc-100">{abrData.switchCount}</p>
            </div>
          </div>
        </div>

        {/* Quality Switch Timeline */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Quality Switch Timeline</h3>
          <div className="space-y-3 h-80 overflow-y-auto">
            {qualitySwitches.map((sw, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    sw.direction === "up" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                  }`}>
                    {sw.direction === "up" ? (
                      <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      {sw.from} → {sw.to}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sw.time}s into playback</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  sw.direction === "up"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}>
                  {sw.direction === "up" ? "Upgrade" : "Downgrade"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-700">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Upshifts / Downshifts</span>
              <span className="font-medium text-zinc-100">{abrData.upshifts} / {abrData.downshifts}</span>
            </div>
          </div>
        </div>

        {/* Time at Quality Level */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Time at Quality Level</h3>
          <div className="h-80 flex items-center justify-center">
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
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Buffer Health Timeline */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Buffer Health Timeline</h3>
          <div className="h-72">
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
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <ReferenceLine y={2} stroke="#ef4444" strokeDasharray="3 3" label="Danger Zone" />
                <Line type="monotone" dataKey="buffer" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-zinc-400">Buffer &lt; 2s = Danger Zone</span>
          </div>
        </div>

        {/* Throughput Estimation */}
        <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Throughput Estimation</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={throughputData.slice(-12)}>
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
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="estimated" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Estimation Accuracy: <span className="font-semibold text-zinc-100">94.2%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
