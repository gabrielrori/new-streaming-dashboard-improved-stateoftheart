import { ABRMetrics, BitrateDistribution, TimeSeriesDataPoint } from '../types';

/**
 * Generate realistic ABR (Adaptive Bitrate) metrics
 * Target: bitrate 2-8Mbps timeline, 60% at 1080p/30% at 720p/10% at 480p
 */
export function generateABRMetrics(timeRangeMinutes: number = 60): ABRMetrics {
  const now = Date.now();
  
  // Quality distribution (matches target)
  const distribution: BitrateDistribution = {
    '480p': 10 + (Math.random() * 4 - 2), // 8-12%
    '720p': 30 + (Math.random() * 6 - 3), // 27-33%
    '1080p': 60 + (Math.random() * 6 - 3), // 57-63%
  };
  
  // Generate bitrate history (2-8 Mbps range)
  const bitrateHistory = generateBitrateTimeline(timeRangeMinutes, now);
  
  const currentBitrateMbps = bitrateHistory[bitrateHistory.length - 1]?.value || 5.5;
  const averageBitrateMbps = 
    bitrateHistory.reduce((sum, point) => sum + point.value, 0) / bitrateHistory.length;
  
  // ABR switch metrics
  const switchCount = Math.floor(timeRangeMinutes / 5) + Math.floor(Math.random() * 10); // ~1 switch per 5 min
  const upshifts = Math.floor(switchCount * (0.55 + Math.random() * 0.1)); // Slightly more upshifts
  const downshifts = switchCount - upshifts;
  
  return {
    currentBitrateMbps: Math.round(currentBitrateMbps * 100) / 100,
    bitrateHistory,
    distribution,
    switchCount,
    upshifts,
    downshifts,
    averageBitrateMbps: Math.round(averageBitrateMbps * 100) / 100,
    timestamp: now,
  };
}

/**
 * Generate bitrate timeline with realistic ABR behavior
 * Range: 2-8 Mbps with adaptive switching
 */
export function generateBitrateTimeline(minutes: number, endTime: number): TimeSeriesDataPoint[] {
  const timeline: TimeSeriesDataPoint[] = [];
  const intervalMs = 10000; // 10 second intervals for more granular ABR data
  const points = Math.min(minutes * 6, 360); // Max 360 points (1 hour at 10s intervals)
  
  // Bitrate levels (Mbps)
  const bitrateLevels = [2.0, 3.5, 5.0, 6.5, 8.0];
  let currentLevelIndex = 2; // Start at 5.0 Mbps (1080p)
  
  for (let i = 0; i < points; i++) {
    const timestamp = endTime - (points - i) * intervalMs;
    
    // Simulate ABR decisions based on "network conditions"
    const networkQuality = 0.5 + Math.sin(i / 20) * 0.3 + (Math.random() - 0.5) * 0.2;
    
    // Decide if we should switch bitrate
    if (Math.random() < 0.05) { // 5% chance of switch per interval
      if (networkQuality > 0.7 && currentLevelIndex < bitrateLevels.length - 1) {
        currentLevelIndex++; // Upshift
      } else if (networkQuality < 0.4 && currentLevelIndex > 0) {
        currentLevelIndex--; // Downshift
      }
    }
    
    const bitrate = bitrateLevels[currentLevelIndex];
    const noise = (Math.random() - 0.5) * 0.2; // Small fluctuations
    
    timeline.push({
      timestamp,
      value: Math.max(2.0, Math.min(8.0, Math.round((bitrate + noise) * 100) / 100)),
    });
  }
  
  return timeline;
}

/**
 * Generate quality distribution based on network conditions
 */
export function generateQualityDistribution(avgNetworkMbps: number = 15): BitrateDistribution {
  // Better network = higher quality distribution
  let dist: BitrateDistribution;
  
  if (avgNetworkMbps >= 20) {
    // Excellent network
    dist = {
      '480p': 5,
      '720p': 20,
      '1080p': 75,
    };
  } else if (avgNetworkMbps >= 10) {
    // Good network (default)
    dist = {
      '480p': 10,
      '720p': 30,
      '1080p': 60,
    };
  } else {
    // Poor network
    dist = {
      '480p': 25,
      '720p': 50,
      '1080p': 25,
    };
  }
  
  // Add some randomness
  const adjust = (val: number) => Math.max(0, Math.min(100, val + (Math.random() * 6 - 3)));
  
  return {
    '480p': Math.round(adjust(dist['480p'])),
    '720p': Math.round(adjust(dist['720p'])),
    '1080p': Math.round(adjust(dist['1080p'])),
  };
}

/**
 * Calculate ABR efficiency score (0-100)
 * Higher is better: fewer switches, higher average bitrate
 */
export function calculateABREfficiency(metrics: ABRMetrics): number {
  const switchPenalty = Math.min(50, metrics.switchCount * 0.5); // Max -50 points
  const bitrateScore = (metrics.averageBitrateMbps / 8) * 50; // Max 50 points
  const stabilityBonus = (metrics.upshifts / Math.max(1, metrics.switchCount)) * 20; // Max 20 points
  
  return Math.round(Math.max(0, Math.min(100, bitrateScore + stabilityBonus - switchPenalty)));
}
