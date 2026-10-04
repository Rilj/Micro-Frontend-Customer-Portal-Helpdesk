import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import { ArticleHandler } from "./handlers/article-handler";
import { CategoryHandler } from "./handlers/category-handler";
import { SearchHandler } from "./handlers/search-handler";
import { RatingHandler } from "./handlers/rating-handler";

dotenv.config();

const PORT = parseInt(process.env.PORT || "8003", 10);

const app: Application = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2500
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "knowledge-service" });
});

const articleHandler = new ArticleHandler(pool);
const categoryHandler = new CategoryHandler(pool);
const searchHandler = new SearchHandler(pool);
const ratingHandler = new RatingHandler(pool);

app.get("/api/categories", categoryHandler.list);
app.get("/api/articles", articleHandler.list);
app.get("/api/articles/:slug", articleHandler.getBySlug);
app.post("/api/articles/rate", ratingHandler.rateArticle);
app.post("/api/articles/:id/view", articleHandler.incrementView);
app.get("/api/search", searchHandler.search);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[KnowledgeService] Server running on port ${PORT}`);
});

export { app, pool };
