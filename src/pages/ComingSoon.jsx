import { Link } from 'react-router-dom'

export default function ComingSoon() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">Coming Soon</h1>
      <p className="text-gray-600 mb-6">We're still building this page out.</p>
      <Link to="/" className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200">
        Back to the collection
      </Link>
    </div>
  )
}
