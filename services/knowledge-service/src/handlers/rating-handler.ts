import { Request, Response } from "express";
import { Pool } from "pg";

export class RatingHandler {
  constructor(private pool: Pool) {}

  rateArticle = async (req: Request, res: Response) => {
    const { articleId, rating } = req.body;

    if (typeof rating !== "boolean") {
      return res.status(400).json({ message: "Rating must be boolean" });
    }

    const result = await this.pool.query("SELECT * FROM kb_articles WHERE id = $1", [articleId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (rating) {
      await this.pool.query(
        "UPDATE kb_articles SET helpful_count = helpful_count + 1 WHERE id = $1",
        [articleId]
      );
    } else {
      await this.pool.query(
        "UPDATE kb_articles SET not_helpful_count = not_helpful_count + 1 WHERE id = $1",
        [articleId]
      );
    }

    res.json({ success: true });
  };
}
