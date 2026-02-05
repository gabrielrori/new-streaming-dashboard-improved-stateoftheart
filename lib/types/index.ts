// Core Time-Series Data Point
export interface TimeSeriesDataPoint {
  timestamp: number;
  value: number;
}

// Realtime Metrics
export interface RealtimeMetrics {
  currentViewers: number;
  peakViewers: number;
  activeStreams: number;
  qoeScore: number; // 0-100
  viewersTrend: TimeSeriesDataPoint[];
  timestamp: number;
}

// Quality of Experience Metrics
export interface TTFFMetrics {
  p50: number; // milliseconds
  p95: number;
  p99: number;
  average: number;
}

export interface QoEMetrics {
  ttff: TTFFMetrics;
  rebufferRatio: number; // percentage
  rebufferCount: number;
  rebufferDuration: number; // milliseconds
  startupFailureRate: number; // percentage
  playbackFailureRate: number; // percentage
  videoBitrateKbps: number;
  audioBitrateKbps: number;
  framerate: number;
  timestamp: number;
  history: TimeSeriesDataPoint[];
}

// Adaptive Bitrate (ABR) Metrics
export interface BitrateDistribution {
  '480p': number; // percentage
  '720p': number;
  '1080p': number;
  '1440p'?: number;
  '4K'?: number;
}

export interface ABRMetrics {
  currentBitrateMbps: number;
  bitrateHistory: TimeSeriesDataPoint[];
  distribution: BitrateDistribution;
  switchCount: number;
  upshifts: number;
  downshifts: number;
  averageBitrateMbps: number;
  timestamp: number;
}

// CDN Metrics
export interface CDNMetrics {
  cacheHitRatio: number; // percentage
  edgeTTFB: {
    p50: number; // milliseconds
    p95: number;
    p99: number;
  };
  originTTFB: {
    p50: number;
    p95: number;
    p99: number;
  };
  bandwidth: number; // Gbps
  requestsPerSecond: number;
  errorRate: number; // percentage
  bytesServed: number;
  timestamp: number;
  regionalPerformance: RegionalCDNMetrics[];
}

export interface RegionalCDNMetrics {
  region: string;
  cacheHitRatio: number;
  ttfbMs: number;
  bandwidth: number;
  viewers: number;
}

// Network Metrics
export interface NetworkMetrics {
  clientTTFB: TimeSeriesDataPoint[];
  throughputMbps: TimeSeriesDataPoint[];
  connectionTypes: ConnectionTypeDistribution;
  latencyMs: {
    p50: number;
    p95: number;
    p99: number;
  };
  packetLoss: number; // percentage
  jitter: number; // milliseconds
  timestamp: number;
}

export interface ConnectionTypeDistribution {
  wifi: number; // percentage
  cellular: number;
  ethernet: number;
  unknown: number;
}

// CMCD (Common Media Client Data) Metrics
export interface CMCDMetrics {
  bufferLength: TimeSeriesDataPoint[];
  bufferStarvationEvents: number;
  sessionCount: number;
  objectType: {
    video: number; // percentage
    audio: number;
    manifest: number;
    other: number;
  };
  streamType: {
    live: number; // percentage
    vod: number;
  };
  correlatedSessions: CMCDSession[];
  timestamp: number;
}

export interface CMCDSession {
  sessionId: string;
  bufferLength: number;
  bitrate: number;
  objectRequests: number;
  starvationEvents: number;
  startTime: number;
}

// Engagement Metrics
export interface EngagementMetrics {
  completionRate: number; // percentage
  averageWatchTimeSeconds: number;
  watchTimeDistribution: WatchTimeBucket[];
  abandonHeatmap: AbandonPoint[];
  playRate: number; // percentage
  pauseRate: number;
  seekCount: number;
  replayCount: number;
  timestamp: number;
}

export interface WatchTimeBucket {
  bucket: string; // e.g., "0-5min", "5-10min"
  count: number;
  percentage: number;
}

export interface AbandonPoint {
  timeSeconds: number;
  abandonCount: number;
  percentage: number;
}

// Player Health Metrics
export interface PlayerHealthMetrics {
  droppedFrames: number;
  droppedFramesPercentage: number;
  decodedFrames: number;
  corruptedFrames: number;
  vhsStats: VHSStats;
  errorCount: number;
  warningCount: number;
  timestamp: number;
  history: TimeSeriesDataPoint[];
}

export interface VHSStats {
  currentLevel: number;
  levelSwitches: number;
  bandwidth: number;
  mediaRequests: number;
  mediaRequestsFailed: number;
  segmentLoads: number;
  mediaSecondsLoaded: number;
}

// Durable Objects Metrics
export interface DurableObjectMetrics {
  sessionObjects: DurableObjectStats;
  streamObjects: DurableObjectStats;
  regionalObjects: DurableObjectStats;
  edgeObjects: DurableObjectStats;
  totalObjects: number;
  timestamp: number;
}

export interface DurableObjectStats {
  count: number;
  activeCount: number;
  cpuTimeMs: number;
  requestCount: number;
  errorCount: number;
  memoryMB: number;
}

// Aggregated Dashboard Data
export interface DashboardData {
  realtime: RealtimeMetrics;
  qoe: QoEMetrics;
  abr: ABRMetrics;
  cdn: CDNMetrics;
  network: NetworkMetrics;
  cmcd: CMCDMetrics;
  engagement: EngagementMetrics;
  playerHealth: PlayerHealthMetrics;
  durableObjects: DurableObjectMetrics;
}

// Time range options for queries
export type TimeRange = '5m' | '15m' | '1h' | '6h' | '24h' | '7d' | '30d';

export interface TimeRangeConfig {
  range: TimeRange;
  startTime: number;
  endTime: number;
  intervalMs: number;
}
