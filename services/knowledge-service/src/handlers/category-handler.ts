import { Request, Response } from "express";
import { Pool } from "pg";

export class CategoryHandler {
  constructor(private pool: Pool) {}

  list = async (req: Request, res: Response) => {
    const result = await this.pool.query(`
      SELECT c.*, COUNT(a.id) as article_count 
      FROM kb_categories c 
      LEFT JOIN kb_articles a ON a.category_id = c.id AND a.status = 'published'
      GROUP BY c.id 
      ORDER BY c.name
    `);
    res.json(result.rows);
  };
}
