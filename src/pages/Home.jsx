import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import FilterBar from '../components/FilterBar.jsx'

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedStyle, setSelectedStyle] = useState(searchParams.get('style') || 'all')
  const [priceSort, setPriceSort] = useState('none')

  // Keep local state in sync if the URL changes (e.g. clicking a nav link
  // while already on the homepage).
  useEffect(() => {
    setSelectedStyle(searchParams.get('style') || 'all')
  }, [searchParams])

  function handleStyleChange(style) {
    setSelectedStyle(style)
    if (style === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ style })
    }
  }

  const visibleProducts = useMemo(() => {
    let result = products

    if (selectedStyle !== 'all') {
      result = result.filter((p) => p.style === selectedStyle)
    }

    if (priceSort === 'low') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (priceSort === 'high') {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [selectedStyle, priceSort])

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Press-On Collection</h1>

      <FilterBar
        selectedStyle={selectedStyle}
        onStyleChange={handleStyleChange}
        priceSort={priceSort}
        onPriceSortChange={setPriceSort}
      />

      {visibleProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products match that filter.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
