// This file serves as the entry point for the Vercel serverless function.
// It imports the main server logic from the /server directory.

import { setupApp } from '../server/index.ts';

// Create and export the app instance for Vercel
let appInstance: any = null;

export default async (req: any, res: any) => {
  if (!appInstance) {
    appInstance = await setupApp();
  }
  return appInstance(req, res);
};
