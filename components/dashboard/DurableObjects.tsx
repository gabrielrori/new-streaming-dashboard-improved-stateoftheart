"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card";
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
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "scaling":
      case "degraded":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "idle":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "error":
      case "anomaly":
      case "inactive":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  const totalViewers = streamDOs.reduce((sum, stream) => sum + stream.viewers, 0);
  const totalShards = streamDOs.reduce((sum, stream) => sum + stream.shardCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Durable Objects</h2>
          <p className="text-muted-foreground">Edge compute state and coordination</p>
        </div>
        <Badge variant="outline" className="text-sm">Edge State</Badge>
      </div>

      {/* Session DOs */}
      <Card>
        <CardHeader>
          <CardTitle>Session Durable Objects</CardTitle>
          <CardDescription>User session state management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Active Sessions</div>
              <div className="text-3xl font-bold">{sessionDO.activeCount.toLocaleString()}</div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Total Sessions</div>
              <div className="text-3xl font-bold">{sessionDO.totalSessions.toLocaleString()}</div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Avg Events/Session</div>
              <div className="text-3xl font-bold">{sessionDO.avgEventsPerSession}</div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Memory Usage</div>
              <div className="text-3xl font-bold">{sessionDO.memoryUsage}GB</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stream DOs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Stream Durable Objects</CardTitle>
              <CardDescription>Per-channel viewer coordination</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">{totalViewers.toLocaleString()} viewers</div>
              <div className="text-xs text-muted-foreground">{totalShards} shards</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {streamDOs.map((stream) => (
              <div key={stream.channel} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getStatusColor(stream.status)}>
                    {stream.status}
                  </Badge>
                  <div>
                    <div className="font-medium">{stream.channel}</div>
                    <div className="text-xs text-muted-foreground">
                      {stream.shardCount} shard{stream.shardCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{stream.viewers.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">viewers</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional QoE DOs */}
      <Card>
        <CardHeader>
          <CardTitle>Regional QoE Durable Objects</CardTitle>
          <CardDescription>Anomaly detection status by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            {regionalQoE.map((region) => (
              <div
                key={region.region}
                className={`p-4 rounded-lg border-2 ${getStatusColor(region.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{region.region}</span>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(region.status)}`}>
                    {region.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bitrate:</span>
                    <span className="font-medium">{(region.avgBitrate / 1000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Latency:</span>
                    <span className="font-medium">{region.avgLatency}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Error Rate:</span>
                    <span className={`font-medium ${region.errorRate > 1 ? "text-red-500" : ""}`}>
                      {region.errorRate}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Degraded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Anomaly</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edge Location DOs */}
      <Card>
        <CardHeader>
          <CardTitle>Edge Location Durable Objects</CardTitle>
          <CardDescription>CMSD generation status per PoP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Location</th>
                  <th className="text-center p-2 font-medium">CMSD Status</th>
                  <th className="text-right p-2 font-medium">Requests</th>
                  <th className="text-right p-2 font-medium">Avg Gen Time</th>
                  <th className="text-right p-2 font-medium">Throughput</th>
                </tr>
              </thead>
              <tbody>
                {edgeLocations.map((location) => (
                  <tr key={location.location} className="border-b">
                    <td className="p-2 font-bold">{location.location}</td>
                    <td className="p-2 text-center">
                      <Badge variant="outline" className={getStatusColor(location.cmsdStatus)}>
                        {location.cmsdStatus}
                      </Badge>
                    </td>
                    <td className="p-2 text-right">{location.requestCount.toLocaleString()}</td>
                    <td className="p-2 text-right">
                      {location.cmsdStatus === "inactive" ? (
                        <span className="text-muted-foreground">-</span>
                      ) : (
                        <span
                          className={
                            location.avgGenerationTime > 5 ? "text-red-500 font-medium" : ""
                          }
                        >
                          {location.avgGenerationTime.toFixed(1)}ms
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-right">
                      {location.cmsdStatus === "inactive" ? (
                        <span className="text-muted-foreground">-</span>
                      ) : (
                        <span>
                          {(location.requestCount / (location.avgGenerationTime / 1000)).toFixed(
                            0
                          )}{" "}
                          req/s
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <div className="font-medium mb-1">Status Summary:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-green-500">●</span> Active:{" "}
                {edgeLocations.filter((l) => l.cmsdStatus === "active").length}
              </div>
              <div>
                <span className="text-gray-500">●</span> Inactive:{" "}
                {edgeLocations.filter((l) => l.cmsdStatus === "inactive").length}
              </div>
              <div>
                <span className="text-red-500">●</span> Error:{" "}
                {edgeLocations.filter((l) => l.cmsdStatus === "error").length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
