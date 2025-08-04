import type { Express } from "express";
import { DatabaseStorage } from "./database-storage.js";

export async function registerRoutes(app: Express): Promise<void> {
  // Get the database storage instance (data already loaded in setupApp)
  const storage = DatabaseStorage.getInstance();

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Get MCQ evaluations
  app.get("/api/mcq-evaluations", (req, res) => {
    try {
      const evaluations = storage.getMcqEvaluations();
      res.json(evaluations);
    } catch (error) {
      console.error("Error fetching MCQ evaluations:", error);
      res.status(500).json({ message: "Failed to fetch MCQ evaluations" });
    }
  });

  // Get Essay evaluations
  app.get("/api/essay-evaluations", (req, res) => {
    try {
      const evaluations = storage.getEssayEvaluations();
      res.json(evaluations);
    } catch (error) {
      console.error("Error fetching essay evaluations:", error);
      res.status(500).json({ message: "Failed to fetch essay evaluations" });
    }
  });

  // Get aggregated statistics
  app.get("/api/statistics", (req, res) => {
    try {
      const mcqEvaluations = storage.getMcqEvaluations();
      const essayEvaluations = storage.getEssayEvaluations();

      const totalModels = new Set([
        ...mcqEvaluations.map(e => e.model),
        ...essayEvaluations.map(e => e.model)
      ]).size;

      const bestMcqAccuracy = Math.max(...mcqEvaluations.map(e => e.accuracy));
      const bestEssayScore = Math.max(...essayEvaluations.map(e => e.avgSelfGrade));
      
      // Find most cost efficient (highest cosine per dollar)
      const mostCostEfficient = Math.max(...essayEvaluations.map(e => e.cosinePerDollar));

      const bestMcqModel = mcqEvaluations.find(e => e.accuracy === bestMcqAccuracy)?.model || "";
      const bestEssayModel = essayEvaluations.find(e => e.avgSelfGrade === bestEssayScore)?.model || "";
      const mostCostEfficientModel = essayEvaluations.find(e => e.cosinePerDollar === mostCostEfficient)?.model || "";

      res.json({
        totalModels,
        bestMcqAccuracy,
        bestEssayScore,
        mostCostEfficient,
        bestMcqModel,
        bestEssayModel,
        mostCostEfficientModel
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // No need to create HTTP server for Vercel serverless functions
}
