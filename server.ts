import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const ASSETS_DIR = path.join(process.cwd(), "public", "assets");

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// 4 Default images count
const DEFAULT_IMAGES = [
  {
    key: "introMov",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"
  },
  {
    key: "bwPortrait",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
  },
  {
    key: "sunsetPortrait",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80"
  },
  {
    key: "domePhoto",
    url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80"
  },
  {
    key: "Home",
    url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80"
  }
];

// Asynchronous helper to pull and store default images to assets directory
async function seedDefaultImages() {
  console.log("[Server] Seeding default images to local assets folder...");
  for (const item of DEFAULT_IMAGES) {
    const filename = `${item.key}.jpg`;
    const filepath = path.join(ASSETS_DIR, filename);

    let existsAndNotEmpty = false;
    try {
      if (fs.existsSync(filepath) && fs.statSync(filepath).size > 0) {
        existsAndNotEmpty = true;
      }
    } catch (e) {
      existsAndNotEmpty = false;
    }

    if (!existsAndNotEmpty) {
      try {
        console.log(`[Server] Fetching ${filename} from Unsplash...`);
        const response = await fetch(item.url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filepath, buffer);
        console.log(`[Server] Successfully saved ${filename}`);
      } catch (err) {
        console.error(`[Server] Failed to download default image ${filename}:`, err);
      }
    } else {
      console.log(`[Server] Default image ${filename} already exists locally.`);
    }
  }
}

async function startServer() {
  // Start seeding the default assets
  await seedDefaultImages();

  const app = express();

  // Handle larger base64 file payloads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Route: Health verify check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Route: Custom Base64 Image Upload
  app.post("/api/upload-base64", (req, res) => {
    try {
      const { filename, base64Data } = req.body;

      if (!base64Data) {
        return res.status(400).json({ error: "No base64 image data received." });
      }

      // Parse base64 header
      let extension = "jpg";
      let base64String = base64Data;

      const generalMatch = base64Data.match(/^data:([^;]+);base64,(.*)$/);
      if (generalMatch) {
        const mimeType = generalMatch[1];
        base64String = generalMatch[2];
        const mimeParts = mimeType.split("/");
        if (mimeParts.length === 2) {
          extension = mimeParts[1];
        }
      } else {
        const matches = base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/) || 
                        base64Data.match(/^data:application\/([A-Za-z-+\/]+);base64,(.+)$/) ||
                        base64Data.match(/^data:octet-stream;base64,(.+)$/);

        if (matches) {
          if (matches.length === 3) {
            extension = matches[1].split(";")[0] || "jpg";
            base64String = matches[2];
          } else if (matches.length === 2) {
            base64String = matches[1];
          }
        }
      }

      // Avoid path traversal and sanitize filename
      const originalExtension = filename ? path.extname(filename).toLowerCase().replace(".", "") : "";
      const finalExt = originalExtension || (extension === "jpeg" ? "jpg" : extension);
      const safeFilename = `uploaded_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${finalExt}`;
      const savePath = path.join(ASSETS_DIR, safeFilename);

      const buffer = Buffer.from(base64String, "base64");
      fs.writeFileSync(savePath, buffer);

      console.log(`[Server] Saved uploaded image to assets: ${safeFilename}`);
      return res.json({
        success: true,
        url: `/assets/${safeFilename}`,
        filename: safeFilename
      });

    } catch (error: any) {
      console.error("[Server] Error writing uploaded asset file:", error);
      return res.status(500).json({ error: error.message || "Failed to parse upload file content." });
    }
  });

  // Serve static assets directory directly so they are visible under /assets/
  app.use("/assets", express.static(ASSETS_DIR));

  // Serve the React frontend (Vite configuration)
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Launching Vite Dev Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Launching Static Production Server...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Scrapbook Server active at http://localhost:${PORT}`);
  });
}

startServer();
