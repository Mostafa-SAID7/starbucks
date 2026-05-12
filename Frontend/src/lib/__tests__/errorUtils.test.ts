import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  AppError,
  ErrorType,
  detectErrorType,
  getErrorMessages,
  getContextualErrorMessage,
  logError,
  createFetchError,
} from '@/lib/error';

describe('errorUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('AppError', () => {
    it('creates an AppError with correct properties', () => {
      const error = new AppError(
        'Test error',
        ErrorType.NETWORK,
        500,
        'Internal Server Error'
      );

      expect(error.message).toBe('Test error');
      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.statusCode).toBe(500);
      expect(error.statusText).toBe('Internal Server Error');
      expect(error.name).toBe('AppError');
    });

    it('creates an AppError with default values', () => {
      const error = new AppError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.type).toBe(ErrorType.GENERAL);
      expect(error.statusCode).toBeUndefined();
      expect(error.statusText).toBeUndefined();
    });
  });

  describe('detectErrorType', () => {
    it('detects AppError type correctly', () => {
      const error = new AppError('Test', ErrorType.NETWORK);
      expect(detectErrorType(error)).toBe(ErrorType.NETWORK);
    });

    it('detects network errors from message', () => {
      const error = new Error('Network connection failed');
      expect(detectErrorType(error)).toBe(ErrorType.NETWORK);
    });

    it('detects timeout errors from message', () => {
      const error = new Error('Request timeout');
      expect(detectErrorType(error)).toBe(ErrorType.TIMEOUT);
    });

    it('detects not found errors from message', () => {
      const error = new Error('Resource not found');
      expect(detectErrorType(error)).toBe(ErrorType.NOT_FOUND);
    });

    it('detects unauthorized errors from message', () => {
      const error = new Error('Unauthorized access');
      expect(detectErrorType(error)).toBe(ErrorType.UNAUTHORIZED);
    });

    it('detects server errors from message', () => {
      const error = new Error('Internal server error');
      expect(detectErrorType(error)).toBe(ErrorType.SERVER);
    });

    it('defaults to general error type', () => {
      const error = new Error('Unknown error');
      expect(detectErrorType(error)).toBe(ErrorType.GENERAL);
    });

    it('handles non-Error objects', () => {
      expect(detectErrorType('string error')).toBe(ErrorType.GENERAL);
      expect(detectErrorType(null)).toBe(ErrorType.GENERAL);
      expect(detectErrorType(undefined)).toBe(ErrorType.GENERAL);
    });
  });

  describe('getErrorMessages', () => {
    const mockT = (key: string) => key;

    it('returns correct messages for network errors', () => {
      const error = new AppError('Network error', ErrorType.NETWORK);
      const messages = getErrorMessages(error, mockT);

      expect(messages.title).toBe('errors.network.title');
      expect(messages.message).toBe('errors.network.message');
      expect(messages.retry).toBe('common:retry');
    });

    it('returns correct messages for timeout errors', () => {
      const error = new AppError('Timeout error', ErrorType.TIMEOUT);
      const messages = getErrorMessages(error, mockT);

      expect(messages.title).toBe('errors.timeout.title');
      expect(messages.message).toBe('errors.timeout.message');
    });

    it('returns correct messages for general errors', () => {
      const error = new Error('General error');
      const messages = getErrorMessages(error, mockT);

      expect(messages.title).toBe('errors.general.title');
      expect(messages.message).toBe('errors.general.message');
    });
  });

  describe('getContextualErrorMessage', () => {
    const mockT = (key: string) => key;

    it('returns context-specific message for menu not found', () => {
      const error = new AppError('Not found', ErrorType.NOT_FOUND);
      const message = getContextualErrorMessage(error, 'menu', mockT);

      expect(message).toBe('errors.menu.category_not_found');
    });

    it('returns context-specific message for locations not found', () => {
      const error = new AppError('Not found', ErrorType.NOT_FOUND);
      const message = getContextualErrorMessage(error, 'locations', mockT);

      expect(message).toBe('errors.locations.no_results');
    });

    it('returns context-specific message for menu load failure', () => {
      const error = new Error('Load failed');
      const message = getContextualErrorMessage(error, 'menu', mockT);

      expect(message).toBe('errors.menu.load_failed');
    });

    it('falls back to general error message', () => {
      const error = new AppError('Network error', ErrorType.NETWORK);
      const message = getContextualErrorMessage(error, 'menu', mockT);

      expect(message).toBe('errors.network.message');
    });
  });

  describe('logError', () => {
    beforeEach(() => {
      // Mock environment
      vi.stubGlobal('import.meta', { env: { DEV: false, PROD: true } });
      vi.mocked(global.fetch).mockResolvedValue(new Response());
    });

    it('logs to console in development', () => {
      vi.stubGlobal('import.meta', { env: { DEV: true, PROD: false } });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const error = new Error('Test error');
      logError(error, 'test context');

      expect(consoleSpy).toHaveBeenCalledWith('[test context] Error:', error);
      consoleSpy.mockRestore();
    });

    it('sends error to logging endpoint in production', async () => {
      const error = new Error('Test error');
      logError(error, 'test context');

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(global.fetch).toHaveBeenCalledWith('/api/logging/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('Test error'),
      });
    });

    it('handles fetch failure silently', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Fetch failed'));

      const error = new Error('Test error');
      
      // Should not throw
      expect(() => logError(error)).not.toThrow();
    });
  });

  describe('createFetchError', () => {
    it('creates correct error for 401 status', () => {
      const response = new Response(null, { status: 401, statusText: 'Unauthorized' });
      const error = createFetchError(response, 'user data');

      expect(error.type).toBe(ErrorType.UNAUTHORIZED);
      expect(error.statusCode).toBe(401);
      expect(error.message).toContain('Failed to fetch user data');
    });

    it('creates correct error for 404 status', () => {
      const response = new Response(null, { status: 404, statusText: 'Not Found' });
      const error = createFetchError(response);

      expect(error.type).toBe(ErrorType.NOT_FOUND);
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('Request failed: 404');
    });

    it('creates correct error for 408 status', () => {
      const response = new Response(null, { status: 408, statusText: 'Timeout' });
      const error = createFetchError(response);

      expect(error.type).toBe(ErrorType.TIMEOUT);
      expect(error.statusCode).toBe(408);
    });

    it('creates correct error for 500 status', () => {
      const response = new Response(null, { status: 500, statusText: 'Internal Server Error' });
      const error = createFetchError(response);

      expect(error.type).toBe(ErrorType.SERVER);
      expect(error.statusCode).toBe(500);
    });

    it('defaults to general error for unknown status', () => {
      const response = new Response(null, { status: 418, statusText: "I'm a teapot" });
      const error = createFetchError(response);

      expect(error.type).toBe(ErrorType.GENERAL);
      expect(error.statusCode).toBe(418);
    });
  });
});