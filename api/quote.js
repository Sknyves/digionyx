import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { 
      name, 
      company, 
      email, 
      phone, 
      service, 
      budget, 
      deadline, 
      details, 
      files_url 
    } = req.body;
    
    try {
      const client = await pool.connect();
      const result = await client.query(
        `INSERT INTO quote_requests 
        (name, company, email, phone, service, budget, deadline, details, files_url) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [name, company, email, phone, service, budget, deadline, details, files_url]
      );
      client.release();
      
      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}