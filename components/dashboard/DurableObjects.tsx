"use client";

import { Badge } from "@/components/shared/badge";

interface SessionDOMetrics {
  activeCount: number;
  totalSessions: number;
  avgEventsPerSession: number;
  memoryUsage: number;
}

interface StreamDOMetrics {
  channel: string;
  viewers: number;
  shardCount: number;
  status: "active" | "idle" | "scaling";
}

interface RegionalQoEMetrics {
  region: string;
  status: "normal" | "degraded" | "anomaly";
  avgBitrate: number;
  avgLatency: number;
  errorRate: number;
}

interface EdgeLocationMetrics {
  location: string;
  cmsdStatus: "active" | "inactive" | "error";
  requestCount: number;
  avgGenerationTime: number;
}

// Mock data
const sessionDO: SessionDOMetrics = {
  activeCount: 8742,
  totalSessions: 45231,
  avgEventsPerSession: 127.5,
  memoryUsage: 2.4, // GB
};

const streamDOs: StreamDOMetrics[] = [
  { channel: "live-sports", viewers: 15420, shardCount: 8, status: "active" },
  { channel: "news-24", viewers: 8932, shardCount: 5, status: "active" },
  { channel: "entertainment", viewers: 6215, shardCount: 4, status: "active" },
  { channel: "gaming", viewers: 3847, shardCount: 2, status: "scaling" },
  { channel: "music", viewers: 1205, shardCount: 1, status: "idle" },
];

const regionalQoE: RegionalQoEMetrics[] = [
  { region: "US-EAST", status: "normal", avgBitrate: 5200, avgLatency: 35, errorRate: 0.12 },
  { region: "US-WEST", status: "normal", avgBitrate: 5100, avgLatency: 42, errorRate: 0.15 },
  { region: "EU-CENTRAL", status: "degraded", avgBitrate: 3800, avgLatency: 78, errorRate: 0.89 },
  { region: "EU-WEST", status: "normal", avgBitrate: 4900, avgLatency: 48, errorRate: 0.21 },
  { region: "APAC-EAST", status: "anomaly", avgBitrate: 2100, avgLatency: 156, errorRate: 2.34 },
  { region: "APAC-SOUTH", status: "normal", avgBitrate: 4200, avgLatency: 65, errorRate: 0.34 },
  { region: "SA-EAST", status: "normal", avgBitrate: 3900, avgLatency: 92, errorRate: 0.45 },
  { region: "AF-SOUTH", status: "degraded", avgBitrate: 2800, avgLatency: 123, errorRate: 1.12 },
];

const edgeLocations: EdgeLocationMetrics[] = [
  { location: "IAD", cmsdStatus: "active", requestCount: 45230, avgGenerationTime: 2.3 },
  { location: "SFO", cmsdStatus: "active", requestCount: 38920, avgGenerationTime: 2.1 },
  { location: "FRA", cmsdStatus: "active", requestCount: 32410, avgGenerationTime: 3.5 },
  { location: "LHR", cmsdStatus: "active", requestCount: 28765, avgGenerationTime: 2.8 },
  { location: "NRT", cmsdStatus: "error", requestCount: 12340, avgGenerationTime: 8.7 },
  { location: "SYD", cmsdStatus: "active", requestCount: 15670, avgGenerationTime: 3.2 },
  { location: "GRU", cmsdStatus: "active", requestCount: 9845, avgGenerationTime: 4.1 },
  { location: "JNB", cmsdStatus: "inactive", requestCount: 3420, avgGenerationTime: 0 },
];

export function DurableObjects() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "normal":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "scaling":
      case "degraded":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "idle":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "error":
      case "anomaly":
      case "inactive":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "active":
      case "normal":
        return "bg-green-500";
      case "scaling":
      case "degraded":
        return "bg-yellow-500";
      case "idle":
        return "bg-gray-500";
      case "error":
      case "anomaly":
      case "inactive":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const totalViewers = streamDOs.reduce((sum, stream) => sum + stream.viewers, 0);
  const totalShards = streamDOs.reduce((sum, stream) => sum + stream.shardCount, 0);
  
  const normalRegions = regionalQoE.filter(r => r.status === "normal").length;
  const degradedRegions = regionalQoE.filter(r => r.status === "degraded").length;
  const anomalyRegions = regionalQoE.filter(r => r.status === "anomaly").length;

  const activeEdges = edgeLocations.filter(l => l.cmsdStatus === "active").length;
  const errorEdges = edgeLocations.filter(l => l.cmsdStatus === "error").length;
  const inactiveEdges = edgeLocations.filter(l => l.cmsdStatus === "inactive").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Durable Objects</h2>
          <p className="text-muted-foreground">Edge compute state and coordination</p>
        </div>
        <Badge variant="outline" className="text-sm">Edge State</Badge>
      </div>

      {/* 2x2 GRID: 4 Equal Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session DOs */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">Session DOs</h3>
              <p className="text-xs text-zinc-400 mt-1">User session state management</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${getStatusDot("active")} animate-pulse`}></div>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-zinc-100">{sessionDO.activeCount.toLocaleString()}</div>
                <div className="text-xs text-zinc-400 mt-1">Active Sessions</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold text-zinc-300">{sessionDO.totalSessions.toLocaleString()}</div>
                <div className="text-xs text-zinc-500">Total</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                <div className="text-xs text-zinc-400">Avg Events</div>
                <div className="text-lg font-bold text-zinc-100">{sessionDO.avgEventsPerSession}</div>
              </div>
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                <div className="text-xs text-zinc-400">Memory</div>
                <div className="text-lg font-bold text-zinc-100">{sessionDO.memoryUsage}GB</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stream DOs */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">Stream DOs</h3>
              <p className="text-xs text-zinc-400 mt-1">Per-channel viewer coordination</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${getStatusDot("active")} animate-pulse`}></div>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-zinc-100">{totalViewers.toLocaleString()}</div>
                <div className="text-xs text-zinc-400 mt-1">Total Viewers</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold text-zinc-300">{totalShards}</div>
                <div className="text-xs text-zinc-500">Shards</div>
              </div>
            </div>

            <div className="space-y-2">
              {streamDOs.slice(0, 3).map((stream) => (
                <div key={stream.channel} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusDot(stream.status)}`}></div>
                    <span className="text-zinc-300">{stream.channel}</span>
                  </div>
                  <span className="font-semibold text-zinc-100">{stream.viewers.toLocaleString()}</span>
                </div>
              ))}
              <div className="text-xs text-zinc-500 text-center pt-1">
                +{streamDOs.length - 3} more channels
              </div>
            </div>
          </div>
        </div>

        {/* Regional DOs */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">Regional DOs</h3>
              <p className="text-xs text-zinc-400 mt-1">QoE anomaly detection by region</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${getStatusDot(anomalyRegions > 0 ? "anomaly" : "normal")} ${anomalyRegions > 0 ? 'animate-pulse' : ''}`}></div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{normalRegions}</div>
                <div className="text-xs text-green-300">Normal</div>
              </div>
              <div className="bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/20">
                <div className="text-2xl font-bold text-yellow-400">{degradedRegions}</div>
                <div className="text-xs text-yellow-300">Degraded</div>
              </div>
              <div className="bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                <div className="text-2xl font-bold text-red-400">{anomalyRegions}</div>
                <div className="text-xs text-red-300">Anomaly</div>
              </div>
            </div>

            <div className="space-y-2">
              {regionalQoE.filter(r => r.status !== "normal").slice(0, 3).map((region) => (
                <div key={region.region} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusDot(region.status)}`}></div>
                    <span className="text-zinc-300">{region.region}</span>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(region.status)}`}>
                    {region.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edge DOs */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">Edge DOs</h3>
              <p className="text-xs text-zinc-400 mt-1">CMSD generation per PoP</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${getStatusDot(errorEdges > 0 ? "error" : "active")} ${errorEdges > 0 ? 'animate-pulse' : ''}`}></div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{activeEdges}</div>
                <div className="text-xs text-green-300">Active</div>
              </div>
              <div className="bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                <div className="text-2xl font-bold text-red-400">{errorEdges}</div>
                <div className="text-xs text-red-300">Error</div>
              </div>
              <div className="bg-gray-900/20 p-3 rounded-lg border border-gray-500/20">
                <div className="text-2xl font-bold text-gray-400">{inactiveEdges}</div>
                <div className="text-xs text-gray-300">Inactive</div>
              </div>
            </div>

            <div className="space-y-2">
              {edgeLocations.filter(l => l.cmsdStatus !== "active").slice(0, 3).map((edge) => (
                <div key={edge.location} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusDot(edge.cmsdStatus)}`}></div>
                    <span className="text-zinc-300 font-mono">{edge.location}</span>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(edge.cmsdStatus)}`}>
                    {edge.cmsdStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tables (Optional, Below Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stream Details */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Stream DO Details</h3>
          <div className="space-y-2">
            {streamDOs.map((stream) => (
              <div key={stream.channel} className="flex items-center justify-between p-2 bg-zinc-900/50 rounded border border-white/5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusDot(stream.status)}`}></div>
                  <span className="text-sm text-zinc-200">{stream.channel}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-zinc-100">{stream.viewers.toLocaleString()}</div>
                  <div className="text-xs text-zinc-500">{stream.shardCount} shards</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edge Details */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Edge Location Details</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {edgeLocations.map((edge) => (
              <div key={edge.location} className="flex items-center justify-between p-2 bg-zinc-900/50 rounded border border-white/5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusDot(edge.cmsdStatus)}`}></div>
                  <span className="text-sm text-zinc-200 font-mono">{edge.location}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400">{edge.requestCount.toLocaleString()} req</div>
                  <div className="text-xs text-zinc-500">
                    {edge.cmsdStatus === "active" ? `${edge.avgGenerationTime.toFixed(1)}ms` : "-"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
