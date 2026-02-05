"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Eye, Activity, Radio, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useRealtimeData, randomVariation, clamp } from "@/lib/hooks/useRealtimeData";
import CountUp from "react-countup";

const alerts = [
  { id: 1, severity: "critical", message: "High rebuffer rate on stream-042", time: "2m ago", icon: AlertTriangle },
  { id: 2, severity: "critical", message: "CDN node failure detected - EU-West-1", time: "3m ago", icon: AlertTriangle },
  { id: 3, severity: "critical", message: "Bitrate spike detected on HLS streams", time: "4m ago", icon: AlertTriangle },
  { id: 4, severity: "warning", message: "CDN cache hit ratio below threshold", time: "5m ago", icon: AlertTriangle },
  { id: 5, severity: "warning", message: "Increased latency on US-East endpoints", time: "8m ago", icon: AlertTriangle },
  { id: 6, severity: "info", message: "Bitrate optimization triggered", time: "12m ago", icon: Activity },
  { id: 7, severity: "info", message: "Auto-scaling initiated for traffic spike", time: "15m ago", icon: Activity },
];

export default function RealTimeOverview() {
  // Real-time concurrent viewers with sparkline data (30 points)
  const { data: viewersData } = useRealtimeData({
    initialValue: {
      current: 47200,
      sparkline: Array.from({ length: 30 }, (_, i) => ({
        value: 42000 + Math.random() * 5000 + i * 100,
      })),
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

  // Real-time QoE score
  const { data: qoeData } = useRealtimeData({
    initialValue: { score: 87 },
    updateInterval: 8000,
    generateUpdate: (current) => ({
      score: clamp(Math.round(randomVariation(current.score, 3)), 75, 95),
    }),
  });

  // Real-time active streams
  const { data: streamsData } = useRealtimeData({
    initialValue: { total: 156, live: 142, vod: 14 },
    updateInterval: 6000,
    generateUpdate: (current) => {
      const newTotal = clamp(Math.round(randomVariation(current.total, 5)), 140, 170);
      const newLive = Math.round(newTotal * 0.91);
      return {
        total: newTotal,
        live: newLive,
        vod: newTotal - newLive,
      };
    },
  });

  const getQoEColor = (score: number) => {
    if (score > 80) return { text: "text-emerald-400", stroke: "#10b981", gradient: "from-emerald-400 to-emerald-600" };
    if (score >= 60) return { text: "text-amber-400", stroke: "#f59e0b", gradient: "from-amber-400 to-amber-600" };
    return { text: "text-rose-400", stroke: "#f43f5e", gradient: "from-rose-400 to-rose-600" };
  };

  const qoeColor = getQoEColor(qoeData.score);

  return (
    <div className="space-y-6">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-950 to-transparent p-8">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            animation: 'drift 20s linear infinite',
          }} />
        </div>
        
        {/* Hero Cards Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. CONCURRENT VIEWERS */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-2xl hover:bg-white/10 transition-all duration-300">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative space-y-4">
              {/* Live Pulse Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Live</span>
                </div>
                <Eye className="w-5 h-5 text-blue-400 opacity-60" />
              </div>

              {/* Label */}
              <p className="text-sm font-medium text-zinc-400">Concurrent Viewers</p>

              {/* Massive Number with CountUp */}
              <div className="text-6xl font-black text-zinc-100 tracking-tight">
                <CountUp
                  end={viewersData.current}
                  duration={2}
                  separator=","
                  preserveValue
                  useEasing
                />
              </div>

              {/* Sparkline */}
              <div className="h-16 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewersData.sparkline}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#60a5fa"
                      strokeWidth={2.5}
                      dot={false}
                      animationDuration={800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Delta Badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                viewersData.change >= 0
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}>
                {viewersData.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{viewersData.change >= 0 ? '+' : ''}{viewersData.change}% vs last hour</span>
              </div>
            </div>
          </div>

          {/* 2. GLOBAL QoE SCORE */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-2xl hover:bg-white/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-400">Global QoE Score</p>
                <Activity className="w-5 h-5 text-emerald-400 opacity-60" />
              </div>

              {/* Circular Progress Gauge with Gradient */}
              <div className="flex items-center justify-center py-2">
                <div className="relative w-40 h-40">
                  <svg className="transform -rotate-90 w-40 h-40" viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id="qoeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className={qoeColor.gradient.split(' ')[0].replace('from-', '')} stopColor={qoeColor.stroke} />
                        <stop offset="100%" className={qoeColor.gradient.split(' ')[1].replace('to-', '')} stopColor={qoeColor.stroke} stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                    {/* Background circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-zinc-700/50"
                    />
                    {/* Progress circle with gradient */}
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#qoeGradient)"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - qoeData.score / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))',
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-black ${qoeColor.text}`}>
                      <CountUp end={qoeData.score} duration={1.5} preserveValue />
                    </span>
                    <span className="text-sm text-zinc-500 font-medium">/100</span>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-zinc-500 font-medium">
                {qoeData.score > 80 ? 'Excellent' : qoeData.score >= 60 ? 'Good' : 'Poor'} Quality of Experience
              </p>
            </div>
          </div>

          {/* 3. ACTIVE STREAMS */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-2xl hover:bg-white/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-400">Active Streams</p>
                <Radio className="w-5 h-5 text-purple-400 opacity-60" />
              </div>

              {/* Large Number with Animation */}
              <div className="text-6xl font-black text-zinc-100 tracking-tight">
                <CountUp end={streamsData.total} duration={1.5} preserveValue useEasing />
              </div>

              {/* Live/VOD Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Live</span>
                  <span className="font-bold text-purple-400">{streamsData.live}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">VOD</span>
                  <span className="font-bold text-zinc-400">{streamsData.vod}</span>
                </div>

                {/* Mini Horizontal Bar */}
                <div className="w-full h-2 bg-zinc-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${(streamsData.live / streamsData.total) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-center text-zinc-500">
                  {Math.round((streamsData.live / streamsData.total) * 100)}% Live
                </p>
              </div>
            </div>
          </div>

          {/* 4. ALERTS */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-2xl hover:bg-white/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-400">Active Alerts</p>
                <AlertTriangle className="w-5 h-5 text-rose-400 opacity-60" />
              </div>

              {/* Number with Pulse for Urgent */}
              <div className="relative">
                <div className="text-6xl font-black text-zinc-100 tracking-tight">6</div>
                <span className="absolute -top-2 -right-2 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500"></span>
                </span>
              </div>

              {/* Severity Breakdown with Color-Coded Dots */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    <span className="text-sm text-rose-400 font-medium">Critical</span>
                  </div>
                  <span className="text-sm font-bold text-zinc-100">3</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    <span className="text-sm text-amber-400 font-medium">Warning</span>
                  </div>
                  <span className="text-sm font-bold text-zinc-100">2</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    <span className="text-sm text-blue-400 font-medium">Info</span>
                  </div>
                  <span className="text-sm font-bold text-zinc-100">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts Feed - Horizontal Scroll */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-zinc-100">Recent Alerts</h3>
          <p className="text-xs text-zinc-500 mt-1">Live feed of system notifications</p>
        </div>
        
        <div className="relative">
          {/* Gradient Fade on Right */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-900/80 to-transparent z-10 pointer-events-none" />
          
          {/* Horizontal Scrolling Container */}
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-4 px-6 py-6 min-w-max">
              {alerts.map((alert, index) => {
                const Icon = alert.icon;
                const opacity = Math.max(1 - (index * 0.1), 0.3);
                
                return (
                  <div
                    key={alert.id}
                    className="relative flex-shrink-0 w-80 overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/10 transition-all duration-300"
                    style={{ opacity }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon with Severity Color */}
                      <div className={`flex-shrink-0 p-2.5 rounded-lg ${
                        alert.severity === "critical"
                          ? "bg-rose-500/20"
                          : alert.severity === "warning"
                          ? "bg-amber-500/20"
                          : "bg-blue-500/20"
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          alert.severity === "critical"
                            ? "text-rose-400"
                            : alert.severity === "warning"
                            ? "text-amber-400"
                            : "text-blue-400"
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 leading-snug">
                          {alert.message}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">{alert.time}</p>
                      </div>

                      {/* Severity Badge */}
                      <span className={`flex-shrink-0 px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                        alert.severity === "critical"
                          ? "bg-rose-500/20 text-rose-300"
                          : alert.severity === "warning"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes drift {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(40px, 40px);
          }
        }
      `}</style>
    </div>
  );
}
