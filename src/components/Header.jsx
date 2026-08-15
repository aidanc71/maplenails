import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

// Keeps a hover-triggered panel open briefly after the mouse leaves, so
// crossing the gap between a trigger and the panel below it doesn't close it.
function useHoverDelay(delayMs = 200) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef(null)

  function show() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  function hide() {
    timeoutRef.current = setTimeout(() => setOpen(false), delayMs)
  }

  return { open, show, hide, setOpen }
}

const NAV_ITEMS = [
  {
    label: 'New Arrivals',
    href: '/',
    children: [
      { label: 'French Tip', href: '/?style=French%20Tip' },
      { label: 'Gradients', href: '/gradients' },
    ],
  },
  {
    label: 'Plain and Pretty',
    href: '/',
    children: [
      { label: 'Pastel', href: '/?style=Pastel' },
      { label: 'Glamorous Glitter', href: '/?style=Glitter' },
      { label: 'The Basics', href: '/?style=The%20Basics' },
    ],
  },
  {
    label: 'Seasonal',
    href: '/?style=Seasonal',
    children: [
      { label: 'Summer', href: '/?style=Seasonal' },
      { label: 'Autumn', href: '/?style=Seasonal' },
      { label: 'Winter', href: '/winter' },
      { label: 'Spring', href: '/spring' },
    ],
  },
]

function NavDropdown({ item }) {
  const { open, show, hide } = useHoverDelay()

  return (
    <li
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <Link
        to={item.href}
        className="font-semibold text-gray-800 hover:text-pink-600 transition-colors duration-200"
      >
        {item.label}
      </Link>
      <div
        className={`absolute left-1/2 top-full z-40 mt-2 w-56 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ul className="py-2">
          {item.children.map((child) => (
            <li key={child.label}>
              <Link to={child.href} className="block px-6 py-2 text-gray-700 hover:bg-pink-50">
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

function BagIcon({ onClick }) {
  const { itemCount } = useCart()
  return (
    <button className="icon-button relative" onClick={onClick} aria-label="View bag">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  )
}

function BagOverlay({ onClose }) {
  const { items, removeFromCart, total } = useCart()

  return (
    <div className="absolute right-0 top-full mt-2 w-[300px] max-h-[400px] overflow-y-auto bg-white shadow-lg rounded-lg border border-gray-200 z-50">
      <h3 className="p-4 border-b font-semibold text-gray-800">Your Bag</h3>
      {items.length === 0 ? (
        <p className="p-4 text-gray-600">Your bag is empty.</p>
      ) : (
        <>
          <ul className="p-2">
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}`} className="flex items-center justify-between py-2 px-2 border-b last:border-b-0">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="h-10 w-10 object-cover rounded mr-2" />
                  <div>
                    <span className="font-medium text-gray-800 block">{item.name}</span>
                    <span className="text-sm text-gray-600">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 text-sm p-1 rounded-full"
                  onClick={() => removeFromCart(item.productId, item.size)}
                  aria-label="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <div className="p-4 border-t flex items-center justify-between">
            <span className="text-sm text-gray-600">Total: ${total.toFixed(2)}</span>
            <Link
              to="/cart"
              onClick={onClose}
              className="inline-block bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
            >
              View Bag & Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default function Header() {
  const { open: bagOpen, show: showBag, hide: hideBag, setOpen: setBagOpen } = useHoverDelay()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-pink-100 shadow-sm py-0">
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
          <img src="https://placehold.co/40x40/f8bbd0/c2185b?text=Logo" alt="MapleNails Logo" className="h-10 w-10 rounded-full" />
          <span className="text-2xl font-bold text-pink-600">MapleNails</span>
        </Link>

        <nav className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <ul className="flex space-x-8">
            {NAV_ITEMS.map((item) => (
              <NavDropdown key={item.label} item={item} />
            ))}
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative w-36 md:w-48">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-gray-700 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="relative" onMouseEnter={showBag} onMouseLeave={hideBag}>
            <BagIcon onClick={() => setBagOpen((o) => !o)} />
            {bagOpen && <BagOverlay onClose={() => setBagOpen(false)} />}
          </div>

          <Link to="/account" className="icon-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>

          <button
            className="md:hidden icon-button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-pink-200 bg-pink-50">
          <ul className="container mx-auto px-4 py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="py-2">
                <p className="font-semibold text-gray-800 mb-1">{item.label}</p>
                <ul className="pl-4 space-y-1">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link
                        to={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1 text-gray-600 hover:text-pink-600"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
