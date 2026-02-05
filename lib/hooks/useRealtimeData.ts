'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseRealtimeDataOptions<T> {
  initialValue: T;
  updateInterval?: number; // in milliseconds
  generateUpdate: (currentValue: T) => T;
}

export function useRealtimeData<T>({
  initialValue,
  updateInterval = 5000,
  generateUpdate,
}: UseRealtimeDataOptions<T>) {
  const [data, setData] = useState<T>(initialValue);
  const [isLive, setIsLive] = useState(true);

  const updateData = useCallback(() => {
    setData((current) => generateUpdate(current));
  }, [generateUpdate]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(updateData, updateInterval);

    return () => clearInterval(interval);
  }, [isLive, updateInterval, updateData]);

  const toggleLive = useCallback(() => {
    setIsLive((prev) => !prev);
  }, []);

  return {
    data,
    isLive,
    toggleLive,
    updateData,
  };
}

// Helper function to generate random variation
export function randomVariation(value: number, range: number): number {
  return value + (Math.random() - 0.5) * range * 2;
}

// Helper function to clamp values
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
