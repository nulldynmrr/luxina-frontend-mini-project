"use client";

import React from "react";

const CardOrder = ({
  date = [],
  time = [],
  activeDate,
  activeTime,
  cinemas = [],
  selectedCinema = null,
  activePeople,
  onDateClick,
  onTimeClick,
  onCinemaChange,
  onPeopleChange,
}) => {
  cinemas.map((cinema) => {
    console.log("Cinema di Card: ", cinema.id);
  });
  return (
    <div className="bg-[#1C1C1C] rounded-2xl p-4 md:p-6 flex flex-wrap justify-between items-start gap-6 w-full">
      <div>
        <p className="text-sm text-gray-400 mb-2">Date</p>
        <div className="flex gap-2">
          {date.map((d) => (
            <button
              type="button"
              key={d.day}
              onClick={() => onDateClick && onDateClick(d)}
              className={`flex flex-col items-center px-4 py-2 rounded-xl text-sm w-16 border-none focus:outline-none transition-colors
                ${
                  activeDate && activeDate.day === d.day
                    ? "bg-[#4A2075] text-white"
                    : "bg-[#2C2C2C] text-white"
                }
              `}
            >
              <span className="text-lg font-medium">{d.day}</span>
              <span className="text-xs text-gray-400 uppercase">{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-2">Time</p>
        <div className="flex gap-2">
          {time.map((t, idx) => (
            <button
              type="button"
              key={t.hour + t.period + idx}
              onClick={() => onTimeClick && onTimeClick(t)}
              className={`flex flex-col items-center px-4 py-2 rounded-xl text-sm w-16 border-none focus:outline-none transition-colors
                ${
                  activeTime &&
                  activeTime.hour === t.hour &&
                  activeTime.period === t.period
                    ? "bg-[#4A2075] text-white"
                    : "bg-[#2C2C2C] text-white"
                }
              `}
            >
              <span className="text-lg font-medium">{t.hour}</span>
              <span className="text-xs text-gray-400 uppercase">
                {t.period}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <p className="text-sm text-gray-400 mb-2">Cinema</p>
        <select
          className="bg-[#2C2C2C] text-white text-sm px-4 py-2 rounded-xl appearance-none outline-0"
          value={selectedCinema?.id || ""}
          onChange={(e) => {
            const cinema = cinemas.find((c) => c.id === e.target.value);
            if (onCinemaChange) onCinemaChange(cinema);
          }}
        >
          {cinemas.map((cinema) => (
            <option key={cinema.id} value={cinema.id}>
              {cinema.name} {cinema.location} - {cinema.studio_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <p className="text-sm text-gray-400 mb-2">People</p>
        <div className="flex items-center gap-2">
          <select
            className="bg-[#2C2C2C] text-white text-sm px-4 py-2 rounded-xl appearance-none outline-none"
            value={activePeople}
            onChange={onPeopleChange}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CardOrder;
