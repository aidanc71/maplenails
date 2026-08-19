import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

// Orders are only ever created via the Stripe checkout flow
// (server/routes/checkout.js), which looks up real prices from the database
// instead of trusting whatever the browser sends. This file only reads.

// GET /api/orders — the logged-in user's own order history
router.get('/', requireAuth, async (req, res) => {
  try {
    const ordersResult = await pool.query(
      'select * from orders where user_id = $1 order by created_at desc',
      [req.user.id]
    )
    const orders = ordersResult.rows

    for (const order of orders) {
      const itemsResult = await pool.query('select * from order_items where order_id = $1', [
        order.id,
      ])
      order.items = itemsResult.rows
    }

    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

export default router
