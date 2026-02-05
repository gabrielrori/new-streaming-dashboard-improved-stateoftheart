import { DurableObjectMetrics, DurableObjectStats } from '../types';

/**
 * Generate realistic Durable Objects metrics
 * Tracks Session, Stream, Regional, and Edge DO counts and performance
 */
export function generateDurableObjectMetrics(): DurableObjectMetrics {
  const now = Date.now();
  
  // Session Durable Objects (one per viewer session)
  const sessionObjects = generateDurableObjectStats({
    count: 47000 + Math.floor(Math.random() * 2000 - 1000), // ~47K sessions
    activePercentage: 0.85, // 85% actively streaming
    avgCpuTimeMs: 150,
    avgRequestCount: 450,
    avgErrorRate: 0.002,
    avgMemoryMB: 12,
  });
  
  // Stream Durable Objects (one per live stream)
  const streamObjects = generateDurableObjectStats({
    count: 156 + Math.floor(Math.random() * 10 - 5), // ~156 streams
    activePercentage: 0.95, // Most are active
    avgCpuTimeMs: 2500,
    avgRequestCount: 12000,
    avgErrorRate: 0.001,
    avgMemoryMB: 85,
  });
  
  // Regional Durable Objects (one per geographic region)
  const regionalObjects = generateDurableObjectStats({
    count: 6, // Major regions: NA, EU, APAC, SA, ME, AF
    activePercentage: 1.0, // All active
    avgCpuTimeMs: 8500,
    avgRequestCount: 85000,
    avgErrorRate: 0.0005,
    avgMemoryMB: 256,
  });
  
  // Edge Durable Objects (one per edge location/PoP)
  const edgeObjects = generateDurableObjectStats({
    count: 42 + Math.floor(Math.random() * 5), // ~42 edge locations
    activePercentage: 0.90, // Most active
    avgCpuTimeMs: 4200,
    avgRequestCount: 35000,
    avgErrorRate: 0.0008,
    avgMemoryMB: 128,
  });
  
  const totalObjects = 
    sessionObjects.count + 
    streamObjects.count + 
    regionalObjects.count + 
    edgeObjects.count;
  
  return {
    sessionObjects,
    streamObjects,
    regionalObjects,
    edgeObjects,
    totalObjects,
    timestamp: now,
  };
}

/**
 * Generate stats for a specific DO type
 */
function generateDurableObjectStats(config: {
  count: number;
  activePercentage: number;
  avgCpuTimeMs: number;
  avgRequestCount: number;
  avgErrorRate: number;
  avgMemoryMB: number;
}): DurableObjectStats {
  const count = config.count;
  const activeCount = Math.floor(count * config.activePercentage);
  
  // Aggregate metrics (sum across all DOs of this type)
  const cpuTimeMs = Math.floor(activeCount * config.avgCpuTimeMs * (0.9 + Math.random() * 0.2));
  const requestCount = Math.floor(activeCount * config.avgRequestCount * (0.9 + Math.random() * 0.2));
  const errorCount = Math.floor(requestCount * config.avgErrorRate * (0.5 + Math.random() * 1.5));
  const memoryMB = activeCount * config.avgMemoryMB + Math.floor(Math.random() * 100 - 50);
  
  return {
    count,
    activeCount,
    cpuTimeMs,
    requestCount,
    errorCount,
    memoryMB: Math.max(0, memoryMB),
  };
}

/**
 * Generate detailed DO instance information
 */
export function generateDurableObjectInstances(type: 'session' | 'stream' | 'regional' | 'edge', sampleSize: number = 10): Array<{
  id: string;
  type: string;
  name: string;
  status: 'active' | 'idle' | 'evicted';
  cpuTimeMs: number;
  requestCount: number;
  errorCount: number;
  memoryMB: number;
  createdAt: number;
  lastAccessedAt: number;
}> {
  const now = Date.now();
  const instances: Array<{
    id: string;
    type: string;
    name: string;
    status: 'active' | 'idle' | 'evicted';
    cpuTimeMs: number;
    requestCount: number;
    errorCount: number;
    memoryMB: number;
    createdAt: number;
    lastAccessedAt: number;
  }> = [];
  
  // Base stats by type
  const typeConfig = {
    session: { avgCpu: 150, avgReq: 450, avgMem: 12, avgAge: 1800000 },
    stream: { avgCpu: 2500, avgReq: 12000, avgMem: 85, avgAge: 7200000 },
    regional: { avgCpu: 8500, avgReq: 85000, avgMem: 256, avgAge: 86400000 },
    edge: { avgCpu: 4200, avgReq: 35000, avgMem: 128, avgAge: 43200000 },
  };
  
  const config = typeConfig[type];
  
  for (let i = 0; i < sampleSize; i++) {
    const age = Math.floor(Math.random() * config.avgAge);
    const createdAt = now - age;
    const lastAccessedAt = now - Math.floor(Math.random() * 60000); // Within last minute
    
    const status = Math.random() > 0.15 ? 'active' : (Math.random() > 0.5 ? 'idle' : 'evicted');
    
    const cpuTimeMs = Math.floor(config.avgCpu * (0.7 + Math.random() * 0.6));
    const requestCount = Math.floor(config.avgReq * (0.7 + Math.random() * 0.6));
    const errorCount = Math.floor(requestCount * 0.001 * Math.random());
    const memoryMB = Math.floor(config.avgMem * (0.8 + Math.random() * 0.4));
    
    instances.push({
      id: generateDOId(type),
      type,
      name: generateDOName(type, i),
      status,
      cpuTimeMs,
      requestCount,
      errorCount,
      memoryMB,
      createdAt,
      lastAccessedAt,
    });
  }
  
  return instances;
}

/**
 * Generate DO ID
 */
function generateDOId(type: string): string {
  const prefix = type.substring(0, 3);
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}_${random}`;
}

/**
 * Generate DO name
 */
function generateDOName(type: string, index: number): string {
  switch (type) {
    case 'session':
      return `session-${Math.random().toString(36).substring(2, 10)}`;
    case 'stream':
      return `stream-${['sports', 'news', 'entertainment', 'gaming'][index % 4]}-${index}`;
    case 'regional':
      return ['NA-East', 'NA-West', 'EU-Central', 'EU-West', 'APAC-SE', 'APAC-NE'][index % 6];
    case 'edge':
      return `edge-pop-${index + 1}`;
    default:
      return `unknown-${index}`;
  }
}

/**
 * Generate DO performance over time
 */
export function generateDOPerformanceTimeSeries(minutes: number = 60): Array<{
  timestamp: number;
  totalDOs: number;
  activeDOs: number;
  avgCpuMs: number;
  avgMemoryMB: number;
  requestsPerSecond: number;
}> {
  const now = Date.now();
  const points = Math.min(minutes, 120);
  const intervalMs = 60000; // 1 minute
  const data: Array<{
    timestamp: number;
    totalDOs: number;
    activeDOs: number;
    avgCpuMs: number;
    avgMemoryMB: number;
    requestsPerSecond: number;
  }> = [];
  
  const baseTotalDOs = 47200;
  
  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * intervalMs;
    
    // DO count varies with viewer count
    const viewerVariation = Math.sin(i / 15) * 2000;
    const totalDOs = Math.floor(baseTotalDOs + viewerVariation + (Math.random() * 500 - 250));
    const activeDOs = Math.floor(totalDOs * (0.85 + Math.random() * 0.1));
    
    // Performance metrics
    const avgCpuMs = 180 + Math.floor(Math.random() * 60);
    const avgMemoryMB = 14 + Math.floor(Math.random() * 4);
    const requestsPerSecond = 850 + Math.floor(Math.random() * 200);
    
    data.push({
      timestamp,
      totalDOs,
      activeDOs,
      avgCpuMs,
      avgMemoryMB,
      requestsPerSecond,
    });
  }
  
  return data;
}

/**
 * Generate DO resource usage by region
 */
export function generateRegionalDOUsage(): Array<{
  region: string;
  doCount: number;
  cpuTimeMs: number;
  memoryMB: number;
  requestCount: number;
  utilizationPercentage: number;
}> {
  const regions = [
    { name: 'North America', baseCount: 19000 },
    { name: 'Europe', baseCount: 14500 },
    { name: 'Asia Pacific', baseCount: 11000 },
    { name: 'South America', baseCount: 2000 },
    { name: 'Middle East', baseCount: 800 },
    { name: 'Africa', baseCount: 300 },
  ];
  
  return regions.map(region => {
    const doCount = region.baseCount + Math.floor(Math.random() * 500 - 250);
    const cpuTimeMs = doCount * 180 + Math.floor(Math.random() * 10000);
    const memoryMB = doCount * 14 + Math.floor(Math.random() * 1000);
    const requestCount = doCount * 450 + Math.floor(Math.random() * 50000);
    const utilizationPercentage = 65 + Math.random() * 25; // 65-90%
    
    return {
      region: region.name,
      doCount,
      cpuTimeMs,
      memoryMB,
      requestCount,
      utilizationPercentage: Math.round(utilizationPercentage * 10) / 10,
    };
  });
}

/**
 * Calculate DO efficiency score (0-100)
 */
export function calculateDOEfficiency(metrics: DurableObjectMetrics): number {
  // Active ratio (higher is better, means less idle DOs)
  const totalActive = 
    metrics.sessionObjects.activeCount +
    metrics.streamObjects.activeCount +
    metrics.regionalObjects.activeCount +
    metrics.edgeObjects.activeCount;
  
  const activeRatio = totalActive / metrics.totalObjects;
  const activeScore = activeRatio * 100;
  
  // Error rate (lower is better)
  const totalRequests = 
    metrics.sessionObjects.requestCount +
    metrics.streamObjects.requestCount +
    metrics.regionalObjects.requestCount +
    metrics.edgeObjects.requestCount;
  
  const totalErrors = 
    metrics.sessionObjects.errorCount +
    metrics.streamObjects.errorCount +
    metrics.regionalObjects.errorCount +
    metrics.edgeObjects.errorCount;
  
  const errorRate = totalErrors / totalRequests;
  const errorScore = Math.max(0, 100 - (errorRate * 10000));
  
  // Memory efficiency (optimal usage, not too high or low)
  const avgMemoryPerDO = metrics.sessionObjects.memoryMB / metrics.sessionObjects.activeCount;
  const memoryEfficiency = avgMemoryPerDO > 10 && avgMemoryPerDO < 20 ? 100 : 80;
  
  // Weighted score
  const score = activeScore * 0.4 + errorScore * 0.4 + memoryEfficiency * 0.2;
  
  return Math.round(score);
}
