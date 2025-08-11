# Authentication System

Nexus Bots now includes a comprehensive authentication system with multiple sign-in options.

## Available Authentication Methods

### 1. Email & Password Registration/Sign-in

- **Registration**: Users can create accounts with name, email, and password
- **Sign-in**: Registered users can sign in with their email and password
- **Password Security**: Passwords are hashed using bcrypt with 12 salt rounds
- **Validation**: Email format and password strength validation

### 2. Google OAuth (Optional)

- **Setup Required**: Requires Google OAuth credentials from Google Cloud Console
- **Configuration**: Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to your `.env.local`
- **User Experience**: One-click sign-in with Google account

### 3. Development Mode (Development Only)

- **Quick Testing**: Sign in with any email address (no password required)
- **Auto-enabled**: Only available when `NODE_ENV=development`
- **No Database**: Creates temporary sessions for rapid development

## Setup Instructions

### Basic Setup (Email & Password)

1. The system is ready to use out of the box with SQLite database
2. Navigate to `/auth/register` to create an account
3. Navigate to `/auth/signin` to sign in

### Google OAuth Setup (Optional)

✅ **Currently Configured with your credentials**

**Your Google OAuth Configuration:**

- **Client ID**: `134541569025-kgbur0g5ramvv91durh227ih9fmhruae.apps.googleusercontent.com`
- **Client Secret**: `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`
- **Status**: OAuth access is restricted to test users

**Important Notes:**

- Your OAuth app is currently in "Testing" mode
- Only users added to your OAuth consent screen can sign in with Google
- To make it public, publish your OAuth app in Google Cloud Console

**To add test users:**

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → OAuth consent screen
2. Scroll to "Test users" section
3. Click "ADD USERS" and enter email addresses
4. These users can now sign in with Google during development

**To make it public (optional):**

1. In OAuth consent screen, change from "Testing" to "In production"
2. Complete any required verification steps
3. Anyone with a Google account can then sign in

## Pages & Routes

### Authentication Pages

- `/auth/signin` - Sign in page with multiple options
- `/auth/register` - Account registration page
- `/auth/signout` - Sign out confirmation page
- `/auth/error` - Authentication error page

### API Routes

- `/api/auth/[...nextauth]` - NextAuth.js authentication handler
- `/api/auth/register` - Account registration endpoint

## Database Schema

The authentication system uses the following database tables:

- `users` - User accounts with optional password field
- `accounts` - OAuth account linking
- `sessions` - User sessions (when using database sessions)
- `verification_tokens` - Email verification tokens

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **Session Management**: JWT tokens by default, configurable to database sessions
- **CSRF Protection**: Built-in CSRF token validation
- **Email Validation**: Server-side email format validation
- **Password Strength**: Minimum 8 characters required

## Development vs Production

### Development Mode

- Includes development login option (any email, no password)
- More detailed error messages
- Debug logging enabled

### Production Mode

- Development login disabled
- Generic error messages for security
- Production-optimized session handling

## Environment Variables

Required variables in `.env.local`:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
DATABASE_URL="file:../../packages/database/dev.db"
```

Optional variables for OAuth:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```
