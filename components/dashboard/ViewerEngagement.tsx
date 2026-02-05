"use client";

import { useMemo, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { generateEngagementMetrics } from "@/lib/mock-data/engagement";
import { DataSourceBadge } from "@/components/shared/DataSourceBadge";
import { TrendingUp, Clock, Target } from "lucide-react";

export function ViewerEngagement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const engagementData = useMemo(() => generateEngagementMetrics(), []);

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

  const watchTimeComparison = [
    { segment: "0-5min", watchTime: 4.2, sessionDuration: 5.1 },
    { segment: "5-10min", watchTime: 4.8, sessionDuration: 5.3 },
    { segment: "10-15min", watchTime: 3.9, sessionDuration: 4.7 },
    { segment: "15-20min", watchTime: 3.2, sessionDuration: 4.1 },
    { segment: "20-25min", watchTime: 2.8, sessionDuration: 3.6 },
    { segment: "25-30min", watchTime: 2.1, sessionDuration: 2.9 },
  ];

  const completionFunnel = [
    { stage: "Started", viewers: 10000, percentage: 100 },
    { stage: "25% Complete", viewers: 8500, percentage: 85 },
    { stage: "50% Complete", viewers: 6200, percentage: 62 },
    { stage: "75% Complete", viewers: 4100, percentage: 41 },
    { stage: "Completed", viewers: 3200, percentage: 32 },
  ];

  const abandonPoints = [
    { timestamp: 120, abandonCount: 450, totalViewers: 10000 },
    { timestamp: 300, abandonCount: 380, totalViewers: 9550 },
    { timestamp: 480, abandonCount: 520, totalViewers: 9170 },
    { timestamp: 720, abandonCount: 290, totalViewers: 8650 },
    { timestamp: 900, abandonCount: 410, totalViewers: 8360 },
    { timestamp: 1200, abandonCount: 320, totalViewers: 7950 },
    { timestamp: 1500, abandonCount: 180, totalViewers: 7630 },
  ];

  const pausePatterns = [
    { timeRange: "0-5min", pauseCount: 1250, avgPauseDuration: 8.5 },
    { timeRange: "5-10min", pauseCount: 980, avgPauseDuration: 12.3 },
    { timeRange: "10-15min", pauseCount: 720, avgPauseDuration: 15.7 },
    { timeRange: "15-20min", pauseCount: 560, avgPauseDuration: 18.2 },
    { timeRange: "20-25min", pauseCount: 340, avgPauseDuration: 22.1 },
  ];

  const maxAbandons = Math.max(...abandonPoints.map(p => p.abandonCount));

  // Calculate engagement score (weighted)
  const engagementScore = Math.round(
    (engagementData.completionRate * 0.5) + 
    ((engagementData.averageWatchTimeSeconds / 1800) * 100 * 0.3) +
    (70 * 0.2) // Mock interaction score
  );

  return (
    <div ref={sectionRef} className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Viewer Engagement</h2>
          <p className="text-muted-foreground">Client-side behavior and engagement metrics</p>
        </div>
        <DataSourceBadge source="Video.js VHS" />
      </div>

      {/* TOP: 3 Key Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Completion Rate */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10 transition-all hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-400">Completion Rate</h3>
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-zinc-100">{engagementData.completionRate.toFixed(1)}</span>
            <span className="text-xl text-zinc-400 mb-1">%</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Viewers who reached 100%</p>
        </div>

        {/* Avg Watch Time */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10 transition-all hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-400">Avg Watch Time</h3>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-zinc-100">{(engagementData.averageWatchTimeSeconds / 60).toFixed(1)}</span>
            <span className="text-xl text-zinc-400 mb-1">min</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Average viewing duration</p>
        </div>

        {/* Engagement Score */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10 transition-all hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-400">Engagement Score</h3>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-zinc-100">{engagementScore}</span>
            <span className="text-xl text-zinc-400 mb-1">/100</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Composite engagement metric</p>
        </div>
      </div>

      {/* MIDDLE: 2-Column Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Completion Rate Funnel */}
        <Card className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm border-white/10 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <CardHeader>
            <CardTitle>Completion Rate Funnel</CardTitle>
            <CardDescription>Viewer retention through content lifecycle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completionFunnel.map((stage, index) => {
                const width = stage.percentage;
                const color = `hsl(${120 - (index * 20)}, 70%, 50%)`;
                
                return (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-zinc-200">{stage.stage}</span>
                      <span className="text-zinc-400">
                        {stage.viewers.toLocaleString()} viewers ({stage.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-center text-white font-medium text-sm transition-all"
                        style={{ width: `${width}%`, backgroundColor: color }}
                      >
                        {stage.percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-zinc-900/50 rounded-lg border border-white/10">
              <p className="text-sm text-zinc-300">
                <strong>Completion Rate:</strong> {engagementData.completionRate.toFixed(1)}% with avg watch time of {(engagementData.averageWatchTimeSeconds / 60).toFixed(1)} minutes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Abandon Points Heatmap */}
        <Card className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm border-white/10 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <CardHeader>
            <CardTitle>Abandon Points Heatmap</CardTitle>
            <CardDescription>Where viewers drop off in content timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {abandonPoints.map((point) => {
                const intensity = (point.abandonCount / maxAbandons) * 100;
                const minutes = Math.floor(point.timestamp / 60);
                const seconds = point.timestamp % 60;
                const timeLabel = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                return (
                  <div key={point.timestamp} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-zinc-200">{timeLabel}</span>
                      <span className="text-zinc-400">
                        {point.abandonCount} viewers ({((point.abandonCount / point.totalViewers) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded h-6 relative overflow-hidden">
                      <div
                        className="h-full rounded transition-all"
                        style={{
                          width: `${intensity}%`,
                          backgroundColor: `hsl(${360 - (intensity * 1.2)}, 70%, 50%)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(240, 70%, 50%)" }}></div>
                <span>Low</span>
              </div>
              <div className="flex-1 h-3 rounded" style={{ 
                background: "linear-gradient(to right, hsl(240, 70%, 50%), hsl(360, 70%, 50%))" 
              }}></div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(360, 70%, 50%)" }}></div>
                <span>High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Watch Time vs Session Duration */}
        <Card className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm border-white/10 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <CardHeader>
            <CardTitle>Watch Time vs Session Duration</CardTitle>
            <CardDescription>Actual viewing time compared to total session length</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={watchTimeComparison}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-700" />
                <XAxis dataKey="segment" tick={{ fill: "#a1a1aa" }} />
                <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft", fill: "#a1a1aa" }} tick={{ fill: "#a1a1aa" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(24, 24, 27, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="watchTime" fill="#8884d8" name="Watch Time" />
                <Bar dataKey="sessionDuration" fill="#82ca9d" name="Session Duration" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#8884d8] rounded"></div>
                <span className="text-zinc-300">Watch Time (actual viewing)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#82ca9d] rounded"></div>
                <span className="text-zinc-300">Session Duration (total time)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pause Pattern Analysis */}
        <Card className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm border-white/10 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <CardHeader>
            <CardTitle>Pause Pattern Analysis</CardTitle>
            <CardDescription>Frequency and duration of viewer pauses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pausePatterns.map((pattern) => (
                <div key={pattern.timeRange} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-zinc-200">{pattern.timeRange}</span>
                    <span className="text-xs text-zinc-400">
                      {pattern.pauseCount} pauses
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-zinc-900/50 p-2 rounded border border-white/5">
                      <div className="text-xs text-zinc-400">Count</div>
                      <div className="text-lg font-bold text-zinc-100">{pattern.pauseCount}</div>
                    </div>
                    <div className="bg-zinc-900/50 p-2 rounded border border-white/5">
                      <div className="text-xs text-zinc-400">Avg Duration</div>
                      <div className="text-lg font-bold text-zinc-100">{pattern.avgPauseDuration}s</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-zinc-900/50 rounded-lg text-sm border border-white/10">
              <strong className="text-zinc-200">Pattern Insight:</strong>{" "}
              <span className="text-zinc-400">
                Pause duration increases with content progression, suggesting intentional breaks rather than technical issues.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
