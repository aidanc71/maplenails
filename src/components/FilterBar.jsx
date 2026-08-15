import { STYLES } from '../data/products.js'

export const PRICE_SORTS = {
  none: 'Sort by price',
  low: 'Price: Low to High',
  high: 'Price: High to Low',
}

export default function FilterBar({ selectedStyle, onStyleChange, priceSort, onPriceSortChange }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
      <select
        value={selectedStyle}
        onChange={(e) => onStyleChange(e.target.value)}
        className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        <option value="all">All Styles</option>
        {STYLES.map((style) => (
          <option key={style} value={style}>
            {style}
          </option>
        ))}
      </select>

      <select
        value={priceSort}
        onChange={(e) => onPriceSortChange(e.target.value)}
        className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        {Object.entries(PRICE_SORTS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {selectedStyle !== 'all' && (
        <button
          onClick={() => onStyleChange('all')}
          className="text-sm text-pink-600 hover:underline"
        >
          Clear style filter
        </button>
      )}
    </div>
  )
}
