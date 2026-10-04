import { Request, Response } from "express";
import { Pool } from "pg";

export class ArticleHandler {
  constructor(private pool: Pool) {}

  list = async (req: Request, res: Response) => {
    const { category, tag, search, page, limit } = req.query as Record<string, string>;
    const pageNum = parseInt(page || "1");
    const limitNum = parseInt(limit || "20");

    let query = `
      SELECT a.*, c.name as category_name 
      FROM kb_articles a 
      JOIN kb_categories c ON a.category_id = c.id 
      WHERE a.status = 'published'
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND c.slug = $${paramIndex++}`;
      params.push(category);
    }

    if (search) {
      query += ` AND (a.title ILIKE $${paramIndex} OR a.content ILIKE $${paramIndex + 1})`;
      params.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    const offset = (pageNum - 1) * limitNum;
    params.push(limitNum, offset);

    const result = await this.pool.query(query, params);
    const totalResult = await this.pool.query("SELECT COUNT(*) FROM kb_articles a WHERE a.status = 'published'");

    res.json({ articles: result.rows, total: parseInt(totalResult.rows[0].count) });
  };

  getBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const result = await this.pool.query(
      `SELECT a.*, c.name as category_name 
       FROM kb_articles a 
       JOIN kb_categories c ON a.category_id = c.id 
       WHERE a.slug = $1 AND a.status = 'published'`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(result.rows[0]);
  };

  incrementView = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.pool.query(
      "UPDATE kb_articles SET view_count = view_count + 1 WHERE id = $1",
      [id]
    );
    res.json({ success: true });
  };
}
