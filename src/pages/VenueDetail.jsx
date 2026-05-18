import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getVenueById } from "../api/venues"
import { createBooking } from "../api/bookings"
import Calendar from "../components/Calendar"

function VenueDetail() {
  const { id } = useParams()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDates, setSelectedDates] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState("")

  const profile = JSON.parse(localStorage.getItem("profile") || "null")
  const isLoggedIn = !!localStorage.getItem("token")
  const isManager = profile?.venueManager

  useEffect(() => {
    async function fetchVenue() {
      try {
        const data = await getVenueById(id)
        setVenue(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching venue:", error)
        setLoading(false)
      }
    }
    fetchVenue()
  }, [id])

  async function handleBooking() {
    if (!selectedDates) return
    setBookingLoading(true)
    setBookingError("")

    try {
      const result = await createBooking({
        dateFrom: selectedDates.checkIn.toISOString(),
        dateTo: selectedDates.checkOut.toISOString(),
        guests: 1,
        venueId: id,
      })

      if (result.errors) {
        setBookingError(result.errors[0].message)
        setBookingLoading(false)
        return
      }

      setBookingSuccess(true)
    } catch (error) {
      setBookingError("Something went wrong. Please try again.")
    }

    setBookingLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sand">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading venue...</p>
        </div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sand">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-medium text-navy mb-2">Venue not found</p>
          <Link to="/" className="text-sm text-coral hover:underline">
            Back to all venues
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-sand min-h-screen">

      <div className="h-48 md:h-96 overflow-hidden relative">
        {venue.media && venue.media.length > 0 ? (
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-navy text-xs font-medium px-3 py-1.5 rounded-full">
            ⭐ {venue.rating}
          </span>
          {venue.meta?.pets && (
            <span className="bg-white/90 backdrop-blur-sm text-navy text-xs font-medium px-3 py-1.5 rounded-full">
              🐾 Pet friendly
            </span>
          )}
        </div>
      </div>

      <div className="px-4 md:px-10 py-6 md:py-8">

        <p className="text-sm text-gray-400 mb-4 md:mb-6">
          <Link to="/" className="hover:text-coral transition-colors">
            Home
          </Link>
          {" / "}
          <Link to="/" className="hover:text-coral transition-colors">
            Venues
          </Link>
          {" / "}
          <span className="text-coral">{venue.name}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">

          <div className="md:col-span-2 flex flex-col gap-6">

            <div>
              <h1 className="font-serif text-2xl md:text-4xl text-navy mb-3">
                {venue.name}
              </h1>
              <div className="flex flex-wrap gap-3 md:gap-5 text-sm text-gray-500">
                <span>
                  📍 {venue.location?.city || "Norway"},{" "}
                  {venue.location?.country || ""}
                </span>
                <span>⭐ {venue.rating} rating</span>
                <span>👥 Max {venue.maxGuests} guests</span>
                <span className="text-coral font-medium">
                  {venue.price} kr / night
                </span>
              </div>
            </div>

            <hr className="border-warmgray" />

            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                About this venue
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {venue.description || "No description available"}
              </p>
            </div>

            <hr className="border-warmgray" />

            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
                What this place offers
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {venue.meta?.wifi && (
                  <div className="flex items-center gap-3 bg-white border border-warmgray rounded-lg px-4 py-3 text-sm text-navy">
                    📶 High-speed WiFi
                  </div>
                )}
                {venue.meta?.parking && (
                  <div className="flex items-center gap-3 bg-white border border-warmgray rounded-lg px-4 py-3 text-sm text-navy">
                    🅿️ Free parking
                  </div>
                )}
                {venue.meta?.breakfast && (
                  <div className="flex items-center gap-3 bg-white border border-warmgray rounded-lg px-4 py-3 text-sm text-navy">
                    🍳 Breakfast included
                  </div>
                )}
                {venue.meta?.pets && (
                  <div className="flex items-center gap-3 bg-white border border-warmgray rounded-lg px-4 py-3 text-sm text-navy">
                    🐾 Pets allowed
                  </div>
                )}
                {!venue.meta?.wifi &&
                  !venue.meta?.parking &&
                  !venue.meta?.breakfast &&
                  !venue.meta?.pets && (
                    <p className="text-sm text-gray-400 col-span-2">
                      No amenities listed
                    </p>
                  )}
              </div>
            </div>

            <hr className="border-warmgray" />

            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
                Hosted by
              </p>
              <div className="bg-white border border-warmgray rounded-xl p-4 flex items-center gap-4">
                {venue.owner?.avatar?.url ? (
                  <img
                    src={venue.owner.avatar.url}
                    alt={venue.owner.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center text-coral font-medium text-lg flex-shrink-0">
                    {venue.owner?.name?.charAt(0).toUpperCase() || "H"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy text-sm truncate">
                    {venue.owner?.name || "Host"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Venue Manager
                  </p>
                </div>
                <button className="px-3 md:px-4 py-2 text-xs font-medium text-coral border border-coral rounded-lg hover:bg-coral hover:text-white transition-colors flex-shrink-0">
                  Contact
                </button>
              </div>
            </div>

            <hr className="border-warmgray" />

            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
                Location
              </p>
              <div className="bg-green-50 border border-warmgray rounded-xl h-36 md:h-44 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl md:text-4xl">📍</span>
                <p className="text-sm font-medium text-navy">
                  {venue.location?.city || "Norway"},{" "}
                  {venue.location?.country || ""}
                </p>
                {venue.location?.address && (
                  <p className="text-xs text-gray-400">
                    {venue.location.address}
                  </p>
                )}
              </div>
            </div>

            <hr className="border-warmgray" />

            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
                Rating
              </p>
              <div className="bg-white border border-warmgray rounded-xl p-5 flex items-center gap-6">
                <div className="text-center flex-shrink-0">
                  <div className="font-serif text-4xl md:text-5xl text-coral">
                    {venue.rating}
                  </div>
                  <div className="text-yellow-400 text-sm md:text-base mt-1">
                    {"★".repeat(Math.round(venue.rating))}
                    {"☆".repeat(5 - Math.round(venue.rating))}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">out of 5</div>
                </div>
                <div className="border-l border-warmgray pl-4 md:pl-6 flex-1">
                  <p className="text-sm font-medium text-navy mb-1">
                    Guest satisfaction
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                    This venue has been rated {venue.rating} out of 5 by
                    guests who have stayed here.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div>
            <div className="bg-white border border-warmgray rounded-2xl p-4 md:p-6 md:sticky md:top-6">

              <div className="flex items-baseline gap-2 mb-5 md:mb-6">
                <span className="font-serif text-2xl md:text-3xl text-coral">
                  {venue.price} kr
                </span>
                <span className="text-sm text-gray-400">/ night</span>
              </div>

              <Calendar
                bookings={venue.bookings}
                onDateSelect={(dates) => setSelectedDates(dates)}
              />
              {selectedDates && (
                <div className="mt-4 pt-4 border-t border-warmgray">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>
                      {venue.price} kr × {selectedDates.nights} night
                      {selectedDates.nights > 1 ? "s" : ""}
                    </span>
                    <span>{venue.price * selectedDates.nights} kr</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-navy border-t border-warmgray pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-coral">
                      {venue.price * selectedDates.nights} kr
                    </span>
                  </div>
                </div>
              )}

              {isLoggedIn ? (
                isManager ? (
                  <div className="bg-gray-50 border border-warmgray rounded-xl p-4 text-center mt-4">
                    <p className="text-sm text-gray-500">
                      Managers cannot book venues
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    {bookingSuccess ? (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <p className="text-2xl mb-2">✅</p>
                        <p className="text-sm font-medium text-green-700">
                          Booking confirmed!
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Check your bookings page
                        </p>
                      </div>
                    ) : (
                      <>
                        {bookingError && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                            <p className="text-sm text-red-600">{bookingError}</p>
                          </div>
                        )}
                        <button
                          onClick={handleBooking}
                          disabled={!selectedDates || bookingLoading}
                          className="w-full py-3 bg-coral text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {bookingLoading
                            ? "Confirming..."
                            : !selectedDates
                            ? "Select dates to book"
                            : "Confirm booking"}
                        </button>
                        <p className="text-xs text-gray-400 text-center mt-2">
                          You won't be charged yet
                        </p>
                      </>
                    )}
                  </div>
                )
              ) : (
                <div className="bg-coral/10 border border-coral/30 rounded-xl p-4 text-center mt-4">
                  <p className="font-medium text-coral text-sm mb-1">
                    Log in to book this venue
                  </p>
                  <p className="text-xs text-coral/70 mb-4">
                    You need an account to make a booking
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-coral border border-coral rounded-lg hover:bg-coral hover:text-white transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm font-medium text-white bg-coral rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default VenueDetail