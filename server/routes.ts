import type { Express } from "express";
import { createServer, type Server } from "http";
import { default as multer } from "multer";
import { analyzeImage } from "./services/gemini";

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export function registerRoutes(app: Express): Server {
  app.post('/api/analyze', upload.array('images'), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: 'No images uploaded' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Gemini API key not configured' });
      }

      const results = await Promise.all(
        req.files.map(async (file, index) => {
          try {
            const imageBuffer = file.buffer;
            return await analyzeImage(imageBuffer);
          } catch (error) {
            console.error(`Error analyzing image ${index + 1}:`, error);
            throw error; // Re-throw to be caught by the outer try-catch
          }
        })
      );

      res.json(results);
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ 
        error: 'Failed to analyze images',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}