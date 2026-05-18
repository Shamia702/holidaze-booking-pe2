import { useState } from "react"
import { Link } from "react-router-dom"
import { loginUser, getProfile } from "../api/auth"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await loginUser(formData)

      if (data.errors) {
        setError("Invalid email or password")
        setLoading(false)
        return
      }

      const token = data.data.accessToken
      const name = data.data.name

      const profile = await getProfile(name, token)

      localStorage.setItem("token", token)
      localStorage.setItem("profile", JSON.stringify({
        ...profile,
        accessToken: token,
      }))

      if (profile.venueManager) {
        window.location.href = "/manager"
      } else {
        window.location.href = "/"
      }

    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-2">

      {/* LEFT PANEL — hidden on mobile */}
      <div className="hidden md:flex bg-navy flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-coral/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-500/10 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10">
          <h2 className="font-serif text-4xl text-white leading-tight mb-4">
            Welcome back to Holidaze
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-10">
            Sign in to manage your bookings and discover new venues across Norway.
          </p>
          <div className="flex flex-col gap-3">
            <div className="bg-white/6 border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <span className="text-2xl">🧳</span>
              <div>
                <p className="text-white text-sm font-medium">View your bookings</p>
                <p className="text-white/40 text-xs mt-0.5">See upcoming and past stays</p>
              </div>
            </div>
            <div className="bg-white/6 border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <span className="text-2xl">🏠</span>
              <div>
                <p className="text-white text-sm font-medium">Manage venues</p>
                <p className="text-white/40 text-xs mt-0.5">For venue managers</p>
              </div>
            </div>
            <div className="bg-white/6 border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-white text-sm font-medium">Check availability</p>
                <p className="text-white/40 text-xs mt-0.5">Live calendar for any venue</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="flex-1 bg-sand flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">

    
         
          <h2 className="font-serif text-3xl text-navy mb-2">
            Log in
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your stud.noroff.no credentials
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 flex items-center gap-2">
              <span className="text-red-500 text-sm">✕</span>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ola@stud.noroff.no"
                className="w-full px-4 py-3 border border-warmgray rounded-lg text-sm bg-white outline-none focus:border-coral transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                className="w-full px-4 py-3 border border-warmgray rounded-lg text-sm bg-white outline-none focus:border-coral transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-coral text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account yet?{" "}
            <Link to="/register" className="text-coral font-medium hover:underline">
              Register here
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Login