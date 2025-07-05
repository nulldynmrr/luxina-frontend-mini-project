"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = ({ title, description, imageSrc, linkOrder, linkTrailer }) => {
  return (
    <div className="space-y-8">
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover rounded-xl"
        />
        <div className="absolute bottom-0 left-0 w-full h-[180px] bg-gradient-to-t from-[#1E1717] to-transparent z-10"></div>
        <div className="absolute bottom-5 left-6 z-20">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-sm max-w-xl text-gray-50 line-clamp-2">
            {description}
          </p>
          <Link href={linkOrder}>
            <button className="mt-6 px-4 py-2 bg-[#F3F3F3] text-black text-sm font-semibold rounded-full">
              Order Now
            </button>
          </Link>
          <Link href={linkTrailer}>
            <button className="ml-2 px-4 py-2 border border-[#F3F3F3] text-[#F3F3F3] text-sm font-semibold rounded-full">
              Watch Trailer
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
