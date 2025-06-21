# Google OAuth Troubleshooting Guide

## Issue: "Google sign-in did not redirect as expected"

This error typically occurs when the Google OAuth configuration doesn't match your deployment environment.

## Step-by-Step Fix

### 1. **Update Google Cloud Console**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. Click **Edit**
5. In **Authorized redirect URIs**, add:
   ```
   https://4flkja4s.amplifyapp.com/api/auth/callback/google
   https://main.d2q5p14flkja4s.amplifyapp.com/api/auth/callback/google
   ```
6. Click **Save**

### 2. **Configure Amplify Environment Variables**

1. Go to AWS Amplify Console
2. Select your app
3. Go to **App settings** → **Environment variables**
4. Add these variables:

```
BETTER_AUTH_URL=https://4flkja4s.amplifyapp.com
BETTER_AUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BETTER_AUTH_DATABASE_URL=your-database-connection-string
```

### 3. **Verify Domain Authorization**

In Google Cloud Console:
1. Go to **APIs & Services** → **OAuth consent screen**
2. Under **Authorized domains**, add:
   ```
   amplifyapp.com
   ```

### 4. **Test Your Configuration**

1. Deploy your changes to Amplify
2. Wait for the build to complete
3. Try signing in with Google again
4. Check the browser console for detailed error logs

## Common Issues & Solutions

### Issue: "Origin not allowed"
**Solution:** Make sure `amplifyapp.com` is in your authorized domains

### Issue: "Invalid redirect URI"
**Solution:** Verify the exact redirect URI format: `https://your-domain.amplifyapp.com/api/auth/callback/google`

### Issue: "Environment variables not found"
**Solution:** Ensure all environment variables are set in Amplify console and redeploy

## Debugging Steps

1. **Check Browser Console:** Look for detailed error messages
2. **Verify URLs:** Ensure all URLs match exactly
3. **Test Locally:** Confirm OAuth works locally with `http://localhost:3000/api/auth/callback/google`
4. **Check Amplify Logs:** Review build and function logs in Amplify console

## Environment-Specific URLs

- **Local Development:** `http://localhost:3000/api/auth/callback/google`
- **Amplify Production:** `https://4flkja4s.amplifyapp.com/api/auth/callback/google`
- **Amplify Branch:** `https://main.d2q5p14flkja4s.amplifyapp.com/api/auth/callback/google`

## Need Help?

If you're still experiencing issues:
1. Check the browser console for specific error messages
2. Verify all environment variables are set correctly
3. Ensure your Google Cloud project has the correct OAuth scope permissions
4. Try clearing browser cache and cookies

## Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [AWS Amplify Environment Variables](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html)