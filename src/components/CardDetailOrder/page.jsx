"use client";

import React from "react";

const CardDetailOrder = ({
  date,
  time,
  people,
  price,
  location,
  selectedSeats,
  onOrder,
}) => {
  return (
    <div className="w-full text-white">
      <h3 className="text-sm mb-4 text-gray-400">Your Order</h3>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-gray-400">Date</p>
          <p className="text-lg font-semibold">{date}</p>
        </div>

        <div>
          <p className="text-gray-400">Time</p>
          <p className="text-lg font-semibold">{time}</p>
        </div>

        <div>
          <p className="text-gray-400">People</p>
          <p className="text-lg font-semibold">
            {people.toString().padStart(2, "0")}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Price</p>
          <p className="text-lg font-semibold">{price}</p>
        </div>

        <div>
          <p className="text-gray-400">Location</p>
          <p className="text-lg font-semibold">{location}</p>
        </div>

        <div>
          <p className="text-gray-400 mb-1">Seating</p>
          <div className="flex gap-2 flex-wrap">
            {selectedSeats.map((seat) => (
              <span
                key={seat}
                className="bg-[#6B21A8] px-3 py-2 rounded-lg text-white text-sm"
              >
                {seat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onOrder}
        className="mt-8 w-full bg-[#4A2075] text-yellow-400 font-bold py-3 rounded-2xl"
      >
        ORDER
      </button>
    </div>
  );
};

export default CardDetailOrder;
