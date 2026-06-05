# Starbucks Dashboard 📊

Modern admin dashboard for Starbucks operations management built with Angular 19, Material Design, and Tailwind CSS.

## Features

- 📈 Real-time analytics and reporting
- 📦 Product management
- 👥 Order tracking and management
- 🎨 Modern, responsive UI with Material Design
- 🔐 Secure authentication and authorization
- 📱 Mobile-friendly interface
- 🌐 RESTful API integration

## Tech Stack

- **Framework:** Angular 19
- **UI Library:** Angular Material
- **Styling:** Tailwind CSS
- **State Management:** NgRx Store
- **Charts:** Chart.js
- **HTTP Client:** Angular HttpClient with RxJS

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Angular CLI 19.x

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Copy `.env.example` to `.env` (if using environment variables)
   - Update `src/environments/environment.ts` with your API endpoint

## Development

### Start Development Server

```bash
npm start
```

The app will be available at `http://localhost:4200/`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:netlify` - Build optimized for Netlify deployment
- `npm run build:prod` - Build for production with optimizations
- `npm run watch` - Build in watch mode
- `npm test` - Run unit tests

## Project Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (Dashboard, Products, etc.)
│   │   ├── app.routes.ts   # Application routing
│   │   └── app.config.ts   # Application configuration
│   ├── assets/             # Static assets (images, icons, etc.)
│   ├── environments/       # Environment configurations
│   ├── styles.css          # Global styles
│   └── index.html          # Main HTML file
├── public/                 # Public static files
├── angular.json            # Angular CLI configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── netlify.toml            # Netlify deployment configuration
└── package.json            # Project dependencies
```

## Configuration

### Environment Files

- `src/environments/environment.ts` - Development environment
- `src/environments/environment.prod.ts` - Production environment

### API Configuration

Update the `apiUrl` in environment files to point to your backend API:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',  // Your API endpoint
  apiVersion: 'v1',
  appName: 'Starbucks Dashboard',
  enableAnalytics: false,
  logLevel: 'debug'
};
```

## Building for Production

```bash
npm run build:prod
```

The build artifacts will be stored in the `dist/dashboard/browser/` directory.

## Deployment

### Netlify Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick deploy:**
```bash
npm run build:netlify
```

### Other Platforms

The dashboard can be deployed to any static hosting service:
- **Vercel:** Connect Git repository and deploy
- **AWS S3 + CloudFront:** Upload `dist/dashboard/browser/` contents
- **Azure Static Web Apps:** Connect repository via GitHub Actions
- **Firebase Hosting:** Use Firebase CLI to deploy

## API Integration

The dashboard expects a backend API with the following endpoints:

- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `GET /api/v1/products` - Product list
- `GET /api/v1/orders` - Order list
- `GET /api/v1/users` - User management
- Authentication endpoints for login/logout

Ensure your backend API:
1. Supports CORS for your dashboard domain
2. Uses HTTPS in production
3. Implements proper authentication/authorization
4. Returns JSON responses

## Features Overview

### Dashboard
- Real-time statistics and metrics
- Revenue charts and analytics
- Recent orders overview
- Quick actions panel

### Product Management
- Product catalog with search and filters
- Add/edit/delete products
- Category management
- Inventory tracking

### Order Management
- Order listing and tracking
- Order status updates
- Order details view
- Customer information

## Security

The dashboard includes:
- ✅ XSS protection headers
- ✅ CSRF protection
- ✅ Content Security Policy
- ✅ Secure HTTPS connections
- ✅ Authentication token management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## Troubleshooting

### Port Already in Use
If port 4200 is in use, specify a different port:
```bash
ng serve --port 4300
```

### API Connection Errors
1. Check if backend API is running
2. Verify API URL in environment files
3. Check browser console for CORS errors
4. Ensure proper authentication headers

### Build Errors
1. Clear Angular cache: `rm -rf .angular/cache`
2. Delete node_modules: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

## License

Copyright © 2026 Starbucks Team. All rights reserved.

## Support

For issues and questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review Angular documentation: https://angular.io/docs
- Check Netlify docs: https://docs.netlify.com/

---

**Version:** 1.0.0  
**Last Updated:** 2026-06-06
