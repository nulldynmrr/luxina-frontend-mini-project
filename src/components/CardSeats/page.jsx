"use client";

import React from "react";

const CardSeat = ({ seatId, isSelected, isBooked, onClick }) => {
  return (
    <button
      onClick={() => onClick(seatId)}
      disabled={isBooked}
      className={
        "w-10 h-10 md:w-12 md:h-12 text-sm rounded-lg flex items-center justify-center font-medium " +
        (isBooked
          ? "bg-white text-black cursor-not-allowed"
          : isSelected
          ? "bg-[#6B21A8] text-white"
          : "bg-[#2C2C2C] text-white")
      }
    >
      {seatId}
    </button>
  );
};

const CardSeats = ({
  seatRows = [],
  seatNumbers = [],
  excludedSeats = [],
  bookedSeats = [],
  selectedSeats = [],
  onSeatClick,
}) => {
  return (
    <div className="grid grid-cols-9 gap-2">
      {seatRows.map((row) =>
        seatNumbers.map((num) => {
          const seatId = `${row}${num}`;
          if (excludedSeats.includes(seatId)) return <div key={seatId} />;
          return (
            <CardSeat
              key={seatId}
              seatId={seatId}
              isSelected={selectedSeats.includes(seatId)}
              isBooked={bookedSeats.includes(seatId)}
              onClick={onSeatClick}
            />
          );
        })
      )}
    </div>
  );
};

export default CardSeats;
