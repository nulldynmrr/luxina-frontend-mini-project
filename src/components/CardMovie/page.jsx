"use client";

import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

const CardMovie = ({ image, title, year, rating }) => {
  return (
    <div className="relative h-[250px] rounded-xl overflow-hidden bg-[#2B2B2B]">
      <Image src={image} alt={title} fill className="object-cover rounded-xl" />

      <div className="absolute bottom-0 top-0 left-0 right-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>

      <div className="absolute bottom-2 left-2 right-2 z-20 text-white text-sm">
        <h4 className="font-semibold">{title}</h4>
        <div className="flex justify-between text-xs text-[#B0B0B0] mt-1">
          <span>{year}</span>
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-400" size={12} />
            {rating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardMovie;
