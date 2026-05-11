import React from "react";
import { Button } from "../ui/button";

interface ErrorFallbackProps {
  error?: Error | null;
  onReset?: () => void;
  resetErrorBoundary?: () => void;
  variant?: "fullscreen" | "component";
}

export const ErrorFallback = ({
  error,
  onReset,
  resetErrorBoundary,
  variant = "fullscreen",
}: ErrorFallbackProps) => {
  const isDevelopment = import.meta.env.DEV;
  const handleReset = onReset || resetErrorBoundary || (() => window.location.reload());

  if (variant === "component") {
    return (
      <div className="p-6 border-2 border-dashed border-red-200 rounded-xl bg-red-50 text-center">
        <h3 className="text-lg font-bold text-red-800 mb-2">Something went wrong</h3>
        <p className="text-sm text-red-600 mb-4">{error?.message || "An unexpected error occurred"}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleReset()}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background p-4 z-[9999]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Oops! Something went wrong</h1>
          <p className="text-muted-foreground">
            {error?.message || "We encountered an unexpected error. Our team has been notified."}
          </p>
        </div>

        {isDevelopment && error?.stack && (
          <div className="mt-4 p-4 bg-zinc-900 text-zinc-400 text-left text-xs font-mono rounded overflow-auto max-h-48 whitespace-pre">
            {error.stack}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => handleReset()}
            className="w-full sm:w-auto"
          >
            Refresh Page
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full sm:w-auto"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};
