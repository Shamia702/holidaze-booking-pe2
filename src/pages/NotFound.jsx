import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center">
      <div className="text-center">
        <p className="font-serif text-8xl text-coral mb-4">404</p>
        <h1 className="text-2xl font-medium text-navy mb-3">
          Page not found
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-coral text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}

export default NotFound