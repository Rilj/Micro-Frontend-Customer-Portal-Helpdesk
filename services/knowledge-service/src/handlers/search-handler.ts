import { Request, Response } from "express";
import { Pool } from "pg";

export class SearchHandler {
  constructor(private pool: Pool) {}

  search = async (req: Request, res: Response) => {
    const { q, page, limit } = req.query as Record<string, string>;
    const pageNum = parseInt(page || "1");
    const limitNum = parseInt(limit || "20");

    if (!q || q.length < 2) {
      return res.json({ articles: [], total: 0 });
    }

    const result = await this.pool.query(
      `SELECT a.*, c.name as category_name,
       ts_rank(to_tsvector('english', a.title || ' ' || a.content), plainto_tsquery('english', $1)) as rank
       FROM kb_articles a 
       JOIN kb_categories c ON a.category_id = c.id
       WHERE a.status = 'published' 
       AND to_tsvector('english', a.title || ' ' || a.content) @@ plainto_tsquery('english', $1)
       ORDER BY rank DESC, a.created_at DESC
       LIMIT $2 OFFSET $3`,
       [q, limitNum, (pageNum - 1) * limitNum]
    );

    const totalResult = await this.pool.query(
      `SELECT COUNT(*) FROM kb_articles a
       WHERE a.status = 'published' 
       AND to_tsvector('english', a.title || ' ' || a.content) @@ plainto_tsquery('english', $1)`,
      [q]
    );

    res.json({ articles: result.rows, total: parseInt(totalResult.rows[0].count) });
  };
}
