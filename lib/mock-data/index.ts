/**
 * Mock Data Generators
 * 
 * Comprehensive mock data generators for streaming dashboard metrics.
 * All data is realistic and based on industry-standard performance targets.
 */

// Re-export all generators
export * from './realtime';
export * from './qoe';
export * from './abr';
export * from './cdn';
export * from './network';
export * from './cmcd';
export * from './engagement';
export * from './player-health';
export * from './durable-objects';

// Import specific generators for the main dashboard data function
import { generateRealtimeMetrics } from './realtime';
import { generateQoEMetrics } from './qoe';
import { generateABRMetrics } from './abr';
import { generateCDNMetrics } from './cdn';
import { generateNetworkMetrics } from './network';
import { generateCMCDMetrics } from './cmcd';
import { generateEngagementMetrics } from './engagement';
import { generatePlayerHealthMetrics } from './player-health';
import { generateDurableObjectMetrics } from './durable-objects';

import type { DashboardData } from '../types';

/**
 * Generate complete dashboard data for all metrics
 */
export function generateDashboardData(timeRangeMinutes: number = 60): DashboardData {
  return {
    realtime: generateRealtimeMetrics(timeRangeMinutes),
    qoe: generateQoEMetrics(timeRangeMinutes),
    abr: generateABRMetrics(timeRangeMinutes),
    cdn: generateCDNMetrics(),
    network: generateNetworkMetrics(timeRangeMinutes),
    cmcd: generateCMCDMetrics(timeRangeMinutes),
    engagement: generateEngagementMetrics(),
    playerHealth: generatePlayerHealthMetrics(timeRangeMinutes),
    durableObjects: generateDurableObjectMetrics(),
  };
}

/**
 * Default export for convenience
 */
const mockDataGenerators = {
  generateDashboardData,
  generateRealtimeMetrics,
  generateQoEMetrics,
  generateABRMetrics,
  generateCDNMetrics,
  generateNetworkMetrics,
  generateCMCDMetrics,
  generateEngagementMetrics,
  generatePlayerHealthMetrics,
  generateDurableObjectMetrics,
};

export default mockDataGenerators;
