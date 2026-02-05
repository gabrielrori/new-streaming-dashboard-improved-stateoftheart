"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card";
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
  const abortRate = ((vhsStats.aborted / vhsStats.requests) * 100).toFixed(2);

  return (
    <div ref={sectionRef} className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Player Health</h2>
          <p className="text-muted-foreground">Video.js HLS (VHS) performance and diagnostics</p>
        </div>
        <DataSourceBadge source="Video.js VHS" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Dropped Frames Gauge */}
        <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <CardHeader>
            <CardTitle>Dropped Frames</CardTitle>
            <CardDescription>Frame rendering performance</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="hsl(var(--muted))"
                  strokeWidth="16"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke={getGaugeColor(droppedFrames.percentage)}
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${(droppedFrames.percentage / 100) * 502.65} 502.65`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold">{droppedFrames.percentage}%</div>
                <div className="text-sm text-muted-foreground">dropped</div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 w-full">
              <div className="text-center">
                <div className="text-2xl font-bold">{droppedFrames.totalFrames.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Frames</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{droppedFrames.droppedFrames}</div>
                <div className="text-xs text-muted-foreground">Dropped</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VHS Segment Stats */}
        <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <CardHeader>
            <CardTitle>VHS Segment Statistics</CardTitle>
            <CardDescription>HTTP segment request summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Total Requests</div>
                  <div className="text-2xl font-bold">{vhsStats.requests.toLocaleString()}</div>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Bytes Transferred</div>
                  <div className="text-2xl font-bold">{(vhsStats.bytes / 1024 / 1024).toFixed(0)}MB</div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Aborted</td>
                      <td className="p-2 text-right">{vhsStats.aborted}</td>
                      <td className="p-2 text-right text-muted-foreground">{abortRate}%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Timeout</td>
                      <td className="p-2 text-right">{vhsStats.timeout}</td>
                      <td className="p-2 text-right text-muted-foreground">
                        {((vhsStats.timeout / vhsStats.requests) * 100).toFixed(2)}%
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Errored</td>
                      <td className="p-2 text-right text-red-500">{vhsStats.errored}</td>
                      <td className="p-2 text-right text-red-500">{errorRate}%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Avg Duration</td>
                      <td className="p-2 text-right" colSpan={2}>
                        {(vhsStats.duration / vhsStats.requests).toFixed(2)}s
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Startup Performance */}
      <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <CardHeader>
          <CardTitle>Startup Performance</CardTitle>
          <CardDescription>Time to interactive playback metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Time to Loaded Data</div>
              <div className="text-3xl font-bold">{startupMetrics.timeToLoadedData}ms</div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(startupMetrics.timeToLoadedData / 2000) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">First byte to loadeddata event</p>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Time to First Frame</div>
              <div className="text-3xl font-bold">{startupMetrics.timeToFirstFrame}ms</div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(startupMetrics.timeToFirstFrame / 2000) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Until first frame rendered</p>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Time to Playback</div>
              <div className="text-3xl font-bold">{startupMetrics.timeToPlayback}ms</div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${(startupMetrics.timeToPlayback / 2000) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Until playback begins</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VHS Events Log */}
      <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <CardHeader>
          <CardTitle>VHS Events Log</CardTitle>
          <CardDescription>Adaptive streaming events and interventions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {vhsEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                <Badge variant="outline" className={`${getSeverityColor(event.severity)} shrink-0`}>
                  {event.type}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{event.details}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {event.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Viewport vs Rendition Mismatch - WASTED BANDWIDTH */}
      <Card className="border-2 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle>Viewport vs Rendition Mismatch</CardTitle>
          <CardDescription>Wasted bandwidth from oversized video delivery</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Total Viewers</div>
              <div className="text-2xl font-bold">{viewportStats.totalViewers.toLocaleString()}</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-xs text-red-600 dark:text-red-400 mb-1">Oversized Delivery</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {viewportStats.oversizedPercentage}%
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-xs text-orange-600 dark:text-orange-400 mb-1">Wasted Bandwidth</div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {viewportStats.wastedBandwidthGB}GB
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-xs text-green-600 dark:text-green-400 mb-1">Potential Savings</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {viewportStats.potentialSavingsPercent}%
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3">Mismatch Breakdown</h4>
            <div className="relative overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Delivered Resolution</th>
                    <th className="text-left p-3 font-semibold">Viewport Size</th>
                    <th className="text-right p-3 font-semibold">Affected Viewers</th>
                    <th className="text-right p-3 font-semibold">Wasted (GB)</th>
                    <th className="text-center p-3 font-semibold">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {viewportStats.breakdowns.map((row, idx) => {
                    const impactLevel = row.viewers > 2000 ? "high" : row.viewers > 1000 ? "medium" : "low";
                    return (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{row.resolution}</td>
                        <td className="p-3 text-muted-foreground">{row.viewport}</td>
                        <td className="p-3 text-right font-semibold">{row.viewers.toLocaleString()}</td>
                        <td className="p-3 text-right text-orange-600 dark:text-orange-400 font-semibold">
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
              <h4 className="text-sm font-semibold mb-3">Example: 1080p → 480p Viewport</h4>
              <div className="relative h-48 bg-muted rounded-lg flex items-center justify-center p-4">
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
              <h4 className="text-sm font-semibold mb-3">Percentage Breakdown</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Correct Size</span>
                    <span className="font-semibold">{(100 - viewportStats.oversizedPercentage).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${100 - viewportStats.oversizedPercentage}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Oversized (Wasted)</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {viewportStats.oversizedPercentage}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
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
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 text-blue-900 dark:text-blue-100">
              💡 Optimization Recommendations
            </h4>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>
                  <strong>Implement viewport-aware ABR:</strong> Limit max rendition to 1.2x viewport resolution
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>
                  <strong>Estimated savings:</strong> {viewportStats.wastedBandwidthGB}GB/day = ~
                  {(viewportStats.wastedBandwidthGB * 30 * 0.08).toFixed(0)}$/month in CDN costs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>
                  <strong>User benefit:</strong> Reduced buffer time and faster startup for {(viewportStats.totalViewers * viewportStats.oversizedPercentage / 100).toFixed(0)} viewers
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
