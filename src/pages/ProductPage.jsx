import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'

export default function ProductPage() {
  const { id } = useParams()
  const product = getProductById(id)
  const { addToCart } = useCart()
  const [mainImage, setMainImage] = useState(product?.image)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">We couldn't find that product.</p>
        <Link to="/" className="text-pink-600 hover:underline">Back to the collection</Link>
      </div>
    )
  }

  function handleAddToBag() {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: mainImage,
        size: selectedSize,
      },
      quantity
    )
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center">
          <img src={mainImage} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg mb-4" />
          <div className="flex space-x-2">
            {product.thumbnails.map((thumb) => (
              <img
                key={thumb}
                src={thumb}
                alt="Thumbnail"
                onClick={() => setMainImage(thumb)}
                className="w-20 h-auto object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-pink-500 transition-colors duration-200"
              />
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-3/5">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-3xl font-semibold text-pink-600 mb-6">${product.price.toFixed(2)}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Sizes Available</h2>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size)
                    setSizeError(false)
                  }}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                    selectedSize === size
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-pink-200 hover:text-pink-800'
                  }`}
                >
                  {size === 'S' ? 'Small' : size === 'M' ? 'Medium' : 'Large'}
                </button>
              ))}
            </div>
            {sizeError && <p className="text-red-600 text-sm mt-2">Please select a size.</p>}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Quantity</h2>
            <div className="inline-flex items-center border border-gray-300 rounded-full">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-gray-700 hover:text-pink-600"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-4 font-medium text-gray-800">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 text-gray-700 hover:text-pink-600"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToBag}
            className="bg-pink-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-pink-700 transition-colors duration-300 shadow-lg w-full md:w-auto"
          >
            {justAdded ? 'Added!' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </div>
  )
}
