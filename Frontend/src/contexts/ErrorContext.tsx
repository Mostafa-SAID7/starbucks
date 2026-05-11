import React, { createContext, useContext, useState, useCallback } from 'react';

export interface AppError {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
  timestamp: number;
}

interface ErrorContextType {
  errors: AppError[];
  addError: (error: Omit<AppError, 'id' | 'timestamp'>) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<AppError[]>([]);

  const removeError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((error) => error.id !== id));
  }, []);

  const addError = useCallback((error: Omit<AppError, 'id' | 'timestamp'>) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newError: AppError = {
      ...error,
      id,
      timestamp: Date.now(),
    };

    setErrors((prev) => [...prev, newError]);

    // Auto-remove after 5 seconds for non-error types
    if (error.type !== 'error') {
      setTimeout(() => removeError(id), 5000);
    }
  }, [removeError]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  );
}

// Exported separately for non-component exports
export function useErrorContext() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used within ErrorProvider');
  }
  return context;
}
