"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card";
import { Badge } from "@/components/shared/badge";
import { Search } from "lucide-react";

interface CMCDMetrics {
  bl: number; // buffer length (ms)
  bs: boolean; // buffer starvation
  br: number; // bitrate (kbps)
  mtp: number; // measured throughput (kbps)
  dl: number; // deadline (ms)
  su: boolean; // startup
  sid: string; // session id
}

interface CMSDMetrics {
  etp: number; // estimated throughput (kbps)
  mb: number; // max bitrate (kbps)
  rtt: number; // round-trip time (ms)
}

interface SessionCorrelation {
  sid: string;
  timestamp: string;
  cdnTTFB: number;
  clientTTFB: number;
  bufferLevel: number;
  bitrate: number;
  matchStatus: "matched" | "mismatch" | "partial";
}

// Mock data
const mockCMCDData: CMCDMetrics = {
  bl: 4200,
  bs: false,
  br: 5000,
  mtp: 8500,
  dl: 6000,
  su: false,
  sid: "a7b3c9d1-2e4f-5a6b-8c9d-0e1f2a3b4c5d",
};

const mockCMSDData: CMSDMetrics = {
  etp: 9000,
  mb: 8000,
  rtt: 45,
};

const allCorrelations: SessionCorrelation[] = [
  {
    sid: "a7b3c9d1-2e4f-5a6b",
    timestamp: "2024-02-04T23:15:32.123Z",
    cdnTTFB: 23,
    clientTTFB: 28,
    bufferLevel: 4200,
    bitrate: 5000,
    matchStatus: "matched",
  },
  {
    sid: "b8c4d0e2-3f5a-6b7c",
    timestamp: "2024-02-04T23:15:28.456Z",
    cdnTTFB: 18,
    clientTTFB: 22,
    bufferLevel: 2100,
    bitrate: 3000,
    matchStatus: "matched",
  },
  {
    sid: "c9d5e1f3-4a6b-7c8d",
    timestamp: "2024-02-04T23:15:20.789Z",
    cdnTTFB: 15,
    clientTTFB: 152,
    bufferLevel: 1500,
    bitrate: 2000,
    matchStatus: "mismatch",
  },
  {
    sid: "d0e6f2g4-5b7c-8d9e",
    timestamp: "2024-02-04T23:15:15.234Z",
    cdnTTFB: 31,
    clientTTFB: 35,
    bufferLevel: 3800,
    bitrate: 4500,
    matchStatus: "matched",
  },
  {
    sid: "e1f7g3h5-6c8d-9e0f",
    timestamp: "2024-02-04T23:15:08.567Z",
    cdnTTFB: 12,
    clientTTFB: 89,
    bufferLevel: 2900,
    bitrate: 3500,
    matchStatus: "mismatch",
  },
  {
    sid: "f2g8h4i6-7d9e-0f1a",
    timestamp: "2024-02-04T23:15:02.890Z",
    cdnTTFB: 25,
    clientTTFB: 29,
    bufferLevel: 5100,
    bitrate: 6000,
    matchStatus: "matched",
  },
  {
    sid: "g3h9i5j7-8e0f-1a2b",
    timestamp: "2024-02-04T23:14:55.123Z",
    cdnTTFB: 19,
    clientTTFB: 24,
    bufferLevel: 3200,
    bitrate: 4000,
    matchStatus: "matched",
  },
  {
    sid: "h4i0j6k8-9f1a-2b3c",
    timestamp: "2024-02-04T23:14:48.456Z",
    cdnTTFB: 8,
    clientTTFB: 67,
    bufferLevel: 1800,
    bitrate: 2500,
    matchStatus: "mismatch",
  },
  {
    sid: "i5j1k7l9-0a2b-3c4d",
    timestamp: "2024-02-04T23:14:42.789Z",
    cdnTTFB: 22,
    clientTTFB: 28,
    bufferLevel: 4500,
    bitrate: 5500,
    matchStatus: "matched",
  },
  {
    sid: "j6k2l8m0-1b3c-4d5e",
    timestamp: "2024-02-04T23:14:35.012Z",
    cdnTTFB: 14,
    clientTTFB: 18,
    bufferLevel: 3600,
    bitrate: 4200,
    matchStatus: "matched",
  },
];

export function CMCDBridge() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "matched" | "mismatch">("all");

  const filteredCorrelations = allCorrelations.filter(row => {
    const matchesSearch = row.sid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || row.matchStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CMCD/CMSD Bridge</h2>
          <p className="text-muted-foreground">Client-server telemetry correlation</p>
        </div>
        <Badge variant="outline" className="text-sm">CMCD/CMSD</Badge>
      </div>

      {/* CMCD Telemetry Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buffer Length</CardTitle>
            <span className="text-xs text-muted-foreground">bl</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCMCDData.bl}ms</div>
            <p className="text-xs text-muted-foreground">Current buffer duration</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buffer Starvation</CardTitle>
            <span className="text-xs text-muted-foreground">bs</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCMCDData.bs ? (
                <span className="text-red-500">Active</span>
              ) : (
                <span className="text-green-500">Normal</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Starvation status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bitrate</CardTitle>
            <span className="text-xs text-muted-foreground">br</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(mockCMCDData.br / 1000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Current rendition</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <span className="text-xs text-muted-foreground">mtp</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(mockCMCDData.mtp / 1000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Measured throughput</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deadline</CardTitle>
            <span className="text-xs text-muted-foreground">dl</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCMCDData.dl}ms</div>
            <p className="text-xs text-muted-foreground">Segment deadline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Startup</CardTitle>
            <span className="text-xs text-muted-foreground">su</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCMCDData.su ? (
                <span className="text-blue-500">Yes</span>
              ) : (
                <span className="text-gray-500">No</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Startup phase</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session ID</CardTitle>
            <span className="text-xs text-muted-foreground">sid</span>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono break-all">{mockCMCDData.sid}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique session identifier</p>
          </CardContent>
        </Card>
      </div>

      {/* CMSD Server Hints */}
      <Card>
        <CardHeader>
          <CardTitle>CMSD Server Hints</CardTitle>
          <CardDescription>Server-provided optimization signals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estimated Throughput</span>
                <span className="text-xs text-muted-foreground">etp</span>
              </div>
              <div className="text-2xl font-bold">{(mockCMSDData.etp / 1000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">Server estimate</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Bitrate</span>
                <span className="text-xs text-muted-foreground">mb</span>
              </div>
              <div className="text-2xl font-bold">{(mockCMSDData.mb / 1000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">Available maximum</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Round-Trip Time</span>
                <span className="text-xs text-muted-foreground">rtt</span>
              </div>
              <div className="text-2xl font-bold">{mockCMSDData.rtt}ms</div>
              <p className="text-xs text-muted-foreground">Network latency</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Correlation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Session Correlation Table</CardTitle>
          <CardDescription>CDN logs joined with client beacons via session ID</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Session ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filterStatus === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("matched")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filterStatus === "matched"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Matched
              </button>
              <button
                onClick={() => setFilterStatus("mismatch")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filterStatus === "mismatch"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Mismatches
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredCorrelations.length} of {allCorrelations.length} sessions
          </div>

          {/* Table */}
          <div className="relative overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Session ID</th>
                  <th className="text-left p-3 font-semibold">Timestamp</th>
                  <th className="text-right p-3 font-semibold">CDN TTFB</th>
                  <th className="text-right p-3 font-semibold">Client TTFB</th>
                  <th className="text-right p-3 font-semibold">Buffer Level</th>
                  <th className="text-right p-3 font-semibold">Bitrate</th>
                  <th className="text-center p-3 font-semibold">Match Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCorrelations.map((row) => {
                  const isMismatch = row.matchStatus === "mismatch";
                  const ttfbDiff = Math.abs(row.clientTTFB - row.cdnTTFB);
                  
                  return (
                    <tr 
                      key={row.sid} 
                      className={`border-b transition-colors hover:bg-muted/50 ${
                        isMismatch ? "bg-red-50 dark:bg-red-950/20" : ""
                      }`}
                    >
                      <td className="p-3 font-mono text-xs">{row.sid}</td>
                      <td className="p-3 text-xs">
                        {new Date(row.timestamp).toLocaleTimeString()}
                      </td>
                      <td className={`p-3 text-right font-medium ${
                        isMismatch && row.cdnTTFB < 50 ? "text-green-600 dark:text-green-400" : ""
                      }`}>
                        {row.cdnTTFB}ms
                      </td>
                      <td className={`p-3 text-right font-medium ${
                        isMismatch && row.clientTTFB > 50 ? "text-red-600 dark:text-red-400" : ""
                      }`}>
                        {row.clientTTFB}ms
                      </td>
                      <td className="p-3 text-right">{row.bufferLevel}ms</td>
                      <td className="p-3 text-right">{(row.bitrate / 1000).toFixed(1)}M</td>
                      <td className="p-3 text-center">
                        <Badge
                          variant={row.matchStatus === "matched" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {row.matchStatus}
                          {isMismatch && ttfbDiff > 30 && ` (+${ttfbDiff}ms)`}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mismatch explanation */}
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Mismatch Detection:</strong> Rows highlighted in red indicate cases where CDN reports fast delivery (&lt;50ms TTFB) 
              but the client experienced slow response (&gt;50ms TTFB). This suggests last-mile network issues, device performance problems, 
              or client-side interference.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
