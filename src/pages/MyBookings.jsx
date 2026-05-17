import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getProfileBookings, updateAvatar } from "../api/profiles"

function MyBookings() {
  const navigate = useNavigate()
  const profile = JSON.parse(localStorage.getItem("profile") || "null")
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarError, setAvatarError] = useState("")

  useEffect(() => {
    if (!profile) {
      navigate("/login")
      return
    }
    fetchBookings()
  }, [])

  async function fetchBookings() {
    try {
      const data = await getProfileBookings(profile.name)
      setBookings(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setLoading(false)
    }
  }

  async function handleAvatarUpdate() {
    setAvatarError("")
    if (!avatarUrl) {
      setAvatarError("Please enter an image URL")
      return
    }
    setAvatarLoading(true)
    try {
      const data = await updateAvatar(profile.name, avatarUrl)
      const updatedProfile = { ...profile, avatar: data.avatar }
      localStorage.setItem("profile", JSON.stringify(updatedProfile))
      setShowAvatarModal(false)
      setAvatarUrl("")
      window.location.reload()
    } catch (error) {
      setAvatarError("Failed to update avatar. Please try again.")
    }
    setAvatarLoading(false)
  }

  const today = new Date()

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.dateTo) >= today
  )
  const pastBookings = bookings.filter(
    (b) => new Date(b.dateTo) < today
  )

  const displayedBookings =
    activeTab === "upcoming"
      ? upcomingBookings
      : activeTab === "past"
      ? pastBookings
      : bookings

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sand">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-sand min-h-screen">
      <div className="px-10 py-8">

        <div className="bg-white border border-warmgray rounded-2xl p-6 flex items-center gap-5 mb-8">

          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center text-coral font-medium text-2xl overflow-hidden flex-shrink-0">
              {profile?.avatar?.url ? (
                <img
                  src={profile.avatar.url}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-coral text-white rounded-full flex items-center justify-center text-xs hover:bg-opacity-90 transition-colors"
            >
              ✏
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-medium text-navy mb-1">
              {profile?.name}
            </h1>
            <p className="text-sm text-gray-400">
              {profile?.email}
              {" · "}
              Customer
            </p>
          </div>

          <button
            onClick={() => setShowAvatarModal(true)}
            className="px-4 py-2 text-sm font-medium text-coral border border-coral rounded-lg hover:bg-coral hover:text-white transition-colors"
          >
            Edit profile
          </button>

        </div>

        <div className="flex gap-2 mb-6">
          {["upcoming", "past", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors capitalize
                ${activeTab === tab
                  ? "bg-coral text-white"
                  : "bg-white border border-warmgray text-gray-500 hover:border-coral hover:text-coral"
                }`}
            >
              {tab === "upcoming"
                ? `Upcoming (${upcomingBookings.length})`
                : tab === "past"
                ? `Past (${pastBookings.length})`
                : `All (${bookings.length})`}
            </button>
          ))}
        </div>

        {displayedBookings.length === 0 ? (
          <div className="bg-white border border-warmgray rounded-2xl p-12 text-center">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-lg font-medium text-navy mb-2">
              No bookings found
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {activeTab === "upcoming"
                ? "You have no upcoming bookings"
                : activeTab === "past"
                ? "You have no past bookings"
                : "You have not made any bookings yet"}
            </p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              Browse venues
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayedBookings.map((booking) => {
              const isUpcoming = new Date(booking.dateTo) >= today
              const nights = Math.ceil(
                (new Date(booking.dateTo) - new Date(booking.dateFrom)) /
                  (1000 * 60 * 60 * 24)
              )
              return (
                <div
                  key={booking.id}
                  className="bg-white border border-warmgray rounded-2xl p-5 flex gap-5"
                >
  
                  <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                    {booking.venue?.media?.[0]?.url ? (
                      <img
                        src={booking.venue.media[0].url}
                        alt={booking.venue.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-navy text-base mb-1">
                      {booking.venue?.name || "Venue"}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {"📅 "}
                      {new Date(booking.dateFrom).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {" → "}
                      {new Date(booking.dateTo).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {" · "}
                      {nights} night{nights > 1 ? "s" : ""}
                      {" · "}
                      {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-coral font-medium text-sm">
                        {booking.venue?.price
                          ? `${booking.venue.price * nights} kr total`
                          : ""}
                      </span>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full
                          ${isUpcoming
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {isUpcoming ? "Upcoming" : "Completed"}
                      </span>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}

      </div>

      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">

            <div className="flex justify-between items-center mb-5">
              <h3 className="font-serif text-xl text-navy">Edit profile</h3>
              <button
                onClick={() => {
                  setShowAvatarModal(false)
                  setAvatarError("")
                  setAvatarUrl("")
                }}
                className="text-gray-400 hover:text-navy text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-warmgray">
              <div className="w-14 h-14 rounded-full bg-coral/20 flex items-center justify-center text-coral font-medium text-xl overflow-hidden">
                {profile?.avatar?.url ? (
                  <img
                    src={profile.avatar.url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-medium text-navy text-sm">
                  {profile?.name}
                </p>
                <p className="text-xs text-gray-400">{profile?.email}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                New avatar URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 border border-warmgray rounded-lg text-sm outline-none focus:border-coral transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">
                Link to a publicly accessible image file
              </p>
            </div>
            {avatarError && (
              <p className="text-sm text-red-500 mb-4">{avatarError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAvatarModal(false)
                  setAvatarError("")
                  setAvatarUrl("")
                }}
                className="flex-1 py-2.5 border border-warmgray rounded-lg text-sm text-gray-500 hover:border-coral hover:text-coral transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAvatarUpdate}
                disabled={avatarLoading}
                className="flex-1 py-2.5 bg-coral text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-60"
              >
                {avatarLoading ? "Saving..." : "Save changes"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default MyBookings