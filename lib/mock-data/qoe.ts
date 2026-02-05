import { QoEMetrics, TimeSeriesDataPoint, TTFFMetrics } from '../types';

/**
 * Generate realistic QoE metrics
 * Target: TTFF p50=1.2s/p95=2.8s/p99=4.1s, rebuffer ratio 1.2%, startup failure 0.3%
 */
export function generateQoEMetrics(timeRangeMinutes: number = 60): QoEMetrics {
  const now = Date.now();
  
  // TTFF (Time To First Frame) metrics
  const ttff = generateTTFFMetrics();
  
  // Rebuffer metrics
  const rebufferRatio = 1.2 + (Math.random() * 0.6 - 0.3); // 0.9-1.5%
  const rebufferCount = Math.floor(Math.random() * 50 + 30); // 30-80 events
  const rebufferDuration = rebufferCount * (800 + Math.random() * 400); // avg 800-1200ms per event
  
  // Failure rates
  const startupFailureRate = 0.3 + (Math.random() * 0.2 - 0.1); // 0.2-0.4%
  const playbackFailureRate = 0.15 + (Math.random() * 0.1 - 0.05); // 0.1-0.2%
  
  // Current playback quality
  const videoBitrateKbps = 4500 + Math.random() * 2000; // 4.5-6.5 Mbps
  const audioBitrateKbps = 128 + Math.random() * 64; // 128-192 kbps
  const framerate = Math.random() > 0.5 ? 30 : 60;
  
  // Generate QoE score history
  const history = generateQoEHistory(timeRangeMinutes, now);
  
  return {
    ttff,
    rebufferRatio,
    rebufferCount,
    rebufferDuration,
    startupFailureRate,
    playbackFailureRate,
    videoBitrateKbps,
    audioBitrateKbps,
    framerate,
    timestamp: now,
    history,
  };
}

/**
 * Generate TTFF percentile metrics
 */
export function generateTTFFMetrics(): TTFFMetrics {
  const p50 = 1200 + (Math.random() * 200 - 100); // 1100-1300ms
  const p95 = 2800 + (Math.random() * 400 - 200); // 2600-3000ms
  const p99 = 4100 + (Math.random() * 600 - 300); // 3800-4400ms
  const average = 1800 + (Math.random() * 300 - 150); // 1650-1950ms
  
  return {
    p50: Math.round(p50),
    p95: Math.round(p95),
    p99: Math.round(p99),
    average: Math.round(average),
  };
}

/**
 * Generate QoE score history over time
 */
function generateQoEHistory(minutes: number, endTime: number): TimeSeriesDataPoint[] {
  const history: TimeSeriesDataPoint[] = [];
  const intervalMs = 60000; // 1 minute
  const points = Math.min(minutes, 120);
  const baseScore = 87;
  
  for (let i = 0; i < points; i++) {
    const timestamp = endTime - (points - i) * intervalMs;
    
    // QoE varies based on network conditions, CDN performance, etc.
    const networkVariation = Math.sin(i / 10) * 3; // Periodic network fluctuation
    const randomNoise = (Math.random() - 0.5) * 4;
    const score = Math.max(70, Math.min(100, baseScore + networkVariation + randomNoise));
    
    history.push({
      timestamp,
      value: Math.round(score * 10) / 10, // One decimal
    });
  }
  
  return history;
}

/**
 * Generate rebuffer ratio over time
 */
export function generateRebufferTimeSeries(minutes: number = 60): TimeSeriesDataPoint[] {
  const now = Date.now();
  const points = Math.min(minutes, 120);
  const intervalMs = 60000;
  const data: TimeSeriesDataPoint[] = [];
  
  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * intervalMs;
    
    // Rebuffer ratio varies: worse during peak hours, CDN issues
    const baseRatio = 1.2;
    const peakHourMultiplier = new Date(timestamp).getHours() >= 18 ? 1.3 : 1.0;
    const randomSpike = Math.random() > 0.9 ? Math.random() * 2 : 0; // Occasional spikes
    const noise = (Math.random() - 0.5) * 0.3;
    
    const ratio = baseRatio * peakHourMultiplier + randomSpike + noise;
    
    data.push({
      timestamp,
      value: Math.max(0, Math.round(ratio * 100) / 100),
    });
  }
  
  return data;
}

/**
 * Generate startup failure events
 */
export function generateStartupFailures(sampleSize: number = 10000): {
  failures: number;
  rate: number;
} {
  const failureRate = 0.003; // 0.3%
  const failures = Math.floor(sampleSize * failureRate + (Math.random() - 0.5) * 5);
  
  return {
    failures,
    rate: (failures / sampleSize) * 100,
  };
}
