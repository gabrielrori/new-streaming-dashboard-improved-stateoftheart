import { PlayerHealthMetrics, VHSStats, TimeSeriesDataPoint } from '../types';

/**
 * Generate realistic player health metrics
 * Target: 0.1% dropped frames, VHS (Video.js HTTP Streaming) stats
 */
export function generatePlayerHealthMetrics(timeRangeMinutes: number = 60): PlayerHealthMetrics {
  const now = Date.now();
  
  // Frame metrics
  const decodedFrames = 108000 + Math.floor(Math.random() * 10000); // ~30fps * 60min
  const droppedFrames = Math.floor(decodedFrames * 0.001); // 0.1%
  const droppedFramesPercentage = (droppedFrames / decodedFrames) * 100;
  const corruptedFrames = Math.floor(Math.random() * 5); // Very rare
  
  // VHS (Video.js HTTP Streaming) stats
  const vhsStats = generateVHSStats();
  
  // Error and warning counts
  const errorCount = Math.floor(Math.random() * 8) + 2; // 2-10 errors
  const warningCount = Math.floor(Math.random() * 30) + 15; // 15-45 warnings
  
  // Generate health score history
  const history = generateHealthScoreHistory(timeRangeMinutes, now);
  
  return {
    droppedFrames,
    droppedFramesPercentage: Math.round(droppedFramesPercentage * 1000) / 1000,
    decodedFrames,
    corruptedFrames,
    vhsStats,
    errorCount,
    warningCount,
    timestamp: now,
    history,
  };
}

/**
 * Generate VHS (Video.js HTTP Streaming) statistics
 */
export function generateVHSStats(): VHSStats {
  const currentLevel = Math.floor(Math.random() * 5); // 0-4 quality levels
  const levelSwitches = Math.floor(Math.random() * 25) + 15; // 15-40 switches
  const bandwidth = 5500 + Math.floor(Math.random() * 3000); // 5.5-8.5 Mbps in kbps
  
  // HTTP request stats
  const mediaRequests = 1850 + Math.floor(Math.random() * 200); // Total segment requests
  const mediaRequestsFailed = Math.floor(mediaRequests * 0.005); // 0.5% failure rate
  const segmentLoads = mediaRequests - mediaRequestsFailed; // Successful loads
  
  // Calculate media seconds loaded (each segment ~4 seconds)
  const mediaSecondsLoaded = segmentLoads * 4 + Math.floor(Math.random() * 100 - 50);
  
  return {
    currentLevel,
    levelSwitches,
    bandwidth,
    mediaRequests,
    mediaRequestsFailed,
    segmentLoads,
    mediaSecondsLoaded,
  };
}

/**
 * Generate player health score history
 */
function generateHealthScoreHistory(minutes: number, endTime: number): TimeSeriesDataPoint[] {
  const history: TimeSeriesDataPoint[] = [];
  const intervalMs = 60000; // 1 minute intervals
  const points = Math.min(minutes, 120);
  
  for (let i = 0; i < points; i++) {
    const timestamp = endTime - (points - i) * intervalMs;
    
    // Health score based on dropped frames, errors, playback stability
    const baseHealth = 95;
    const droppedFramesPenalty = Math.random() * 3; // Occasional frame drops
    const errorPenalty = Math.random() > 0.95 ? Math.random() * 5 : 0; // Occasional errors
    const performanceVariation = Math.sin(i / 15) * 2;
    
    const health = Math.max(70, Math.min(100, 
      baseHealth - droppedFramesPenalty - errorPenalty + performanceVariation
    ));
    
    history.push({
      timestamp,
      value: Math.round(health * 10) / 10,
    });
  }
  
  return history;
}

/**
 * Generate dropped frames over time
 */
export function generateDroppedFramesTimeSeries(minutes: number = 60): TimeSeriesDataPoint[] {
  const now = Date.now();
  const points = Math.min(minutes * 2, 120); // 30-second intervals
  const intervalMs = 30000;
  const data: TimeSeriesDataPoint[] = [];
  
  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * intervalMs;
    
    // Dropped frames are usually low, with occasional spikes
    const baseDropped = 1 + Math.random() * 2; // 1-3 frames per 30s
    const spike = Math.random() > 0.95 ? Math.random() * 20 : 0; // Occasional spike
    
    const dropped = Math.floor(baseDropped + spike);
    
    data.push({
      timestamp,
      value: dropped,
    });
  }
  
  return data;
}

/**
 * Generate codec information
 */
export function generateCodecInfo(): {
  video: string;
  audio: string;
  container: string;
  resolution: string;
  framerate: number;
  bitDepth: number;
  colorSpace: string;
} {
  const codecs = [
    { video: 'avc1.64002a', audio: 'mp4a.40.2', name: 'H.264/AAC' },
    { video: 'hev1.1.6.L120.90', audio: 'mp4a.40.2', name: 'H.265/AAC' },
    { video: 'av01.0.08M.08', audio: 'opus', name: 'AV1/Opus' },
  ];
  
  const selectedCodec = codecs[Math.floor(Math.random() * codecs.length)];
  
  return {
    video: selectedCodec.video,
    audio: selectedCodec.audio,
    container: 'mp4',
    resolution: '1920x1080',
    framerate: Math.random() > 0.5 ? 30 : 60,
    bitDepth: Math.random() > 0.7 ? 10 : 8,
    colorSpace: 'bt709',
  };
}

/**
 * Generate playback error events
 */
export function generateErrorEvents(minutes: number = 60): Array<{
  timestamp: number;
  errorCode: string;
  errorMessage: string;
  severity: 'warning' | 'error' | 'critical';
  resolved: boolean;
  resolutionTimeMs?: number;
}> {
  const now = Date.now();
  const events: Array<{
    timestamp: number;
    errorCode: string;
    errorMessage: string;
    severity: 'warning' | 'error' | 'critical';
    resolved: boolean;
    resolutionTimeMs?: number;
  }> = [];
  
  const errorTypes = [
    { code: 'MANIFEST_LOAD_ERROR', message: 'Failed to load manifest', severity: 'error' as const },
    { code: 'SEGMENT_LOAD_ERROR', message: 'Failed to load media segment', severity: 'warning' as const },
    { code: 'BUFFER_STALLED', message: 'Buffer stalled, waiting for data', severity: 'warning' as const },
    { code: 'DECODE_ERROR', message: 'Failed to decode frame', severity: 'error' as const },
    { code: 'NETWORK_ERROR', message: 'Network connection lost', severity: 'critical' as const },
    { code: 'LEVEL_LOAD_ERROR', message: 'Failed to load quality level', severity: 'warning' as const },
  ];
  
  const eventCount = Math.floor(Math.random() * 15) + 5; // 5-20 events
  
  for (let i = 0; i < eventCount; i++) {
    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    const timestamp = now - Math.floor(Math.random() * minutes * 60000);
    const resolved = Math.random() > 0.2; // 80% resolved
    const resolutionTimeMs = resolved ? 500 + Math.floor(Math.random() * 4500) : undefined;
    
    events.push({
      timestamp,
      errorCode: errorType.code,
      errorMessage: errorType.message,
      severity: errorType.severity,
      resolved,
      resolutionTimeMs,
    });
  }
  
  return events.sort((a, b) => b.timestamp - a.timestamp); // Most recent first
}

/**
 * Generate buffer health metrics
 */
export function generateBufferHealth(): {
  level: number;
  target: number;
  min: number;
  max: number;
  underrunCount: number;
  overrunCount: number;
} {
  const target = 20; // 20 seconds target buffer
  const level = 15 + Math.random() * 15; // 15-30 seconds current
  const min = 5;
  const max = 45;
  const underrunCount = Math.floor(Math.random() * 5); // Times buffer went below min
  const overrunCount = Math.floor(Math.random() * 3); // Times buffer exceeded max
  
  return {
    level: Math.round(level * 10) / 10,
    target,
    min,
    max,
    underrunCount,
    overrunCount,
  };
}

/**
 * Calculate player health score (0-100)
 */
export function calculatePlayerHealth(metrics: PlayerHealthMetrics): number {
  // Dropped frames penalty (lower is better)
  const droppedFramesScore = Math.max(0, 100 - (metrics.droppedFramesPercentage * 100));
  
  // VHS error rate (lower is better)
  const errorRate = metrics.vhsStats.mediaRequestsFailed / metrics.vhsStats.mediaRequests;
  const errorScore = Math.max(0, 100 - (errorRate * 1000));
  
  // Overall error count (lower is better)
  const totalErrorsScore = Math.max(0, 100 - (metrics.errorCount * 5));
  
  // Weighted average
  const score = (
    droppedFramesScore * 0.4 +
    errorScore * 0.35 +
    totalErrorsScore * 0.25
  );
  
  return Math.round(score);
}

/**
 * Generate playback session diagnostics
 */
export function generateSessionDiagnostics(): {
  sessionId: string;
  duration: number;
  playbackStalls: number;
  seekOperations: number;
  qualitySwitches: number;
  averageBitrate: number;
  startupTime: number;
  totalRebufferTime: number;
  finalQuality: string;
} {
  return {
    sessionId: Math.random().toString(36).substring(2, 15),
    duration: 2700 + Math.floor(Math.random() * 900), // 45-60 minutes
    playbackStalls: Math.floor(Math.random() * 3),
    seekOperations: Math.floor(Math.random() * 8),
    qualitySwitches: Math.floor(Math.random() * 20) + 10,
    averageBitrate: 4500 + Math.floor(Math.random() * 2000), // kbps
    startupTime: 1200 + Math.floor(Math.random() * 800), // ms
    totalRebufferTime: Math.floor(Math.random() * 3000), // ms
    finalQuality: ['1080p', '720p', '1080p', '1080p'][Math.floor(Math.random() * 4)], // Mostly 1080p
  };
}
