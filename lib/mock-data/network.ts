import { NetworkMetrics, ConnectionTypeDistribution, TimeSeriesDataPoint } from '../types';

/**
 * Generate realistic network metrics
 * Includes client TTFB, throughput, connection types, latency, packet loss, jitter
 */
export function generateNetworkMetrics(timeRangeMinutes: number = 60): NetworkMetrics {
  const now = Date.now();
  
  // Generate time-series data
  const clientTTFB = generateClientTTFBTimeSeries(timeRangeMinutes, now);
  const throughputMbps = generateThroughputTimeSeries(timeRangeMinutes, now);
  
  // Connection type distribution
  const connectionTypes = generateConnectionTypeDistribution();
  
  // Latency percentiles
  const latencyMs = {
    p50: 35 + Math.floor(Math.random() * 15), // 35-50ms
    p95: 95 + Math.floor(Math.random() * 30), // 95-125ms
    p99: 180 + Math.floor(Math.random() * 50), // 180-230ms
  };
  
  // Packet loss (should be very low for good streaming)
  const packetLoss = 0.05 + (Math.random() * 0.1 - 0.05); // 0-0.1%
  
  // Jitter (latency variation)
  const jitter = 5 + Math.random() * 10; // 5-15ms
  
  return {
    clientTTFB,
    throughputMbps,
    connectionTypes,
    latencyMs,
    packetLoss: Math.round(packetLoss * 1000) / 1000,
    jitter: Math.round(jitter * 10) / 10,
    timestamp: now,
  };
}

/**
 * Generate client TTFB time series
 */
export function generateClientTTFBTimeSeries(minutes: number, endTime: number): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = [];
  const intervalMs = 30000; // 30 second intervals
  const points = Math.min(minutes * 2, 120);
  
  for (let i = 0; i < points; i++) {
    const timestamp = endTime - (points - i) * intervalMs;
    
    // Client TTFB varies more than edge TTFB (includes last-mile network)
    const baseTTFB = 80; // Higher than edge due to client connection
    const networkCondition = Math.sin(i / 10) * 20; // Network fluctuation
    const randomSpike = Math.random() > 0.95 ? Math.random() * 100 : 0; // Occasional spikes
    const noise = (Math.random() - 0.5) * 15;
    
    const ttfb = Math.max(30, baseTTFB + networkCondition + randomSpike + noise);
    
    data.push({
      timestamp,
      value: Math.round(ttfb),
    });
  }
  
  return data;
}

/**
 * Generate throughput time series (Mbps)
 */
export function generateThroughputTimeSeries(minutes: number, endTime: number): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = [];
  const intervalMs = 30000; // 30 second intervals
  const points = Math.min(minutes * 2, 120);
  
  for (let i = 0; i < points; i++) {
    const timestamp = endTime - (points - i) * intervalMs;
    
    // Average throughput around 15 Mbps (enough for 1080p streaming)
    const baseThroughput = 15;
    const trend = Math.sin(i / 20) * 5; // Gradual variation
    const noise = (Math.random() - 0.5) * 3;
    
    const throughput = Math.max(5, baseThroughput + trend + noise);
    
    data.push({
      timestamp,
      value: Math.round(throughput * 100) / 100,
    });
  }
  
  return data;
}

/**
 * Generate connection type distribution
 */
export function generateConnectionTypeDistribution(): ConnectionTypeDistribution {
  // Realistic distribution for streaming audience
  const wifi = 52 + Math.random() * 8; // 52-60%
  const cellular = 35 + Math.random() * 8; // 35-43%
  const ethernet = 8 + Math.random() * 4; // 8-12%
  const unknown = Math.max(0, 100 - wifi - cellular - ethernet);
  
  return {
    wifi: Math.round(wifi * 10) / 10,
    cellular: Math.round(cellular * 10) / 10,
    ethernet: Math.round(ethernet * 10) / 10,
    unknown: Math.round(unknown * 10) / 10,
  };
}

/**
 * Generate latency histogram data
 */
export function generateLatencyHistogram(): Array<{
  bucket: string;
  count: number;
  percentage: number;
}> {
  const buckets = [
    { range: '0-20ms', baseCount: 15000 },
    { range: '20-40ms', baseCount: 25000 },
    { range: '40-60ms', baseCount: 18000 },
    { range: '60-100ms', baseCount: 12000 },
    { range: '100-150ms', baseCount: 6000 },
    { range: '150-200ms', baseCount: 2500 },
    { range: '200ms+', baseCount: 1500 },
  ];
  
  const totalCount = buckets.reduce((sum, b) => sum + b.baseCount, 0);
  
  return buckets.map(bucket => {
    const variation = Math.floor(Math.random() * 1000 - 500);
    const count = Math.max(0, bucket.baseCount + variation);
    const percentage = (count / totalCount) * 100;
    
    return {
      bucket: bucket.range,
      count,
      percentage: Math.round(percentage * 100) / 100,
    };
  });
}

/**
 * Generate packet loss events over time
 */
export function generatePacketLossEvents(minutes: number = 60): Array<{
  timestamp: number;
  lossPercentage: number;
  duration: number;
  severity: 'low' | 'medium' | 'high';
}> {
  const events: Array<{
    timestamp: number;
    lossPercentage: number;
    duration: number;
    severity: 'low' | 'medium' | 'high';
  }> = [];
  
  const now = Date.now();
  const eventCount = Math.floor(Math.random() * 5) + 1; // 1-5 events
  
  for (let i = 0; i < eventCount; i++) {
    const timestamp = now - Math.floor(Math.random() * minutes * 60000);
    const lossPercentage = Math.random() * 2; // 0-2% loss
    const duration = 5000 + Math.floor(Math.random() * 25000); // 5-30 seconds
    
    let severity: 'low' | 'medium' | 'high';
    if (lossPercentage < 0.5) severity = 'low';
    else if (lossPercentage < 1.0) severity = 'medium';
    else severity = 'high';
    
    events.push({
      timestamp,
      lossPercentage: Math.round(lossPercentage * 100) / 100,
      duration,
      severity,
    });
  }
  
  return events.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Calculate network quality score (0-100)
 */
export function calculateNetworkQuality(metrics: NetworkMetrics): number {
  // Lower latency = better
  const latencyScore = Math.max(0, 100 - metrics.latencyMs.p50);
  
  // Lower packet loss = better
  const packetLossScore = Math.max(0, 100 - (metrics.packetLoss * 100));
  
  // Higher throughput = better (assume 20 Mbps is ideal)
  const avgThroughput = metrics.throughputMbps.reduce((sum, p) => sum + p.value, 0) / metrics.throughputMbps.length;
  const throughputScore = Math.min(100, (avgThroughput / 20) * 100);
  
  // Lower jitter = better
  const jitterScore = Math.max(0, 100 - (metrics.jitter * 2));
  
  // Weighted average
  const score = (
    latencyScore * 0.3 +
    packetLossScore * 0.3 +
    throughputScore * 0.25 +
    jitterScore * 0.15
  );
  
  return Math.round(score);
}
