"use client";

import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

const apiImg = process.env.NEXT_PUBLIC_BASEIMGURL;

const CardMovie = ({ poster_path, title, release_date, vote_average, id }) => {
  const router = useRouter();
  return (
    <div
      className="relative h-[250px] rounded-xl overflow-hidden bg-[#2B2B2B] cursor-pointer"
      onClick={() => router.push(`/order?movieId=${id}`)}
    >
      <Image
        src={`${apiImg}${poster_path}`}
        alt={title}
        fill
        className="object-cover rounded-xl"
      />

      <div className="absolute bottom-0 top-0 left-0 right-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>

      <div className="absolute bottom-2 left-2 right-2 z-20 text-white text-sm">
        <h4 className="font-semibold">{title}</h4>
        <div className="flex justify-between text-xs text-[#B0B0B0] mt-1">
          <span>{release_date ? release_date.slice(0, 4) : "-"}</span>
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-400" size={12} />
            {vote_average !== undefined && vote_average !== null
              ? vote_average.toString().slice(0, 3)
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardMovie;
