import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('select * from products order by created_at asc')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('select * from products where id = $1', [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

export default router
