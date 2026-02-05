import { CMCDMetrics, CMCDSession, TimeSeriesDataPoint } from '../types';

/**
 * Generate realistic CMCD (Common Media Client Data) metrics
 * Includes buffer length, starvation events, session correlation
 */
export function generateCMCDMetrics(timeRangeMinutes: number = 60): CMCDMetrics {
  const now = Date.now();
  
  // Generate buffer length time series
  const bufferLength = generateBufferLengthTimeSeries(timeRangeMinutes, now);
  
  // Buffer starvation events (should be rare)
  const bufferStarvationEvents = Math.floor(Math.random() * 15) + 5; // 5-20 events
  
  // Active session count
  const sessionCount = 47000 + Math.floor(Math.random() * 3000 - 1500); // ~47K sessions
  
  // Object type distribution
  const objectType = {
    video: 72 + Math.random() * 6, // 72-78%
    audio: 15 + Math.random() * 4, // 15-19%
    manifest: 8 + Math.random() * 3, // 8-11%
    other: 2 + Math.random() * 2, // 2-4%
  };
  
  // Normalize to 100%
  const total = objectType.video + objectType.audio + objectType.manifest + objectType.other;
  objectType.video = (objectType.video / total) * 100;
  objectType.audio = (objectType.audio / total) * 100;
  objectType.manifest = (objectType.manifest / total) * 100;
  objectType.other = (objectType.other / total) * 100;
  
  // Stream type distribution
  const streamType = {
    live: 85 + Math.random() * 8, // 85-93% live
    vod: 7 + Math.random() * 8, // 7-15% VOD
  };
  
  const streamTotal = streamType.live + streamType.vod;
  streamType.live = (streamType.live / streamTotal) * 100;
  streamType.vod = (streamType.vod / streamTotal) * 100;
  
  // Generate correlated session samples
  const correlatedSessions = generateCorrelatedSessions(20); // Sample of 20 sessions
  
  return {
    bufferLength,
    bufferStarvationEvents,
    sessionCount,
    objectType: {
      video: Math.round(objectType.video * 10) / 10,
      audio: Math.round(objectType.audio * 10) / 10,
      manifest: Math.round(objectType.manifest * 10) / 10,
      other: Math.round(objectType.other * 10) / 10,
    },
    streamType: {
      live: Math.round(streamType.live * 10) / 10,
      vod: Math.round(streamType.vod * 10) / 10,
    },
    correlatedSessions,
    timestamp: now,
  };
}

/**
 * Generate buffer length time series (milliseconds)
 */
export function generateBufferLengthTimeSeries(minutes: number, endTime: number): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = [];
  const intervalMs = 10000; // 10 second intervals
  const points = Math.min(minutes * 6, 180);
  
  // Target buffer length: 15-30 seconds (15000-30000ms)
  for (let i = 0; i < points; i++) {
    const timestamp = endTime - (points - i) * intervalMs;
    
    // Buffer fills and drains based on network conditions
    const baseBuffer = 20000; // 20 seconds
    const networkVariation = Math.sin(i / 15) * 8000; // Periodic fluctuation
    const playerBehavior = Math.cos(i / 8) * 3000; // Player adaptive behavior
    const randomNoise = (Math.random() - 0.5) * 2000;
    
    // Occasional buffer drains (network issues)
    const drainEvent = Math.random() > 0.97 ? -Math.random() * 12000 : 0;
    
    const bufferMs = Math.max(2000, Math.min(45000, 
      baseBuffer + networkVariation + playerBehavior + randomNoise + drainEvent
    ));
    
    data.push({
      timestamp,
      value: Math.round(bufferMs),
    });
  }
  
  return data;
}

/**
 * Generate correlated session samples for analysis
 */
export function generateCorrelatedSessions(count: number = 20): CMCDSession[] {
  const now = Date.now();
  const sessions: CMCDSession[] = [];
  
  for (let i = 0; i < count; i++) {
    const sessionId = generateSessionId();
    const startTime = now - Math.floor(Math.random() * 3600000); // Started within last hour
    
    // Buffer length varies by session
    const bufferLength = 15000 + Math.floor(Math.random() * 20000); // 15-35 seconds
    
    // Bitrate correlates with buffer health
    const bufferHealth = bufferLength / 35000; // 0-1 scale
    const bitrate = Math.floor(2000 + bufferHealth * 6000); // 2-8 Mbps in kbps
    
    // Object requests (video, audio, manifest segments)
    const sessionDuration = (now - startTime) / 1000; // seconds
    const objectRequests = Math.floor(sessionDuration / 2); // ~1 request per 2 seconds
    
    // Starvation events (rare for healthy sessions)
    const starvationEvents = bufferHealth < 0.3 ? Math.floor(Math.random() * 5) : 0;
    
    sessions.push({
      sessionId,
      bufferLength,
      bitrate,
      objectRequests,
      starvationEvents,
      startTime,
    });
  }
  
  return sessions.sort((a, b) => b.bufferLength - a.bufferLength); // Sort by buffer health
}

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
  const chars = '0123456789abcdef';
  let id = '';
  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) id += '-';
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/**
 * Generate buffer starvation events over time
 */
export function generateStarvationEvents(minutes: number = 60): Array<{
  timestamp: number;
  sessionId: string;
  durationMs: number;
  bufferLevelBefore: number;
  recoveryTimeMs: number;
}> {
  const events: Array<{
    timestamp: number;
    sessionId: string;
    durationMs: number;
    bufferLevelBefore: number;
    recoveryTimeMs: number;
  }> = [];
  
  const now = Date.now();
  const eventCount = Math.floor(Math.random() * 20) + 10; // 10-30 events across all sessions
  
  for (let i = 0; i < eventCount; i++) {
    const timestamp = now - Math.floor(Math.random() * minutes * 60000);
    const durationMs = 200 + Math.floor(Math.random() * 1500); // 200ms-1.7s starvation
    const bufferLevelBefore = Math.floor(Math.random() * 5000); // Low buffer before starvation
    const recoveryTimeMs = 1000 + Math.floor(Math.random() * 4000); // 1-5s recovery
    
    events.push({
      timestamp,
      sessionId: generateSessionId(),
      durationMs,
      bufferLevelBefore,
      recoveryTimeMs,
    });
  }
  
  return events.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Calculate CMCD health score (0-100)
 */
export function calculateCMCDHealth(metrics: CMCDMetrics): number {
  // Average buffer length (higher is better, target 20s)
  const avgBuffer = metrics.bufferLength.reduce((sum, p) => sum + p.value, 0) / metrics.bufferLength.length;
  const bufferScore = Math.min(100, (avgBuffer / 20000) * 100);
  
  // Starvation events (lower is better)
  const starvationRate = metrics.bufferStarvationEvents / metrics.sessionCount * 1000; // Per 1000 sessions
  const starvationScore = Math.max(0, 100 - (starvationRate * 20));
  
  // Stream type balance (live is primary, but some VOD is good)
  const typeScore = metrics.streamType.live > 70 ? 100 : 80;
  
  // Weighted score
  const score = bufferScore * 0.5 + starvationScore * 0.4 + typeScore * 0.1;
  
  return Math.round(score);
}

/**
 * Generate object request distribution
 */
export function generateObjectRequestDistribution(): Array<{
  type: string;
  count: number;
  bytesTransferred: number;
  avgSizeKB: number;
}> {
  return [
    {
      type: 'video-segment',
      count: 1250000 + Math.floor(Math.random() * 100000),
      bytesTransferred: 45000000000 + Math.floor(Math.random() * 5000000000),
      avgSizeKB: 36000,
    },
    {
      type: 'audio-segment',
      count: 320000 + Math.floor(Math.random() * 30000),
      bytesTransferred: 2800000000 + Math.floor(Math.random() * 300000000),
      avgSizeKB: 8750,
    },
    {
      type: 'manifest',
      count: 180000 + Math.floor(Math.random() * 20000),
      bytesTransferred: 45000000 + Math.floor(Math.random() * 5000000),
      avgSizeKB: 250,
    },
    {
      type: 'init-segment',
      count: 52000 + Math.floor(Math.random() * 5000),
      bytesTransferred: 125000000 + Math.floor(Math.random() * 15000000),
      avgSizeKB: 2400,
    },
  ];
}
