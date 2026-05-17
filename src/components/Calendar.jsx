import { useState } from "react";

function Calendar({ bookings = [], onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const bookedDates = [];
  bookings.forEach((booking) => {
    const start = new Date(booking.dateFrom);
    const end = new Date(booking.dateTo);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (end >= today) {
      const current = new Date(start);
      current.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      while (current <= end) {
        bookedDates.push(current.toDateString());
        current.setDate(current.getDate() + 1);
      }
    }
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  function isBooked(day) {
    const date = new Date(year, month, day).toDateString();
    return bookedDates.includes(date);
  }

  function isPast(day) {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  }

  function isCheckIn(day) {
    if (!checkIn) return false;
    return new Date(year, month, day).toDateString() === checkIn.toDateString();
  }

  function isCheckOut(day) {
    if (!checkOut) return false;
    return (
      new Date(year, month, day).toDateString() === checkOut.toDateString()
    );
  }

  function isInRange(day) {
    if (!checkIn || !checkOut) return false;
    const date = new Date(year, month, day);
    return date > checkIn && date < checkOut;
  }

  function handleDayClick(day) {
    if (isBooked(day) || isPast(day)) return;

    const clicked = new Date(year, month, day);

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(clicked);
      setCheckOut(null);
      return;
    }

    if (clicked <= checkIn) {
      setCheckIn(clicked);
      setCheckOut(null);
      return;
    }

    const current = new Date(checkIn);
    current.setDate(current.getDate() + 1);
    let hasBookedInRange = false;
    while (current < clicked) {
      if (bookedDates.includes(current.toDateString())) {
        hasBookedInRange = true;
        break;
      }
      current.setDate(current.getDate() + 1);
    }

    if (hasBookedInRange) {
      setCheckIn(clicked);
      setCheckOut(null);
      return;
    }

    setCheckOut(clicked);

    if (onDateSelect) {
      onDateSelect({
        checkIn: checkIn,
        checkOut: clicked,
        nights: Math.ceil((clicked - checkIn) / (1000 * 60 * 60 * 24)),
      });
    }
  }

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function getDayStyle(day) {
    if (isPast(day)) {
      return "text-gray-300 cursor-not-allowed";
    }
    if (isBooked(day)) {
      return "text-gray-300 line-through cursor-not-allowed";
    }
    if (isCheckIn(day) || isCheckOut(day)) {
      return "text-coral font-semibold border-b-2 border-coral cursor-pointer";
    }
    if (isInRange(day)) {
      return "text-coral border-b border-coral/50 cursor-pointer";
    }
    return "text-navy hover:text-coral cursor-pointer";
  }

  return (
    <div className="border border-warmgray rounded-xl p-4">
      {checkIn && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="border border-warmgray rounded-lg p-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Check-in
            </p>
            <p className="text-sm text-navy font-medium">
              {checkIn.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="border border-warmgray rounded-lg p-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Check-out
            </p>
            <p className="text-sm text-navy font-medium">
              {checkOut
                ? checkOut.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Select date"}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="text-gray-400 hover:text-navy text-lg px-2 transition-colors"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-navy">{monthName}</span>
        <button
          onClick={nextMonth}
          className="text-gray-400 hover:text-navy text-lg px-2 transition-colors"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`text-center text-xs py-2 transition-colors ${getDayStyle(day)}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 pt-3 border-t border-warmgray">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-coral"></div>
          <span className="text-xs text-gray-400">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-px bg-coral/50"></div>
          <span className="text-xs text-gray-400">In range</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-300 line-through">15</span>
          <span className="text-xs text-gray-400">Booked</span>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
