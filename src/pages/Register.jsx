import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../api/auth"

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    venueManager: false,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleRole(isManager) {
    setFormData((prev) => ({ ...prev, venueManager: isManager }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!formData.email.endsWith("@stud.noroff.no")) {
      setError("Email must be a stud.noroff.no email address")
      return
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (formData.name.trim() === "") {
      setError("Name is required")
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        venueManager: formData.venueManager,
      }

      if (formData.avatar) {
        payload.avatar = {
          url: formData.avatar,
          alt: formData.name,
        }
      }

      const data = await registerUser(payload)

      if (data.errors) {
        setError(data.errors[0].message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-2">

      <div className="hidden md:flex bg-navy flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-coral/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-500/10 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10">
          <h2 className="font-serif text-4xl text-white leading-tight mb-4">
            Join Holidaze today
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-10">
            Create your free account and start exploring unique venues across Norway and beyond.
          </p>
          <div className="flex flex-col gap-3">
            <div className="bg-white/6 border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <span className="text-2xl">🌿</span>
              <div>
                <p className="text-white text-sm font-medium">Browse 500+ venues</p>
                <p className="text-white/40 text-xs mt-0.5">Cabins, city stays, eco lodges</p>
              </div>
            </div>
            <div className="bg-white/6 border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-white text-sm font-medium">Book instantly</p>
                <p className="text-white/40 text-xs mt-0.5">Pick dates and confirm</p>
              </div>
            </div>
            <div className="bg-white/6 border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <span className="text-2xl">🏠</span>
              <div>
                <p className="text-white text-sm font-medium">List your venue</p>
                <p className="text-white/40 text-xs mt-0.5">Register as a venue manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-sand flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">


          <h2 className="font-serif text-3xl text-navy mb-2">
            Create account
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Use your stud.noroff.no email to sign up
          </p>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-sm font-medium text-green-700">Account created successfully!</p>
              <p className="text-xs text-green-600 mt-1">Redirecting to login...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 flex items-center gap-2">
              <span className="text-red-500 text-sm">✕</span>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ola Nordmann"
                className="w-full px-4 py-3 border border-warmgray rounded-lg text-sm bg-white outline-none focus:border-coral transition-colors"
                required
              />
            </div>

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
                className={`w-full px-4 py-3 border rounded-lg text-sm bg-white outline-none transition-colors
                  ${formData.email && !formData.email.endsWith("@stud.noroff.no")
                    ? "border-red-400 bg-red-50"
                    : formData.email && formData.email.endsWith("@stud.noroff.no")
                    ? "border-green-400 bg-green-50"
                    : "border-warmgray focus:border-coral"
                  }`}
                required
              />
              {formData.email && !formData.email.endsWith("@stud.noroff.no") && (
                <p className="text-xs text-red-500 mt-1">Must be a stud.noroff.no email</p>
              )}
              {formData.email && formData.email.endsWith("@stud.noroff.no") && (
                <p className="text-xs text-green-600 mt-1">✓ Valid Noroff email</p>
              )}
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
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 border border-warmgray rounded-lg text-sm bg-white outline-none focus:border-coral transition-colors"
                required
              />
            </div>

          
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                I am registering as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRole(false)}
                  className={`border-2 rounded-xl p-4 text-center transition-all
                    ${!formData.venueManager
                      ? "border-coral bg-coral/10"
                      : "border-warmgray hover:border-coral/50"
                    }`}
                >
                  <div className="text-2xl mb-2">🧳</div>
                  <div className="text-sm font-medium text-navy">Customer</div>
                  <div className={`text-xs mt-1 ${!formData.venueManager ? "text-coral" : "text-gray-400"}`}>
                    Browse and book venues
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRole(true)}
                  className={`border-2 rounded-xl p-4 text-center transition-all
                    ${formData.venueManager
                      ? "border-coral bg-coral/10"
                      : "border-warmgray hover:border-coral/50"
                    }`}
                >
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="text-sm font-medium text-navy">Venue Manager</div>
                  <div className={`text-xs mt-1 ${formData.venueManager ? "text-coral" : "text-gray-400"}`}>
                    List and manage venues
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-coral text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-coral font-medium hover:underline">
              Log in
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Register