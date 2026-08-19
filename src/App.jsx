import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import ProductPage from './pages/ProductPage.jsx'
import Cart from './pages/Cart.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import Login from './pages/Login.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/account" element={<ComingSoon />} />
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </Layout>
  )
}
