import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import checkoutRouter from './routes/checkout.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/checkout', checkoutRouter)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`MapleNails API running on http://localhost:${port}`)
})
