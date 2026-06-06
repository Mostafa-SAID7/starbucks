<div align="center">

# 🔐 Secrets & Credentials Management Guide

**How to safely manage sensitive credentials (API keys, OAuth tokens, secrets) across development and production environments.**

</div>

---

## ⚠️ Important Security Rules

### NEVER commit secrets to Git:
- ❌ Google OAuth Client Secret
- ❌ Database connection strings
- ❌ API keys (Stripe, Paymob, Google Maps)
- ❌ JWT secret keys
- ❌ Encryption keys
- ❌ Azure/AWS credentials

### ALWAYS use environment variables or secret management services:
- ✅ Development: Use `.env.local` (gitignored)
- ✅ Production: Use deployment platform secrets
- ✅ Staging: Use staging vault/secrets manager

---

## 1. Local Development Setup

### Frontend (.env files)

#### Create `Frontend/.env.local` (NOT tracked by Git):
```env
# Google OAuth (Development)
# Replace with your credentials from Google Cloud Console
VITE_GOOGLE_OAUTH_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com

# This is already in .env.example, but override here if needed
VITE_API_URL=http://localhost:8080/api/v1
VITE_GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/google/callback

# Other secrets
VITE_GOOGLE_MAPS_API_KEY=YOUR_DEV_GOOGLE_MAPS_KEY
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

#### Verify `.env.local` is in `.gitignore`:
```bash
cat Frontend/.gitignore | grep ".env.local"
```

### Backend (User Secrets / appsettings.Development.json)

#### Option 1: Using .NET User Secrets (Recommended for Development)
```bash
cd Backend/src/Starbucks.API

# Initialize user secrets
dotnet user-secrets init

# Add secrets (replace with your actual credentials from Google Cloud Console)
dotnet user-secrets set "Authentication:Google:ClientId" "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
dotnet user-secrets set "Authentication:Google:ClientSecret" "YOUR_GOOGLE_CLIENT_SECRET"

# Verify secrets are set
dotnet user-secrets list
```

> User secrets are stored in `%APPDATA%\Microsoft\UserSecrets\` (Windows) or `~/.microsoft/usersecrets/` (Linux/Mac) - NOT in the repository.

#### Option 2: Using appsettings.Development.json (Local Only)
```json
{
  "Authentication": {
    "Google": {
      "ClientId": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=StarbucksEg_Dev;Trusted_Connection=true;Encrypt=false;"
  },
  "Redis": {
    "Connection": "localhost:6379"
  }
}
```

> **IMPORTANT**: Verify `appsettings.Development.json` is in `.gitignore`

### Dashboard (environment.local.ts)

#### Create `Dashboard/src/environments/environment.local.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  appName: 'Starbucks Egypt Admin',
  enableAnalytics: false,
  logLevel: 'debug',
  googleOAuth: {
    // Replace with your credentials from Google Cloud Console
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    redirectUri: 'http://localhost:4200/auth/google/callback'
  },
  imageConfig: {
    apiBaseUrl: 'http://localhost:8080/api/v1/images',
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    maxFileSize: 5 * 1024 * 1024
  }
};
```

#### Update `angular.json` to use environment.local.ts:
```json
{
  "projects": {
    "starbucks-dashboard": {
      "architect": {
        "build": {
          "configurations": {
            "local": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.local.ts"
                }
              ]
            }
          }
        },
        "serve": {
          "configurations": {
            "development": {
              "browserTarget": "starbucks-dashboard:build:development"
            }
          }
        }
      }
    }
  }
}
```

---

## 2. Production Deployment

### Frontend (Vercel)

#### Set Environment Variables in Vercel Dashboard:
1. Go to your project in [vercel.com](https://vercel.com)
2. Go to **Settings** → **Environment Variables**
3. Add these for production:

```
VITE_GOOGLE_OAUTH_CLIENT_ID = YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
VITE_API_URL = https://api.starbucks.eg/api/v1
VITE_GOOGLE_OAUTH_REDIRECT_URI = https://starbucks.eg/auth/google/callback
VITE_GOOGLE_MAPS_API_KEY = YOUR_PRODUCTION_KEY
VITE_STRIPE_PUBLISHABLE_KEY = pk_live_YOUR_PRODUCTION_KEY
```

#### Or using Vercel CLI:
```bash
vercel env add VITE_GOOGLE_OAUTH_CLIENT_ID production
# Paste: YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com

vercel env add VITE_API_URL production
# Paste: https://api.starbucks.eg/api/v1
```

### Dashboard (Netlify)

#### Set Environment Variables in Netlify Dashboard:
1. Go to your site in [app.netlify.com](https://app.netlify.com)
2. Go to **Site settings** → **Build & deploy** → **Environment**
3. Add these for production:

```
GOOGLE_OAUTH_CLIENT_ID = YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
API_URL = https://api.starbucks.eg/api/v1
GOOGLE_OAUTH_REDIRECT_URI = https://dashboard.starbucks.eg/auth/google/callback
```

#### Or using Netlify CLI:
```bash
netlify env:set GOOGLE_OAUTH_CLIENT_ID "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
netlify env:set API_URL "https://api.starbucks.eg/api/v1"
```

#### Update `netlify.toml` to inject environment variables:
```toml
[build]
  command = "npm install && ng build --configuration production"
  publish = "dist/starbucks-dashboard"
  environment = { NODE_VERSION = "20" }

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  GOOGLE_OAUTH_CLIENT_ID = ""  # Filled by Netlify UI or CLI
```

### Backend (Azure / AWS)

#### Using Azure Key Vault:
```bash
# Create Key Vault
az keyvault create --name starbucks-secrets --resource-group starbucks-rg

# Add secrets
az keyvault secret set --vault-name starbucks-secrets --name "GoogleOAuth--ClientId" --value "YOUR_GOOGLE_CLIENT_ID-..."
az keyvault secret set --vault-name starbucks-secrets --name "GoogleOAuth--ClientSecret" --value "YOUR_GOOGLE_CLIENT_SECRET-..."

# Update appsettings.Production.json to reference Key Vault
# (Configure in Azure App Service through Azure Portal)
```

#### Using AWS Secrets Manager:
```bash
aws secretsmanager create-secret \
  --name starbucks/google-oauth \
  --secret-string '{"clientId":"YOUR_GOOGLE_CLIENT_ID-...","clientSecret":"YOUR_GOOGLE_CLIENT_SECRET-..."}'

# Update appsettings.Production.json to read from AWS Secrets Manager
```

#### Using Environment Variables (Simple approach):
```bash
# In your deployment platform (Azure App Service, AWS Elastic Beanstalk, etc.)
# Set these environment variables:

AUTHENTICATION__GOOGLE__CLIENTID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
AUTHENTICATION__GOOGLE__CLIENTSECRET=YOUR_GOOGLE_CLIENT_SECRET
CONNECTIONSTRINGS__DEFAULTCONNECTION=Server=your-prod-server;Database=StarbucksEg_Prod;...
REDIS__CONNECTION=your-prod-redis-connection
```

---

## 3. Git Setup (Prevent Accidental Commits)

### Check .gitignore Files:

#### Root .gitignore:
```bash
cat starbucks/.gitignore
```

Should include:
```
# Environment files
.env
.env.local
.env.*.local
.env.production
.env.production.local

# Backend secrets
Backend/src/Starbucks.API/appsettings.Development.json
Backend/appsettings.Development.json

# User secrets
Backend/src/Starbucks.API/secrets.json

# Dashboard local environment
Dashboard/src/environments/environment.local.ts
```

#### Frontend .gitignore:
```bash
cat Frontend/.gitignore
```

Should include:
```
.env.local
.env.*.local
.env.production.local
```

### If You Already Committed Secrets

#### Option 1: Remove from History (Recommended for public repos)
```bash
# Remove sensitive file from Git history
git rm --cached Backend/src/Starbucks.API/appsettings.OAuth.json

# Or use BFG Repo-Cleaner
bfg --delete-files appsettings.OAuth.json

# Force push (ONLY if repo is private and small)
git push --force-with-lease
```

#### Option 2: Amend Last Commit (If not yet pushed)
```bash
# Revert the file
git checkout HEAD~ -- Backend/src/Starbucks.API/appsettings.OAuth.json

# Amend the commit
git add .
git commit --amend -m "Remove secrets from OAuth config file"

# Push
git push origin main
```

#### Option 3: Create New Commit (If already pushed to main)
```bash
# Revert the file to placeholder
# (Edit the file to remove real credentials)

# Commit the fix
git add Backend/src/Starbucks.API/appsettings.OAuth.json
git commit -m "fix: Remove hardcoded credentials, use environment variables instead"

# Push normally
git push origin main

# IMPORTANT: Rotate the exposed credentials in Google Cloud Console
```

---

## 4. Providing Secrets to Team

### For Local Development
Send team members:
- `.env.example` and `.env.local` template
- Instructions to fill in their own Google OAuth credentials
- Link to [docs/DEPLOYMENT.md](DEPLOYMENT.md) for setup instructions

**NEVER send actual secrets via email or chat**

### For Production
Use your deployment platform's secret management:
- **Vercel**: Settings → Environment Variables (team members can see it's set but not the value)
- **Netlify**: Build & deploy → Environment (same security)
- **Azure**: Key Vault (role-based access control)
- **AWS**: Secrets Manager (IAM policies)

---

## 5. Secrets Rotation

### When Credentials are Exposed:

1. **Immediately rotate** in Google Cloud Console:
   - Delete compromised OAuth credentials
   - Create new credentials
   - Get new Client ID and Secret

2. **Update all locations**:
   - Development: Update `.env.local`
   - Staging: Update deployment platform environment variables
   - Production: Update deployment platform environment variables (Vercel, Netlify, Azure, AWS)

3. **Verify deployment**:
   - Redeploy all applications
   - Test OAuth login on all platforms

4. **Monitor**:
   - Check API logs for unauthorized access
   - Monitor Google Cloud Console for unusual activity

---

## 6. Secrets Management Best Practices

✅ **DO:**
- Use environment variables for all secrets
- Use deployment platform's native secrets management
- Rotate credentials regularly
- Use `.gitignore` to prevent accidental commits
- Use strong, unique credentials
- Restrict API key usage (IP whitelisting, domain restrictions)
- Audit access to secrets regularly
- Use different credentials for dev/staging/prod

❌ **DON'T:**
- Hardcode secrets in source files
- Commit `.env` or configuration files with real values
- Share secrets via email, chat, or documentation
- Use same credentials across environments
- Store secrets in plain text
- Leave secrets in code comments
- Push to public repositories with secrets

---

## 7. Current Status

### After This Update:
✅ **appsettings.OAuth.json** - Placeholder values (no real secrets)
✅ **Frontend/.env.production** - Placeholder values (no real secrets)
✅ **Dashboard/environment.ts** - Empty clientId (injected at runtime)
✅ **Dashboard/environment.prod.ts** - Empty clientId (injected at runtime)
✅ **All files safe to commit** - No credentials exposed

### Next Steps:
1. Set up `.env.local` in Frontend with real credentials
2. Set up user secrets in Backend with real credentials
3. Set up environment variables in deployment platforms (Vercel, Netlify, Azure)
4. Test OAuth flow on all platforms
5. Monitor for any unauthorized access

---

**🔒 Your credentials are now secure!**

