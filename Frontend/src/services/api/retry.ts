/**
 * API Retry Utilities
 */

import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export class ApiRetry {
  constructor(private client: AxiosInstance, private maxRetries: number) {}

  shouldRetry(error: AxiosError): boolean {
    return (
      !error.response ||
      error.response.status >= 500 ||
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT'
    );
  }

  async retryRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
    let lastError: AxiosError;
    
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        await this.delay(Math.pow(2, i) * 1000); // Exponential backoff
        return await this.client(config);
      } catch (error) {
        lastError = error as AxiosError;
      }
    }
    
    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}