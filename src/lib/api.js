const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/api/products`)
  if (!res.ok) throw new Error('Failed to load products')
  const data = await res.json()
  // Postgres numeric columns come back as strings over JSON — convert here
  // once so every component can just use product.price as a number.
  return data.map((p) => ({ ...p, price: parseFloat(p.price) }))
}

export async function fetchProduct(id) {
  const res = await fetch(`${API_URL}/api/products/${id}`)
  if (!res.ok) return null
  const data = await res.json()
  return { ...data, price: parseFloat(data.price) }
}

export async function createOrder(order, accessToken) {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(order),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to create order')
  }
  return res.json()
}

export async function createCheckoutSession(items, accessToken) {
  const res = await fetch(`${API_URL}/api/checkout/create-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to start checkout')
  }
  return res.json() // { url }
}

export async function confirmOrder(sessionId, accessToken) {
  const res = await fetch(`${API_URL}/api/checkout/session/${sessionId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to confirm order')
  }
  return res.json()
}
