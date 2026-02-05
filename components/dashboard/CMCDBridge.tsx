"use client";

import { useState } from "react";
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

      {/* 2-COLUMN LAYOUT: CMCD (Client) | CMSD (Server) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CMCD - Client Signals */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">CMCD - Client Signals</h3>
              <p className="text-xs text-zinc-400 mt-1">Client-side telemetry data</p>
            </div>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
              Client
            </Badge>
          </div>

          <div className="space-y-3">
            {/* Buffer Length */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">Buffer Length (bl)</span>
                <span className="text-2xl font-bold text-zinc-100">{mockCMCDData.bl}ms</span>
              </div>
              <p className="text-xs text-zinc-500">Current buffer duration</p>
            </div>

            {/* Buffer Starvation */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">Buffer Starvation (bs)</span>
                <span className={`text-2xl font-bold ${mockCMCDData.bs ? 'text-red-400' : 'text-green-400'}`}>
                  {mockCMCDData.bs ? "Active" : "Normal"}
                </span>
              </div>
              <p className="text-xs text-zinc-500">Starvation status</p>
            </div>

            {/* Bitrate */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">Bitrate (br)</span>
                <span className="text-2xl font-bold text-zinc-100">{(mockCMCDData.br / 1000).toFixed(1)}M</span>
              </div>
              <p className="text-xs text-zinc-500">Current rendition</p>
            </div>

            {/* Throughput */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">Throughput (mtp)</span>
                <span className="text-2xl font-bold text-zinc-100">{(mockCMCDData.mtp / 1000).toFixed(1)}M</span>
              </div>
              <p className="text-xs text-zinc-500">Measured throughput</p>
            </div>

            {/* Deadline */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">Deadline (dl)</span>
                <span className="text-2xl font-bold text-zinc-100">{mockCMCDData.dl}ms</span>
              </div>
              <p className="text-xs text-zinc-500">Segment deadline</p>
            </div>

            {/* Startup */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">Startup (su)</span>
                <span className={`text-2xl font-bold ${mockCMCDData.su ? 'text-blue-400' : 'text-zinc-400'}`}>
                  {mockCMCDData.su ? "Yes" : "No"}
                </span>
              </div>
              <p className="text-xs text-zinc-500">Startup phase</p>
            </div>

            {/* Session ID */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
              <span className="text-xs text-zinc-400 block mb-2">Session ID (sid)</span>
              <span className="text-sm font-mono text-zinc-100 break-all">{mockCMCDData.sid}</span>
            </div>
          </div>
        </div>

        {/* CMSD - Server Hints */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">CMSD - Server Hints</h3>
              <p className="text-xs text-zinc-400 mt-1">Server-provided optimization signals</p>
            </div>
            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
              Server
            </Badge>
          </div>

          <div className="space-y-3">
            {/* Estimated Throughput */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">Estimated Throughput (etp)</span>
                <span className="text-2xl font-bold text-zinc-100">{(mockCMSDData.etp / 1000).toFixed(1)}M</span>
              </div>
              <p className="text-xs text-zinc-500">Server estimate</p>
            </div>

            {/* Max Bitrate */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">Max Bitrate (mb)</span>
                <span className="text-2xl font-bold text-zinc-100">{(mockCMSDData.mb / 1000).toFixed(1)}M</span>
              </div>
              <p className="text-xs text-zinc-500">Available maximum</p>
            </div>

            {/* Round-Trip Time */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">Round-Trip Time (rtt)</span>
                <span className="text-2xl font-bold text-zinc-100">{mockCMSDData.rtt}ms</span>
              </div>
              <p className="text-xs text-zinc-500">Network latency</p>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="text-sm font-semibold text-green-400 mb-2">Server-Driven ABR</h4>
              <p className="text-xs text-green-300/80">
                CMSD headers enable the server to guide client ABR decisions based on real-time
                network conditions and CDN capacity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Correlation Table (Full Width) */}
      <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-1">Session Correlation Table</h3>
          <p className="text-sm text-zinc-400">CDN logs joined with client beacons via session ID</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by Session ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-white/10 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filterStatus === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/50 border border-white/10"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("matched")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filterStatus === "matched"
                  ? "bg-green-500 text-white"
                  : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/50 border border-white/10"
              }`}
            >
              Matched
            </button>
            <button
              onClick={() => setFilterStatus("mismatch")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filterStatus === "mismatch"
                  ? "bg-red-500 text-white"
                  : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/50 border border-white/10"
              }`}
            >
              Mismatches
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-zinc-400">
          Showing {filteredCorrelations.length} of {allCorrelations.length} sessions
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900/50">
              <tr className="border-b border-white/10">
                <th className="text-left p-3 font-semibold text-zinc-300">Session ID</th>
                <th className="text-left p-3 font-semibold text-zinc-300">Timestamp</th>
                <th className="text-right p-3 font-semibold text-zinc-300">CDN TTFB</th>
                <th className="text-right p-3 font-semibold text-zinc-300">Client TTFB</th>
                <th className="text-right p-3 font-semibold text-zinc-300">Buffer Level</th>
                <th className="text-right p-3 font-semibold text-zinc-300">Bitrate</th>
                <th className="text-center p-3 font-semibold text-zinc-300">Match Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCorrelations.map((row) => {
                const isMismatch = row.matchStatus === "mismatch";
                const ttfbDiff = Math.abs(row.clientTTFB - row.cdnTTFB);
                
                return (
                  <tr 
                    key={row.sid} 
                    className={`border-b border-white/5 transition-colors hover:bg-zinc-800/50 ${
                      isMismatch ? "bg-red-500/10" : ""
                    }`}
                  >
                    <td className="p-3 font-mono text-xs text-zinc-300">{row.sid}</td>
                    <td className="p-3 text-xs text-zinc-400">
                      {new Date(row.timestamp).toLocaleTimeString()}
                    </td>
                    <td className={`p-3 text-right font-medium ${
                      isMismatch && row.cdnTTFB < 50 ? "text-green-400" : "text-zinc-300"
                    }`}>
                      {row.cdnTTFB}ms
                    </td>
                    <td className={`p-3 text-right font-medium ${
                      isMismatch && row.clientTTFB > 50 ? "text-red-400" : "text-zinc-300"
                    }`}>
                      {row.clientTTFB}ms
                    </td>
                    <td className="p-3 text-right text-zinc-300">{row.bufferLevel}ms</td>
                    <td className="p-3 text-right text-zinc-300">{(row.bitrate / 1000).toFixed(1)}M</td>
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
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-300">
            <strong>Mismatch Detection:</strong> Rows highlighted in red indicate cases where CDN reports fast delivery (&lt;50ms TTFB) 
            but the client experienced slow response (&gt;50ms TTFB). This suggests last-mile network issues, device performance problems, 
            or client-side interference.
          </p>
        </div>
      </div>
    </div>
  );
}
