# Vercel Deployment Instructions

## Environment Variables Required

In your Vercel dashboard, you need to set the following environment variable:

- `DATABASE_URL`: Your PostgreSQL database connection string (from Supabase or other provider)

## Key Changes Made for Vercel Compatibility

1. **Server Export Structure**: Modified `server/index.ts` to export `setupApp` function for Vercel
2. **API Entry Point**: Updated `api/index.ts` to properly handle async app initialization
3. **Dependencies**: Added server dependencies to root `package.json` for Vercel functions
4. **CSV Path Resolution**: Updated `server/storage.ts` to handle different environments
5. **Singleton Data Loading**: Implemented to prevent duplicate data loading

## Vercel Configuration

The `vercel.json` file is configured to:
- Build the client with `npm --prefix client run build`
- Include CSV files in serverless functions with `includeFiles: "attached_assets/**"`
- Route API calls to `/api/index` serverless function
- Serve static files from client build

## Deployment Steps

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Set the `DATABASE_URL` environment variable in Vercel dashboard
4. Deploy

## Troubleshooting

If you see "UI with no data":
1. Check Vercel function logs for errors
2. Verify `DATABASE_URL` is set correctly
3. Ensure CSV files are included in the deployment
4. Check that API routes are responding correctly

## Local Development

Run `npm run dev` to start both client and server locally.