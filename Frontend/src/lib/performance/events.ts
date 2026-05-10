import { performanceMonitor } from "./Monitor";

/**
 * Mark a custom performance event
 */
export function markPerformanceEvent(name: string) {
  performanceMonitor.startMeasure(name);
}

/**
 * End a custom performance event
 */
export function endPerformanceEvent(name: string) {
  performanceMonitor.endMeasure(name);
}
