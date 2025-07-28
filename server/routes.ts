import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Load CSV data on startup
  await storage.loadDataFromCsv();

  // Get MCQ evaluations
  app.get("/api/mcq-evaluations", async (req, res) => {
    try {
      const evaluations = await storage.getMcqEvaluations();
      res.json(evaluations);
    } catch (error) {
      console.error("Error fetching MCQ evaluations:", error);
      res.status(500).json({ message: "Failed to fetch MCQ evaluations" });
    }
  });

  // Get Essay evaluations
  app.get("/api/essay-evaluations", async (req, res) => {
    try {
      const evaluations = await storage.getEssayEvaluations();
      res.json(evaluations);
    } catch (error) {
      console.error("Error fetching essay evaluations:", error);
      res.status(500).json({ message: "Failed to fetch essay evaluations" });
    }
  });

  // Get aggregated statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const mcqEvaluations = await storage.getMcqEvaluations();
      const essayEvaluations = await storage.getEssayEvaluations();

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

  const httpServer = createServer(app);
  return httpServer;
}
