import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { confirmOrder } from '../lib/api.js'

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { session } = useAuth()
  const { clearCart } = useCart()

  const [status, setStatus] = useState('loading') // loading | success | error
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!sessionId || !session) return

    confirmOrder(sessionId, session.access_token)
      .then((o) => {
        setOrder(o)
        setStatus('success')
        clearCart()
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong confirming your order')
        setStatus('error')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, session])

  if (!sessionId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">No checkout session found.</p>
        <Link to="/" className="text-pink-600 hover:underline">Back to the collection</Link>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Confirming your order...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">We couldn't confirm that order</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/cart" className="text-pink-600 hover:underline">Back to your bag</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Order placed!</h1>
      <p className="text-gray-600 mb-1">Order ID: {order.id}</p>
      <p className="text-gray-600 mb-6">Total: ${parseFloat(order.total).toFixed(2)}</p>

      {order.shipping_address && (
        <div className="text-left border rounded-lg p-4 mb-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-800 mb-1">Shipping to</p>
          <p>{order.shipping_address.name}</p>
          <p>{order.shipping_address.address.line1}</p>
          {order.shipping_address.address.line2 && <p>{order.shipping_address.address.line2}</p>}
          <p>
            {order.shipping_address.address.city}, {order.shipping_address.address.state}{' '}
            {order.shipping_address.address.postal_code}
          </p>
          <p>{order.shipping_address.address.country}</p>
        </div>
      )}

      <ul className="text-left border rounded-lg divide-y mb-6">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between px-4 py-2 text-sm text-gray-700">
            <span>
              {item.product_name ?? item.name} × {item.quantity} (Size: {item.size})
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <Link to="/" className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200">
        Continue Shopping
      </Link>
    </div>
  )
}
