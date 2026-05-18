import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getVenues } from "../api/venues"

function Browse() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const venuesPerPage = 12

  useEffect(() => {
    async function fetchVenues() {
      try {
        const data = await getVenues()
        setVenues(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching venues:", error)
        setLoading(false)
      }
    }
    fetchVenues()
  }, [])

  function handleSearch(e) {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage)

  const paginatedVenues = filteredVenues.slice(
    (currentPage - 1) * venuesPerPage,
    currentPage * venuesPerPage
  )

  return (
    <div className="bg-sand min-h-screen">

      <div className="bg-navy px-4 md:px-10 py-10 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

          <div className="w-full md:w-auto">
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-3">
              Find your perfect stay
            </h1>
            <p className="text-white/50 text-sm md:text-base mb-6">
              Browse unique venues across Norway and beyond
            </p>
            <div className="flex w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by venue name..."
                value={search}
                onChange={handleSearch}
                className="flex-1 md:w-96 px-4 py-3 rounded-l-lg text-sm outline-none"
              />
              <button className="bg-coral text-white px-4 md:px-6 py-3 rounded-r-lg text-sm font-medium whitespace-nowrap">
                Search
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-shrink-0">
            <div className="text-center px-8">
              <div className="font-serif text-3xl text-white mb-1">500+</div>
              <div className="text-xs text-white/45">Venues</div>
            </div>
            <div className="w-px h-10 bg-white/15"></div>
            <div className="text-center px-8">
              <div className="font-serif text-3xl text-white mb-1">4.8★</div>
              <div className="text-xs text-white/45">Average rating</div>
            </div>
            <div className="w-px h-10 bg-white/15"></div>
            <div className="text-center px-8">
              <div className="font-serif text-3xl text-white mb-1">100%</div>
              <div className="text-xs text-white/45">Secure booking</div>
            </div>
          </div>

        </div>
      </div>

      <div className="px-4 md:px-10 py-6">

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            {filteredVenues.length} venues found
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading venues...</p>
            </div>
          </div>
        )}

        {!loading && filteredVenues.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-medium text-navy mb-2">
              No venues found
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Try a different search term
            </p>
            <button
              onClick={() => {
                setSearch("")
                setCurrentPage(1)
              }}
              className="bg-coral text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              Browse all venues
            </button>
          </div>
        )}

        {!loading && paginatedVenues.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedVenues.map((venue) => (
              <Link
                to={`/venues/${venue.id}`}
                key={venue.id}
                className="bg-white rounded-2xl border border-warmgray overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-40 bg-gray-200 overflow-hidden relative">
                  {venue.media && venue.media.length > 0 ? (
                    <img
                      src={venue.media[0].url}
                      alt={venue.media[0].alt || venue.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 text-navy text-xs font-medium px-2 py-1 rounded-full">
                    ⭐ {venue.rating}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-navy text-sm mb-1 truncate">
                    {venue.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    📍 {venue.location?.city || "Norway"},{" "}
                    {venue.location?.country || ""}
                  </p>

                  <div className="flex gap-1 flex-wrap mb-3">
                    {venue.meta?.wifi && (
                      <span className="text-xs bg-sand text-gray-500 px-2 py-0.5 rounded-full border border-warmgray">
                        WiFi
                      </span>
                    )}
                    {venue.meta?.parking && (
                      <span className="text-xs bg-sand text-gray-500 px-2 py-0.5 rounded-full border border-warmgray">
                        Parking
                      </span>
                    )}
                    {venue.meta?.breakfast && (
                      <span className="text-xs bg-sand text-gray-500 px-2 py-0.5 rounded-full border border-warmgray">
                        Breakfast
                      </span>
                    )}
                    {venue.meta?.pets && (
                      <span className="text-xs bg-sand text-gray-500 px-2 py-0.5 rounded-full border border-warmgray">
                        Pets
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-coral font-medium text-sm">
                      {venue.price} kr
                      <span className="text-gray-400 font-normal text-xs">
                        {" "}/night
                      </span>
                    </span>
                    <span className="text-xs text-gray-400">
                      Max {venue.maxGuests}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-1 md:gap-2 mt-8 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 md:px-4 py-2 text-xs md:text-sm border border-warmgray rounded-lg text-gray-500 hover:border-coral hover:text-coral disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 md:w-9 md:h-9 text-xs md:text-sm rounded-lg border transition-colors
                  ${currentPage === i + 1
                    ? "bg-coral text-white border-coral"
                    : "border-warmgray text-gray-500 hover:border-coral hover:text-coral"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 md:px-4 py-2 text-xs md:text-sm border border-warmgray rounded-lg text-gray-500 hover:border-coral hover:text-coral disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Browse