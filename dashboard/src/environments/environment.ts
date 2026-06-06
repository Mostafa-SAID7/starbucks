export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  appName: 'Starbucks Egypt Admin',
  enableAnalytics: false,
  logLevel: 'debug',
  // Google OAuth Configuration
  // NOTE: In development, get these from your .env.local or environment variables
  googleOAuth: {
    clientId: '', // Will be injected from environment variables
    redirectUri: 'http://localhost:4200/auth/google/callback'
  },
  // Image Configuration
  imageConfig: {
    apiBaseUrl: 'http://localhost:8080/api/v1/images',
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    maxFileSize: 5 * 1024 * 1024 // 5MB
  }
};
