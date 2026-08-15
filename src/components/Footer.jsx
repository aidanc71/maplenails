export default function Footer() {
  return (
    <footer className="bg-pink-100 text-gray-700 py-6 mt-12 shadow-inner">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} MapleNails. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-pink-600">Privacy Policy</a>
          <a href="#" className="hover:text-pink-600">Terms of Service</a>
          <a href="#" className="hover:text-pink-600">Contact Us</a>
        </div>
      </div>
    </footer>
  )
}
