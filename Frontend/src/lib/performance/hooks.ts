import { performanceMonitor } from "./Monitor";

/**
 * Hook to measure component render time
 */
export function useMeasureRender(componentName: string) {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    performanceMonitor.recordMetric(
      `render-${componentName}`,
      renderTime,
      "component",
    );
  };
}
