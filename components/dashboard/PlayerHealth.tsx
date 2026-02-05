"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/shared/badge";
import { DataSourceBadge } from "@/components/shared/DataSourceBadge";

interface DroppedFramesData {
  totalFrames: number;
  droppedFrames: number;
  percentage: number;
}

interface VHSSegmentStats {
  requests: number;
  aborted: number;
  timeout: number;
  errored: number;
  bytes: number;
  duration: number;
}

interface StartupMetrics {
  timeToLoadedData: number;
  timeToFirstFrame: number;
  timeToPlayback: number;
}

interface VHSEvent {
  timestamp: string;
  type: "gap-skip" | "rendition-excluded" | "live-resync" | "video-underflow";
  details: string;
  severity: "info" | "warning" | "error";
}

// Interface for viewport mismatch data (not currently used)
// interface ViewportMismatch {
//   viewportWidth: number;
//   viewportHeight: number;
//   renditionWidth: number;
//   renditionHeight: number;
//   mismatchRatio: number;
//   recommendation: string;
// }

interface ViewportStats {
  totalViewers: number;
  oversizedPercentage: number;
  wastedBandwidthGB: number;
  potentialSavingsPercent: number;
  breakdowns: {
    resolution: string;
    viewport: string;
    viewers: number;
    wastedBandwidth: number;
  }[];
}

// Mock data
const droppedFrames: DroppedFramesData = {
  totalFrames: 18450,
  droppedFrames: 127,
  percentage: 0.69,
};

const vhsStats: VHSSegmentStats = {
  requests: 1842,
  aborted: 23,
  timeout: 5,
  errored: 8,
  bytes: 524288000, // ~500MB
  duration: 3685, // seconds
};

const startupMetrics: StartupMetrics = {
  timeToLoadedData: 1250,
  timeToFirstFrame: 1420,
  timeToPlayback: 1580,
};

const vhsEvents: VHSEvent[] = [
  {
    timestamp: "2024-02-04T23:15:42.123Z",
    type: "gap-skip",
    details: "Skipped 0.34s gap in buffer at position 1247.5s",
    severity: "warning",
  },
  {
    timestamp: "2024-02-04T23:14:18.456Z",
    type: "rendition-excluded",
    details: "Excluded 1080p rendition due to consistent download failures",
    severity: "error",
  },
  {
    timestamp: "2024-02-04T23:13:05.789Z",
    type: "live-resync",
    details: "Resynced live edge after 12.3s drift",
    severity: "warning",
  },
  {
    timestamp: "2024-02-04T23:12:33.012Z",
    type: "video-underflow",
    details: "Buffer underflow detected, rebuffering initiated",
    severity: "error",
  },
  {
    timestamp: "2024-02-04T23:11:20.345Z",
    type: "gap-skip",
    details: "Skipped 0.18s gap in buffer at position 892.1s",
    severity: "info",
  },
];

// viewportMismatch data is represented in viewportStats below
const viewportStats: ViewportStats = {
  totalViewers: 12450,
  oversizedPercentage: 34.2,
  wastedBandwidthGB: 127.3,
  potentialSavingsPercent: 23.8,
  breakdowns: [
    {
      resolution: "1080p",
      viewport: "480p",
      viewers: 2840,
      wastedBandwidth: 68.4,
    },
    {
      resolution: "1080p",
      viewport: "720p",
      viewers: 1520,
      wastedBandwidth: 32.1,
    },
    {
      resolution: "720p",
      viewport: "360p",
      viewers: 890,
      wastedBandwidth: 18.5,
    },
    {
      resolution: "4K",
      viewport: "1080p",
      viewers: 410,
      wastedBandwidth: 8.3,
    },
  ],
};

export function PlayerHealth() {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const getGaugeColor = (percentage: number) => {
    if (percentage < 1) return "hsl(120, 70%, 50%)"; // green
    if (percentage < 3) return "hsl(60, 70%, 50%)"; // yellow
    return "hsl(0, 70%, 50%)"; // red
  };

  const getSeverityColor = (severity: VHSEvent["severity"]) => {
    switch (severity) {
      case "info":
        return "bg-blue-500/10 text-blue-500";
      case "warning":
        return "bg-yellow-500/10 text-yellow-500";
      case "error":
        return "bg-red-500/10 text-red-500";
    }
  };

  const errorRate = ((vhsStats.errored / vhsStats.requests) * 100).toFixed(2);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const abortRate = ((vhsStats.aborted / vhsStats.requests) * 100).toFixed(2);

  // Calculate health score (0-100, weighted)
  const healthScore = Math.round(
    (100 - droppedFrames.percentage) * 0.4 + // Dropped frames (40% weight)
    (100 - parseFloat(errorRate)) * 0.3 + // Error rate (30% weight)
    (startupMetrics.timeToPlayback < 2000 ? 90 : 70) * 0.3 // Startup speed (30% weight)
  );

  return (
    <div ref={sectionRef} className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Player Health</h2>
          <p className="text-muted-foreground">Video.js HLS (VHS) performance and diagnostics</p>
        </div>
        <DataSourceBadge source="Video.js VHS" />
      </div>

      {/* Large Health Score Gauge at Top */}
      <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/10">
        <h3 className="text-lg font-semibold text-zinc-100 mb-6 text-center">Overall Player Health Score</h3>
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="20"
                fill="none"
              />
              {/* Progress circle with gradient */}
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke={getGaugeColor(100 - healthScore)}
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${(healthScore / 100) * 691.15} 691.15`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold text-zinc-100">{healthScore}</div>
              <div className="text-lg text-zinc-400 mt-2">/ 100</div>
              <div className="text-sm text-zinc-500 mt-1">Health Score</div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-400">
            {healthScore >= 90 && "Excellent player performance"}
            {healthScore >= 70 && healthScore < 90 && "Good player performance"}
            {healthScore >= 50 && healthScore < 70 && "Acceptable player performance"}
            {healthScore < 50 && "Player performance needs attention"}
          </p>
        </div>
      </div>

      {/* 4 Mini Stat Cards Below */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Dropped Frames % */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/10">
          <div className="text-xs text-zinc-400 mb-2">Dropped Frames</div>
          <div className="text-3xl font-bold text-zinc-100">{droppedFrames.percentage}%</div>
          <div className="text-xs text-zinc-500 mt-1">{droppedFrames.droppedFrames} / {droppedFrames.totalFrames.toLocaleString()}</div>
        </div>

        {/* Segment Errors */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/10">
          <div className="text-xs text-zinc-400 mb-2">Segment Errors</div>
          <div className="text-3xl font-bold text-zinc-100">{errorRate}%</div>
          <div className="text-xs text-zinc-500 mt-1">{vhsStats.errored} / {vhsStats.requests} requests</div>
        </div>

        {/* Avg Load Time */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/10">
          <div className="text-xs text-zinc-400 mb-2">Avg Load Time</div>
          <div className="text-3xl font-bold text-zinc-100">{(vhsStats.duration / vhsStats.requests).toFixed(2)}s</div>
          <div className="text-xs text-zinc-500 mt-1">Per segment</div>
        </div>

        {/* Underflows (Derived from buffer starvation) */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/10">
          <div className="text-xs text-zinc-400 mb-2">Underflows</div>
          <div className="text-3xl font-bold text-zinc-100">{vhsStats.aborted}</div>
          <div className="text-xs text-zinc-500 mt-1">Buffer events</div>
        </div>
      </div>

      {/* Startup Performance */}
      <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">Startup Performance</h3>
        <p className="text-sm text-zinc-400 mb-6">Time to interactive playback metrics</p>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm font-medium text-zinc-200">Time to Loaded Data</div>
            <div className="text-3xl font-bold text-zinc-100">{startupMetrics.timeToLoadedData}ms</div>
            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${(startupMetrics.timeToLoadedData / 2000) * 100}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500">First byte to loadeddata event</p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-zinc-200">Time to First Frame</div>
            <div className="text-3xl font-bold text-zinc-100">{startupMetrics.timeToFirstFrame}ms</div>
            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${(startupMetrics.timeToFirstFrame / 2000) * 100}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500">Until first frame rendered</p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-zinc-200">Time to Playback</div>
            <div className="text-3xl font-bold text-zinc-100">{startupMetrics.timeToPlayback}ms</div>
            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500"
                style={{ width: `${(startupMetrics.timeToPlayback / 2000) * 100}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500">Until playback begins</p>
          </div>
        </div>
      </div>

      {/* VHS Events Log - Styled Table with Glass Effect */}
      <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-zinc-100 mb-2">VHS Events Log</h3>
        <p className="text-sm text-zinc-400 mb-6">Adaptive streaming events and interventions</p>
        <div className="space-y-2">
          {vhsEvents.map((event, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-white/5">
              <Badge variant="outline" className={`${getSeverityColor(event.severity)} shrink-0`}>
                {event.type}
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-zinc-200">{event.details}</div>
                <div className="text-xs text-zinc-500 mt-1">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
              </div>
              <Badge variant="outline" className="shrink-0 bg-zinc-900/50 border-white/10">
                {event.severity}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Viewport vs Rendition Mismatch - WASTED BANDWIDTH */}
      <div className="bg-gradient-to-br from-orange-900/20 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-2 border-orange-500/30">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-1">Viewport vs Rendition Mismatch</h3>
          <p className="text-sm text-zinc-400">Wasted bandwidth from oversized video delivery</p>
        </div>
        <div>
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/10">
              <div className="text-xs text-zinc-400 mb-1">Total Viewers</div>
              <div className="text-2xl font-bold text-zinc-100">{viewportStats.totalViewers.toLocaleString()}</div>
            </div>
            <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
              <div className="text-xs text-red-400 mb-1">Oversized Delivery</div>
              <div className="text-2xl font-bold text-red-400">
                {viewportStats.oversizedPercentage}%
              </div>
            </div>
            <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-500/30">
              <div className="text-xs text-orange-400 mb-1">Wasted Bandwidth</div>
              <div className="text-2xl font-bold text-orange-400">
                {viewportStats.wastedBandwidthGB}GB
              </div>
            </div>
            <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
              <div className="text-xs text-green-400 mb-1">Potential Savings</div>
              <div className="text-2xl font-bold text-green-400">
                {viewportStats.potentialSavingsPercent}%
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-zinc-100 mb-3">Mismatch Breakdown</h4>
            <div className="relative overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/50">
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 font-semibold text-zinc-300">Delivered Resolution</th>
                    <th className="text-left p-3 font-semibold text-zinc-300">Viewport Size</th>
                    <th className="text-right p-3 font-semibold text-zinc-300">Affected Viewers</th>
                    <th className="text-right p-3 font-semibold text-zinc-300">Wasted (GB)</th>
                    <th className="text-center p-3 font-semibold text-zinc-300">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {viewportStats.breakdowns.map((row, idx) => {
                    const impactLevel = row.viewers > 2000 ? "high" : row.viewers > 1000 ? "medium" : "low";
                    return (
                      <tr key={idx} className="border-b border-white/5 hover:bg-zinc-800/50">
                        <td className="p-3 font-medium text-zinc-200">{row.resolution}</td>
                        <td className="p-3 text-zinc-400">{row.viewport}</td>
                        <td className="p-3 text-right font-semibold text-zinc-200">{row.viewers.toLocaleString()}</td>
                        <td className="p-3 text-right text-orange-400 font-semibold">
                          {row.wastedBandwidth.toFixed(1)}
                        </td>
                        <td className="p-3 text-center">
                          <Badge
                            variant={impactLevel === "high" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {impactLevel}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-zinc-100 mb-3">Example: 1080p → 480p Viewport</h4>
              <div className="relative h-48 bg-zinc-900/50 rounded-lg flex items-center justify-center p-4 border border-white/10">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Viewport (small) */}
                  <div className="absolute border-4 border-blue-500 rounded" style={{ width: "120px", height: "68px" }}>
                    <div className="absolute -top-6 left-0 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      480p Viewport
                    </div>
                  </div>
                  {/* Rendition (large, wasted) */}
                  <div 
                    className="border-4 border-dashed border-red-500 rounded bg-red-500/10" 
                    style={{ width: "240px", height: "135px" }}
                  >
                    <div className="absolute -bottom-6 right-0 text-xs font-semibold text-red-600 dark:text-red-400">
                      1080p Delivered (wasted)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-zinc-100 mb-3">Percentage Breakdown</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-200">Correct Size</span>
                    <span className="font-semibold text-zinc-200">{(100 - viewportStats.oversizedPercentage).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${100 - viewportStats.oversizedPercentage}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-200">Oversized (Wasted)</span>
                    <span className="font-semibold text-red-400">
                      {viewportStats.oversizedPercentage}%
                    </span>
                  </div>
                  <div className="h-3 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500" 
                      style={{ width: `${viewportStats.oversizedPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 text-blue-300">
              💡 Optimization Recommendations
            </h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>
                  <strong>Implement viewport-aware ABR:</strong> Limit max rendition to 1.2x viewport resolution
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>
                  <strong>Estimated savings:</strong> {viewportStats.wastedBandwidthGB}GB/day = ~
                  {(viewportStats.wastedBandwidthGB * 30 * 0.08).toFixed(0)}$/month in CDN costs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>
                  <strong>User benefit:</strong> Reduced buffer time and faster startup for {(viewportStats.totalViewers * viewportStats.oversizedPercentage / 100).toFixed(0)} viewers
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
