import express, { type Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import { registerRoutes } from "./routes";
import { DatabaseStorage } from "./database-storage";

// Load environment variables - only for local development
// In Vercel, environment variables are automatically available
if (process.env.NODE_ENV !== 'production') {
  config({ path: "../.env" });
}

// Setup function for initializing the app
const setupApp = async (): Promise<express.Application> => {
  const app = express();
  
  console.log('Setting up app...');
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set'
  });
  
  // Load data from database
  try {
    console.log('Initializing database storage...');
    const storage = DatabaseStorage.getInstance();
    await storage.loadData();
    console.log('Database storage initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database storage:', error);
    throw error;
  }
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  return app;
};

// For Vercel, export the setup function
export { setupApp };

// For local development, start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  setupApp().then((app) => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }).catch(console.error);
}
