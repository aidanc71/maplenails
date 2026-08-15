import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const SHIPPING_FLAT_RATE = 4.99
const FREE_SHIPPING_THRESHOLD = 50

export default function Cart() {
  const { items, removeFromCart, setQuantity, total } = useCart()

  const shipping = items.length === 0 || total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE
  const grandTotal = total + shipping

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Bag</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your bag is empty.</p>
          <Link to="/" className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200">
            Browse the collection
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y">
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}`} className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded mr-4" />
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center border border-gray-300 rounded-full">
                    <button
                      onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)}
                      className="px-3 py-1 text-gray-700 hover:text-pink-600"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-3 font-medium text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)}
                      className="px-3 py-1 text-gray-700 hover:text-pink-600"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p className="w-16 text-right font-semibold text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.productId, item.size)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t space-y-2">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-sm text-gray-500">
                Add ${(FREE_SHIPPING_THRESHOLD - total).toFixed(2)} more for free shipping.
              </p>
            )}
            <div className="flex items-center justify-between text-lg font-semibold text-gray-800 pt-2 border-t">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <button className="w-full mt-4 bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200">
              Checkout (coming in Milestone 5)
            </button>
          </div>
        </>
      )}
    </div>
  )
}
