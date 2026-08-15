import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-pink-600 font-bold mt-1">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  )
}
