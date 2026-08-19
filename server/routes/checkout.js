import { Router } from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const router = Router()

const SHIPPING_FLAT_RATE = 4.99
const FREE_SHIPPING_THRESHOLD = 50

// POST /api/checkout/create-session
// body: { items: [{ productId, size, quantity }] }
// Note: we deliberately ignore any price the client sends — real prices are
// always looked up from the database, so nobody can tamper with the amount
// charged by editing values in the browser.
router.post('/create-session', requireAuth, async (req, res) => {
  const { items } = req.body

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' })
  }

  try {
    const productIds = [...new Set(items.map((i) => i.productId))]
    const productsResult = await pool.query('select * from products where id = any($1)', [
      productIds,
    ])
    const productsById = Object.fromEntries(productsResult.rows.map((p) => [p.id, p]))

    let subtotal = 0
    const lineItems = []
    const orderItemsMetadata = []

    for (const item of items) {
      const product = productsById[item.productId]
      if (!product) {
        return res.status(400).json({ error: `Unknown product: ${item.productId}` })
      }
      const price = parseFloat(product.price)
      const quantity = Math.max(1, parseInt(item.quantity) || 1)
      subtotal += price * quantity

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: `${product.name} (Size: ${item.size})` },
          unit_amount: Math.round(price * 100), // Stripe uses cents
        },
        quantity,
      })

      orderItemsMetadata.push({
        productId: product.id,
        name: product.name,
        price,
        size: item.size,
        quantity,
      })
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: req.user.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        user_id: req.user.id,
        items: JSON.stringify(orderItemsMetadata),
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: (subtotal + shipping).toFixed(2),
      },
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to start checkout' })
  }
})

// GET /api/checkout/session/:sessionId
// Called by the frontend's order confirmation page after Stripe redirects
// back. Verifies payment actually succeeded, then saves the order to the
// database if it hasn't been saved already (safe to call more than once,
// e.g. if the user refreshes the confirmation page).
router.get('/session/:sessionId', requireAuth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId)

    if (session.metadata.user_id !== req.user.id) {
      return res.status(403).json({ error: 'This session does not belong to you' })
    }

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed', status: session.payment_status })
    }

    const existing = await pool.query('select * from orders where stripe_session_id = $1', [
      session.id,
    ])

    if (existing.rows.length > 0) {
      const order = existing.rows[0]
      const itemsResult = await pool.query('select * from order_items where order_id = $1', [
        order.id,
      ])
      return res.json({ ...order, items: itemsResult.rows })
    }

    const items = JSON.parse(session.metadata.items)
    const shippingAddress = session.shipping_details
      ? {
          name: session.shipping_details.name,
          address: session.shipping_details.address,
        }
      : null

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      const orderResult = await client.query(
        `insert into orders (user_id, status, stripe_session_id, subtotal, shipping, total, shipping_address)
         values ($1, 'paid', $2, $3, $4, $5, $6)
         returning *`,
        [
          req.user.id,
          session.id,
          session.metadata.subtotal,
          session.metadata.shipping,
          session.metadata.total,
          shippingAddress ? JSON.stringify(shippingAddress) : null,
        ]
      )
      const order = orderResult.rows[0]

      for (const item of items) {
        await client.query(
          `insert into order_items (order_id, product_id, product_name, price, size, quantity)
           values ($1, $2, $3, $4, $5, $6)`,
          [order.id, item.productId, item.name, item.price, item.size, item.quantity]
        )
      }

      await client.query('COMMIT')
      res.status(201).json({ ...order, items })
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to confirm order' })
  }
})

export default router
