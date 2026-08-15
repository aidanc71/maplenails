import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'maplenails_cart'

function sameLineItem(a, b) {
  return a.productId === b.productId && a.size === b.size
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Adding the same product + size again increases its quantity instead of
  // creating a second line item.
  function addToCart(item, quantity = 1) {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => sameLineItem(i, item))
      if (existingIndex !== -1) {
        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        }
        return next
      }
      return [...prev, { ...item, quantity }]
    })
  }

  function removeFromCart(productId, size) {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)))
  }

  function setQuantity(productId, size, quantity) {
    if (quantity < 1) {
      removeFromCart(productId, size)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId && i.size === size ? { ...i, quantity } : i))
    )
  }

  function clearCart() {
    setItems([])
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, setQuantity, clearCart, itemCount, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
