import React from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "./ErrorBoundary";

interface QueryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  variant?: "full" | "compact";
}

/**
 * Specialized Error Boundary for TanStack Query
 * Integrates QueryErrorResetBoundary with the unified Starbucks ErrorBoundary
 */
export const QueryErrorBoundary: React.FC<QueryErrorBoundaryProps> = ({
  children,
  fallback,
  variant = "full",
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          variant={variant}
          fallback={fallback}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default QueryErrorBoundary;
