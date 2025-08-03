// This file serves as the entry point for the Vercel serverless function.
// It imports the server setup to avoid code duplication.

import type { Application } from "express";
import { setupApp } from "../server/index.js";

// Create and export the app instance for Vercel
let appInstance: Application | null = null;

export default async (req: any, res: any) => {
  try {
    if (!appInstance) {
      console.log('Initializing app for Vercel...');
      appInstance = await setupApp();
      console.log('App initialized successfully');
    }
    return appInstance(req, res);
  } catch (error) {
    console.error('Error in Vercel function:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
