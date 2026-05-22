import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getManagerVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from "../api/venues";
import { updateAvatar } from "../api/profiles";

function ManagerDashboard() {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("profile") || "null");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("venues");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [deletingVenue, setDeletingVenue] = useState(null);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxGuests: "",
    image: "",
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });

  useEffect(() => {
    if (!profile || !profile.venueManager) {
      navigate("/");
      return;
    }
    fetchVenues();
  }, []);

  async function fetchVenues() {
    try {
      const data = await getManagerVenues(profile.name);
      setVenues(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setLoading(false);
    }
  }

  async function handleAvatarUpdate() {
    setAvatarError("");
    if (!avatarUrl) {
      setAvatarError("Please enter an image URL");
      return;
    }
    setAvatarLoading(true);
    try {
      const data = await updateAvatar(profile.name, avatarUrl);
      const updatedProfile = { ...profile, avatar: data.avatar };
      localStorage.setItem("profile", JSON.stringify(updatedProfile));
      setShowAvatarModal(false);
      setAvatarUrl("");
      window.location.reload();
    } catch (error) {
      setAvatarError("Failed to update avatar. Please try again.");
    }
    setAvatarLoading(false);
  }

  function openAddModal() {
    setEditingVenue(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      maxGuests: "",
      image: "",
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    });
    setFormError("");
    setShowModal(true);
  }

  function openEditModal(venue) {
    setEditingVenue(venue);
    setFormData({
      name: venue.name || "",
      description: venue.description || "",
      price: venue.price || "",
      maxGuests: venue.maxGuests || "",
      image: venue.media?.[0]?.url || "",
      wifi: venue.meta?.wifi || false,
      parking: venue.meta?.parking || false,
      breakfast: venue.meta?.breakfast || false,
      pets: venue.meta?.pets || false,
    });
    setFormError("");
    setShowModal(true);
  }

  function openDeleteModal(venue) {
    setDeletingVenue(venue);
    setShowDeleteModal(true);
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!formData.name) {
      setFormError("Venue name is required");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setFormError("Price must be greater than 0");
      return;
    }
    if (!formData.maxGuests || formData.maxGuests <= 0) {
      setFormError("Max guests must be greater than 0");
      return;
    }

    setFormLoading(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
      meta: {
        wifi: formData.wifi,
        parking: formData.parking,
        breakfast: formData.breakfast,
        pets: formData.pets,
      },
    };

    if (formData.image) {
      payload.media = [{ url: formData.image, alt: formData.name }];
    }

    try {
      if (editingVenue) {
        const result = await updateVenue(editingVenue.id, payload);
        if (result.errors) {
          setFormError(result.errors[0].message);
          setFormLoading(false);
          return;
        }
      } else {
        const result = await createVenue(payload);
        if (result.errors) {
          setFormError(result.errors[0].message);
          setFormLoading(false);
          return;
        }
      }
      await fetchVenues();
      setShowModal(false);
    } catch (error) {
      setFormError("Something went wrong. Please try again.");
    }

    setFormLoading(false);
  }

  async function handleDelete() {
    try {
      await deleteVenue(deletingVenue.id);
      await fetchVenues();
      setShowDeleteModal(false);
      setDeletingVenue(null);
    } catch (error) {
      console.error("Error deleting venue:", error);
    }
  }

  const allBookings = venues.flatMap((venue) =>
    (venue.bookings || []).map((booking) => ({
      ...booking,
      venueName: venue.name,
    })),
  );

  const upcomingBookings = allBookings.filter(
    (b) => new Date(b.dateTo) >= new Date(),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sand">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sand min-h-screen">
      <div className="px-4 md:px-10 py-6 md:py-8">
        <div className="bg-white border border-warmgray rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-coral/20 flex items-center justify-center text-coral font-medium text-xl overflow-hidden">
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
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-coral text-white rounded-full flex items-center justify-center text-xs"
              >
                ✏
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-base md:text-xl font-medium text-navy truncate">
                {profile?.name}
              </h1>
              <p className="text-xs text-gray-400 truncate">{profile?.email}</p>
              <p className="text-xs text-gray-400">Venue Manager</p>
            </div>

            <button
              onClick={() => setShowAvatarModal(true)}
              className="hidden md:block px-4 py-2 text-sm font-medium text-coral border border-coral rounded-lg hover:bg-coral hover:text-white transition-colors flex-shrink-0"
            >
              Edit profile
            </button>
          </div>

          <button
            onClick={() => setShowAvatarModal(true)}
            className="md:hidden mt-3 w-full py-2 text-xs font-medium text-coral border border-coral rounded-lg"
          >
            Edit profile
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white border border-warmgray rounded-2xl p-3 md:p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 md:mb-2">
              Venues
            </p>
            <p className="font-serif text-2xl md:text-4xl text-coral">
              {venues.length}
            </p>
          </div>
          <div className="bg-white border border-warmgray rounded-2xl p-3 md:p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 md:mb-2">
              Upcoming
            </p>
            <p className="font-serif text-2xl md:text-4xl text-navy">
              {upcomingBookings.length}
            </p>
          </div>
          <div className="bg-white border border-warmgray rounded-2xl p-3 md:p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 md:mb-2">
              Total
            </p>
            <p className="font-serif text-2xl md:text-4xl text-navy">
              {allBookings.length}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("venues")}
            className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors
              ${
                activeTab === "venues"
                  ? "bg-coral text-white"
                  : "bg-white border border-warmgray text-gray-500 hover:border-coral hover:text-coral"
              }`}
          >
            My venues ({venues.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors
              ${
                activeTab === "bookings"
                  ? "bg-coral text-white"
                  : "bg-white border border-warmgray text-gray-500 hover:border-coral hover:text-coral"
              }`}
          >
            Bookings ({allBookings.length})
          </button>
        </div>

        {activeTab === "venues" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base md:text-lg font-medium text-navy">
                My venues
              </h2>
              <button
                onClick={openAddModal}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-coral text-white rounded-lg text-xs md:text-sm font-medium hover:bg-opacity-90 transition-colors"
              >
                + Add venue
              </button>
            </div>

            {venues.length === 0 ? (
              <div className="bg-white border border-warmgray rounded-2xl p-8 md:p-12 text-center">
                <p className="text-4xl mb-4">🏠</p>
                <p className="text-lg font-medium text-navy mb-2">
                  No venues yet
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Create your first venue to start receiving bookings
                </p>
                <button
                  onClick={openAddModal}
                  className="px-6 py-2 bg-coral text-white rounded-lg text-sm font-medium"
                >
                  Add your first venue
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {venues.map((venue) => (
                  <div
                    key={venue.id}
                    className="bg-white border border-warmgray rounded-2xl p-4 md:p-5 flex gap-3 md:gap-5"
                  >
                    <div className="w-20 h-16 md:w-24 md:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                      {venue.media?.[0]?.url ? (
                        <img
                          src={venue.media[0].url}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-navy text-sm md:text-base mb-1 truncate">
                        {venue.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-400 mb-2">
                        {venue.price} kr / night
                        {" · "}
                        Max {venue.maxGuests}
                        {" · "}
                        {venue.bookings?.length || 0} bookings
                      </p>
                      <div className="flex gap-1 flex-wrap">
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
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditModal(venue)}
                        className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-navy border border-warmgray rounded-lg hover:border-coral hover:text-coral transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(venue)}
                        className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <h2 className="text-base md:text-lg font-medium text-navy mb-4">
              All bookings
            </h2>

            {allBookings.length === 0 ? (
              <div className="bg-white border border-warmgray rounded-2xl p-8 md:p-12 text-center">
                <p className="text-4xl mb-4">📅</p>
                <p className="text-lg font-medium text-navy mb-2">
                  No bookings yet
                </p>
                <p className="text-sm text-gray-400">
                  Bookings will appear here when guests book your venues
                </p>
              </div>
            ) : (
              <div className="bg-white border border-warmgray rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-warmgray">
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4">
                        Guest
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4">
                        Venue
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4">
                        Dates
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4">
                        Guests
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.map((booking) => {
                      const isUpcoming = new Date(booking.dateTo) >= new Date();
                      return (
                        <tr
                          key={booking.id}
                          className="border-b border-warmgray last:border-b-0"
                        >
                          <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-navy">
                            {booking.customer?.name || "Guest"}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500">
                            {booking.venueName}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500">
                            {new Date(booking.dateFrom).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                            {" → "}
                            {new Date(booking.dateTo).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500">
                            {booking.guests}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4">
                            <span
                              className={`text-xs font-medium px-2 md:px-3 py-1 rounded-full
                                ${
                                  isUpcoming
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                            >
                              {isUpcoming ? "Upcoming" : "Completed"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 md:p-6 w-full max-w-lg my-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-serif text-xl text-navy">
                {editingVenue ? "Edit venue" : "Add new venue"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-navy text-xl"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                <span className="text-red-500 text-sm">✕</span>
                <p className="text-sm text-red-600">{formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Venue name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Mountain Cabin Retreat"
                  className="w-full px-4 py-3 border border-warmgray rounded-lg text-sm outline-none focus:border-coral transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe your venue..."
                  rows={3}
                  className="w-full px-4 py-3 border border-warmgray rounded-lg text-sm outline-none focus:border-coral transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Price per night (kr)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="1200"
                    min="1"
                    className="w-full px-4 py-3 border border-warmgray rounded-lg text-sm outline-none focus:border-coral transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Max guests
                  </label>
                  <input
                    type="number"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleFormChange}
                    placeholder="4"
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border border-warmgray rounded-lg text-sm outline-none focus:border-coral transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-warmgray rounded-lg text-sm outline-none focus:border-coral transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["wifi", "parking", "breakfast", "pets"].map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-3 bg-sand border border-warmgray rounded-lg px-4 py-3 cursor-pointer hover:border-coral transition-colors"
                    >
                      <input
                        type="checkbox"
                        name={amenity}
                        checked={formData[amenity]}
                        onChange={handleFormChange}
                        className="accent-coral"
                      />
                      <span className="text-sm text-navy">
                        {amenity === "wifi"
                          ? "📶 WiFi"
                          : amenity === "parking"
                            ? "🅿️ Parking"
                            : amenity === "breakfast"
                              ? "🍳 Breakfast"
                              : "🐾 Pets allowed"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-warmgray rounded-lg text-sm text-gray-500 hover:border-coral hover:text-coral transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 bg-coral text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-60"
                >
                  {formLoading
                    ? "Saving..."
                    : editingVenue
                      ? "Save changes"
                      : "Create venue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-5 md:p-6 w-full max-w-sm text-center">
            <p className="text-4xl mb-4">🗑️</p>
            <h3 className="font-serif text-xl text-navy mb-2">
              Delete this venue?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently delete{" "}
              <span className="font-medium text-navy">
                {deletingVenue?.name}
              </span>{" "}
              and all its data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingVenue(null);
                }}
                className="flex-1 py-2.5 border border-warmgray rounded-lg text-sm text-gray-500 hover:border-coral hover:text-coral transition-colors"
              >
                Keep it
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-5 md:p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-serif text-xl text-navy">Edit profile</h3>
              <button
                onClick={() => {
                  setShowAvatarModal(false);
                  setAvatarError("");
                  setAvatarUrl("");
                }}
                className="text-gray-400 hover:text-navy text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-warmgray">
              <div className="w-14 h-14 rounded-full bg-coral/20 flex items-center justify-center text-coral font-medium text-xl overflow-hidden flex-shrink-0">
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
                <p className="font-medium text-navy text-sm">{profile?.name}</p>
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
                  setShowAvatarModal(false);
                  setAvatarError("");
                  setAvatarUrl("");
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
  );
}

export default ManagerDashboard;
