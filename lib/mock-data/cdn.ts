import { CDNMetrics, RegionalCDNMetrics } from '../types';

/**
 * Generate realistic CDN metrics
 * Target: cache hit 89%, edge TTFB 45ms median, origin 120ms
 */
export function generateCDNMetrics(): CDNMetrics {
  const now = Date.now();
  
  // Cache performance
  const cacheHitRatio = 89 + (Math.random() * 4 - 2); // 87-91%
  
  // Edge TTFB (Time To First Byte)
  const edgeTTFB = {
    p50: 45 + Math.floor(Math.random() * 10 - 5), // 40-50ms
    p95: 85 + Math.floor(Math.random() * 20 - 10), // 75-95ms
    p99: 150 + Math.floor(Math.random() * 40 - 20), // 130-170ms
  };
  
  // Origin TTFB (slower, for cache misses)
  const originTTFB = {
    p50: 120 + Math.floor(Math.random() * 20 - 10), // 110-130ms
    p95: 280 + Math.floor(Math.random() * 40 - 20), // 260-300ms
    p99: 450 + Math.floor(Math.random() * 100 - 50), // 400-500ms
  };
  
  // Traffic metrics
  const bandwidth = 15.5 + Math.random() * 3; // 15.5-18.5 Gbps
  const requestsPerSecond = 45000 + Math.floor(Math.random() * 10000); // 45K-55K RPS
  const errorRate = 0.05 + (Math.random() * 0.03 - 0.015); // 0.035-0.065%
  
  // Total bytes served (based on bandwidth and time)
  const bytesServed = Math.floor(bandwidth * 1000 * 1000 * 1000 * 3600); // Last hour in bytes
  
  // Regional performance breakdown
  const regionalPerformance = generateRegionalMetrics();
  
  return {
    cacheHitRatio: Math.round(cacheHitRatio * 100) / 100,
    edgeTTFB,
    originTTFB,
    bandwidth: Math.round(bandwidth * 100) / 100,
    requestsPerSecond,
    errorRate: Math.round(errorRate * 1000) / 1000,
    bytesServed,
    timestamp: now,
    regionalPerformance,
  };
}

/**
 * Generate regional CDN performance metrics
 */
export function generateRegionalMetrics(): RegionalCDNMetrics[] {
  const regions = [
    { name: 'North America', baseViewers: 18000, baseTTFB: 42, baseCacheHit: 91 },
    { name: 'Europe', baseViewers: 14000, baseTTFB: 38, baseCacheHit: 92 },
    { name: 'Asia Pacific', baseViewers: 11000, baseTTFB: 55, baseCacheHit: 87 },
    { name: 'South America', baseViewers: 2500, baseTTFB: 68, baseCacheHit: 85 },
    { name: 'Middle East', baseViewers: 1200, baseTTFB: 72, baseCacheHit: 83 },
    { name: 'Africa', baseViewers: 300, baseTTFB: 95, baseCacheHit: 79 },
  ];
  
  return regions.map(region => {
    const viewerVariation = Math.floor(Math.random() * 1000 - 500);
    const viewers = Math.max(0, region.baseViewers + viewerVariation);
    
    // Calculate bandwidth based on viewers (avg 2.5 Mbps per viewer)
    const bandwidth = (viewers * 2.5) / 1000; // Convert to Gbps
    
    return {
      region: region.name,
      cacheHitRatio: Math.round((region.baseCacheHit + (Math.random() * 4 - 2)) * 100) / 100,
      ttfbMs: region.baseTTFB + Math.floor(Math.random() * 20 - 10),
      bandwidth: Math.round(bandwidth * 100) / 100,
      viewers,
    };
  });
}

/**
 * Generate cache performance over time
 */
export function generateCacheHitTimeSeries(minutes: number = 60): Array<{
  timestamp: number;
  hitRatio: number;
  hits: number;
  misses: number;
}> {
  const now = Date.now();
  const points = Math.min(minutes, 120);
  const intervalMs = 60000; // 1 minute
  const data: Array<{ timestamp: number; hitRatio: number; hits: number; misses: number }> = [];
  
  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * intervalMs;
    
    // Cache hit ratio varies with content popularity and cache warmth
    const baseHitRatio = 89;
    const timeVariation = Math.sin(i / 15) * 2; // Periodic variation
    const randomNoise = (Math.random() - 0.5) * 1.5;
    const hitRatio = Math.max(75, Math.min(95, baseHitRatio + timeVariation + randomNoise));
    
    // Calculate hits and misses based on RPS
    const totalRequests = 45000 + Math.floor(Math.random() * 5000);
    const hits = Math.floor(totalRequests * (hitRatio / 100));
    const misses = totalRequests - hits;
    
    data.push({
      timestamp,
      hitRatio: Math.round(hitRatio * 100) / 100,
      hits,
      misses,
    });
  }
  
  return data;
}

/**
 * Generate CDN node health status
 */
export function generateCDNNodeStatus(): Array<{
  nodeId: string;
  region: string;
  status: 'healthy' | 'degraded' | 'down';
  load: number;
  connectionsActive: number;
}> {
  const nodes = [
    'edge-us-east-1', 'edge-us-west-1', 'edge-eu-central-1', 'edge-eu-west-1',
    'edge-ap-southeast-1', 'edge-ap-northeast-1', 'edge-sa-east-1',
  ];
  
  const regions = [
    'North America', 'North America', 'Europe', 'Europe',
    'Asia Pacific', 'Asia Pacific', 'South America',
  ];
  
  return nodes.map((nodeId, idx) => {
    const load = 40 + Math.random() * 50; // 40-90% load
    const status = load > 85 ? 'degraded' : 'healthy';
    const connections = Math.floor(5000 + Math.random() * 15000);
    
    return {
      nodeId,
      region: regions[idx],
      status,
      load: Math.round(load * 10) / 10,
      connectionsActive: connections,
    };
  });
}

/**
 * Calculate CDN efficiency score (0-100)
 */
export function calculateCDNEfficiency(metrics: CDNMetrics): number {
  const cacheScore = metrics.cacheHitRatio; // 0-100
  const latencyScore = Math.max(0, 100 - metrics.edgeTTFB.p50); // Lower is better
  const reliabilityScore = Math.max(0, 100 - (metrics.errorRate * 1000)); // Lower errors = better
  
  return Math.round((cacheScore * 0.5 + latencyScore * 0.3 + reliabilityScore * 0.2));
}
