export const environment = {
  production: true,
  apiUrl: '/api/v1',
  appName: 'Starbucks Egypt Admin',
  enableAnalytics: true,
  logLevel: 'error',
  // Google OAuth Configuration (Production)
  // NOTE: These will be injected from environment variables during deployment
  googleOAuth: {
    clientId: '', // Injected from deployment platform (Netlify/Vercel/Azure)
    redirectUri: 'https://dashboard.starbucks.eg/auth/google/callback'
  },
  // Image Configuration
  imageConfig: {
    apiBaseUrl: 'https://api.starbucks.eg/api/v1/images',
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    maxFileSize: 5 * 1024 * 1024 // 5MB
  }
};
