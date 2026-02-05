import { EngagementMetrics, WatchTimeBucket, AbandonPoint } from '../types';

/**
 * Generate realistic engagement metrics
 * Target: 72% completion, watch time distribution, abandon heatmap data
 */
export function generateEngagementMetrics(): EngagementMetrics {
  const now = Date.now();
  
  // Completion rate (percentage of viewers who watched to end)
  const completionRate = 72 + (Math.random() * 6 - 3); // 69-75%
  
  // Average watch time
  const averageWatchTimeSeconds = 2850 + Math.floor(Math.random() * 600 - 300); // ~45-50 min
  
  // Watch time distribution buckets
  const watchTimeDistribution = generateWatchTimeDistribution();
  
  // Abandon heatmap (where viewers drop off)
  const abandonHeatmap = generateAbandonHeatmap();
  
  // Player interaction rates
  const playRate = 98.5 + (Math.random() * 1); // 98.5-99.5%
  const pauseRate = 35 + (Math.random() * 10); // 35-45% pause at least once
  const seekCount = Math.floor(Math.random() * 5) + 2; // 2-6 seeks on average
  const replayCount = Math.floor(Math.random() * 100) + 50; // Total replays
  
  return {
    completionRate: Math.round(completionRate * 100) / 100,
    averageWatchTimeSeconds,
    watchTimeDistribution,
    abandonHeatmap,
    playRate: Math.round(playRate * 100) / 100,
    pauseRate: Math.round(pauseRate * 100) / 100,
    seekCount,
    replayCount,
    timestamp: now,
  };
}

/**
 * Generate watch time distribution across buckets
 */
export function generateWatchTimeDistribution(): WatchTimeBucket[] {
  const buckets = [
    { bucket: '0-5min', basePercentage: 8 },
    { bucket: '5-10min', basePercentage: 5 },
    { bucket: '10-20min', basePercentage: 7 },
    { bucket: '20-30min', basePercentage: 9 },
    { bucket: '30-45min', basePercentage: 12 },
    { bucket: '45-60min', basePercentage: 18 },
    { bucket: '60min+', basePercentage: 41 }, // Completion
  ];
  
  const totalViewers = 47000;
  let totalPercentage = 0;
  
  const distribution = buckets.map(b => {
    const variation = Math.random() * 4 - 2; // ±2%
    const percentage = Math.max(0, b.basePercentage + variation);
    totalPercentage += percentage;
    
    return {
      bucket: b.bucket,
      count: 0,
      percentage: Math.round(percentage * 100) / 100,
    };
  });
  
  // Normalize to 100%
  distribution.forEach(d => {
    d.percentage = (d.percentage / totalPercentage) * 100;
    d.percentage = Math.round(d.percentage * 100) / 100;
    d.count = Math.floor((d.percentage / 100) * totalViewers);
  });
  
  return distribution;
}

/**
 * Generate abandon heatmap showing where viewers drop off
 */
export function generateAbandonHeatmap(): AbandonPoint[] {
  const points: AbandonPoint[] = [];
  const totalViewers = 47000;
  const videoDurationSeconds = 3600; // 60 min video
  
  // Sample points throughout the video
  const samplePoints = 60; // One point per minute
  const intervalSeconds = videoDurationSeconds / samplePoints;
  
  let remainingViewers = totalViewers;
  
  for (let i = 0; i < samplePoints; i++) {
    const timeSeconds = i * intervalSeconds;
    
    // Abandon rate varies throughout video
    let abandonRate = 0.005; // Base 0.5% per minute
    
    // Higher abandon at start (first 5 minutes)
    if (i < 5) {
      abandonRate = 0.015 - (i * 0.002); // 1.5% -> 0.7%
    }
    
    // Slightly higher at mid-point (bathroom break, attention wane)
    if (i >= 25 && i <= 35) {
      abandonRate = 0.008;
    }
    
    // Lower at the end (committed viewers)
    if (i >= 50) {
      abandonRate = 0.003;
    }
    
    // Random spikes (e.g., boring moments)
    if (Math.random() > 0.9) {
      abandonRate *= 1.5;
    }
    
    const abandonCount = Math.floor(remainingViewers * abandonRate);
    remainingViewers -= abandonCount;
    
    if (abandonCount > 0) {
      points.push({
        timeSeconds: Math.round(timeSeconds),
        abandonCount,
        percentage: Math.round((abandonCount / totalViewers) * 10000) / 100,
      });
    }
  }
  
  return points;
}

/**
 * Generate engagement score over time
 */
export function generateEngagementTimeSeries(minutes: number = 60): Array<{
  timestamp: number;
  engagementScore: number;
  activeViewers: number;
  interactions: number;
}> {
  const now = Date.now();
  const points = Math.min(minutes, 120);
  const intervalMs = 60000; // 1 minute
  const data: Array<{
    timestamp: number;
    engagementScore: number;
    activeViewers: number;
    interactions: number;
  }> = [];
  
  const baseViewers = 47000;
  
  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * intervalMs;
    
    // Engagement varies throughout stream
    const timeVariation = Math.sin(i / 10) * 15;
    const randomNoise = (Math.random() - 0.5) * 10;
    const engagementScore = Math.max(50, Math.min(100, 75 + timeVariation + randomNoise));
    
    // Active viewers (slightly less than total)
    const activePercentage = 0.85 + Math.random() * 0.1; // 85-95% active
    const activeViewers = Math.floor(baseViewers * activePercentage);
    
    // Interactions (plays, pauses, seeks)
    const interactions = Math.floor(activeViewers * (0.02 + Math.random() * 0.03)); // 2-5%
    
    data.push({
      timestamp,
      engagementScore: Math.round(engagementScore * 10) / 10,
      activeViewers,
      interactions,
    });
  }
  
  return data;
}

/**
 * Generate interaction events breakdown
 */
export function generateInteractionEvents(): Array<{
  type: string;
  count: number;
  percentage: number;
}> {
  const events = [
    { type: 'play', baseCount: 48500 },
    { type: 'pause', baseCount: 16800 },
    { type: 'seek-forward', baseCount: 8200 },
    { type: 'seek-backward', baseCount: 4100 },
    { type: 'volume-change', baseCount: 12500 },
    { type: 'fullscreen', baseCount: 28000 },
    { type: 'quality-change', baseCount: 3200 },
    { type: 'replay', baseCount: 850 },
  ];
  
  const totalEvents = events.reduce((sum, e) => sum + e.baseCount, 0);
  
  return events.map(event => {
    const variation = Math.floor(Math.random() * 1000 - 500);
    const count = Math.max(0, event.baseCount + variation);
    const percentage = (count / totalEvents) * 100;
    
    return {
      type: event.type,
      count,
      percentage: Math.round(percentage * 100) / 100,
    };
  });
}

/**
 * Generate retention curve (percentage of viewers over time)
 */
export function generateRetentionCurve(durationMinutes: number = 60): Array<{
  timeMinutes: number;
  retentionPercentage: number;
  viewers: number;
}> {
  const curve: Array<{ timeMinutes: number; retentionPercentage: number; viewers: number }> = [];
  const initialViewers = 47000;
  const points = durationMinutes;
  
  for (let i = 0; i <= points; i++) {
    // Retention curve: exponential decay with plateaus
    let retention = 100;
    
    if (i > 0) {
      // Sharp drop in first 5 minutes
      const earlyDrop = Math.min(i, 5) * 2; // 10% in first 5 min
      
      // Gradual decline after
      const laterDrop = i > 5 ? (i - 5) * 0.4 : 0; // 0.4% per min after
      
      retention = 100 - earlyDrop - laterDrop;
    }
    
    // Add some randomness
    retention += (Math.random() - 0.5) * 2;
    retention = Math.max(25, Math.min(100, retention)); // Keep between 25-100%
    
    const viewers = Math.floor(initialViewers * (retention / 100));
    
    curve.push({
      timeMinutes: i,
      retentionPercentage: Math.round(retention * 100) / 100,
      viewers,
    });
  }
  
  return curve;
}

/**
 * Calculate engagement health score (0-100)
 */
export function calculateEngagementHealth(metrics: EngagementMetrics): number {
  // Completion rate is primary indicator
  const completionScore = metrics.completionRate;
  
  // Play rate should be high
  const playScore = metrics.playRate;
  
  // Average watch time (target 45+ min out of 60 min content)
  const watchTimeScore = Math.min(100, (metrics.averageWatchTimeSeconds / 2700) * 100);
  
  // Weighted average
  const score = completionScore * 0.5 + playScore * 0.3 + watchTimeScore * 0.2;
  
  return Math.round(score);
}
