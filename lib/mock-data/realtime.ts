import { RealtimeMetrics, TimeSeriesDataPoint } from '../types';

/**
 * Generate realistic realtime metrics
 * Target: 47K viewers, QoE 87/100, 156 active streams
 */
export function generateRealtimeMetrics(timeRangeMinutes: number = 60): RealtimeMetrics {
  const now = Date.now();
  const baseViewers = 47000;
  const baseStreams = 156;
  const qoeScore = 87;
  
  // Generate viewer trend over time range
  const viewersTrend: TimeSeriesDataPoint[] = [];
  const intervalMs = 60000; // 1 minute intervals
  const points = Math.min(timeRangeMinutes, 120); // Max 120 points
  
  let peakViewers = baseViewers;
  
  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * intervalMs;
    
    // Realistic viewer fluctuation: sine wave + random noise
    const timeOfDay = new Date(timestamp).getHours();
    const dailyPattern = Math.sin((timeOfDay - 6) / 24 * Math.PI * 2) * 0.15; // Peak evening
    const randomNoise = (Math.random() - 0.5) * 0.05;
    const shortTermTrend = Math.sin(i / points * Math.PI) * 0.1; // Gradual rise/fall
    
    const multiplier = 1 + dailyPattern + randomNoise + shortTermTrend;
    const viewers = Math.round(baseViewers * multiplier);
    
    if (viewers > peakViewers) {
      peakViewers = viewers;
    }
    
    viewersTrend.push({
      timestamp,
      value: viewers,
    });
  }
  
  return {
    currentViewers: viewersTrend[viewersTrend.length - 1]?.value || baseViewers,
    peakViewers,
    activeStreams: baseStreams + Math.floor(Math.random() * 10 - 5), // ±5 variation
    qoeScore: qoeScore + (Math.random() * 4 - 2), // 85-89 range
    viewersTrend,
    timestamp: now,
  };
}

/**
 * Generate viewer count with time-of-day pattern
 */
export function generateViewerCount(timestamp: number = Date.now()): number {
  const baseViewers = 47000;
  const hour = new Date(timestamp).getHours();
  
  // Time-of-day multiplier (peak 18:00-23:00)
  let multiplier = 1.0;
  if (hour >= 18 && hour <= 23) {
    multiplier = 1.3; // Peak evening traffic
  } else if (hour >= 12 && hour < 18) {
    multiplier = 1.1; // Afternoon
  } else if (hour >= 0 && hour < 6) {
    multiplier = 0.6; // Late night/early morning
  } else {
    multiplier = 0.85; // Morning
  }
  
  const noise = (Math.random() - 0.5) * 0.1;
  return Math.round(baseViewers * multiplier * (1 + noise));
}

/**
 * Generate active stream count
 */
export function generateActiveStreams(): number {
  const baseStreams = 156;
  const variation = Math.floor(Math.random() * 20 - 10); // ±10 streams
  return Math.max(140, baseStreams + variation);
}

/**
 * Generate QoE score (0-100)
 */
export function generateQoEScore(): number {
  const baseScore = 87;
  const variation = Math.random() * 6 - 3; // ±3 points
  return Math.max(70, Math.min(100, baseScore + variation));
}
