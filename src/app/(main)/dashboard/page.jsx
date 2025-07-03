"use client";

import React from "react";
import CardMovie from "@/components/CardMovie/page";
import Hero from "@/components/Hero/page";

const movieData = [
  {
    image: "/img/gambar 1.jpg",
    title: "Furiosa : A mad max saga",
    year: 2024,
    rating: 9,
  },
  {
    image: "/img/gambar 2.jpg",
    title: "Furiosa : A mad max saga",
    year: 2024,
    rating: 9,
  },
  {
    image: "/img/gambar 3.jpg",
    title: "Furiosa : A mad max saga",
    year: 2024,
    rating: 9,
  },
  {
    image: "/img/gambar 4.jpg",
    title: "Furiosa : A mad max saga",
    year: 2024,
    rating: 9,
  },
  {
    image: "/img/gambar 4.jpg",
    title: "Furiosa : A mad max saga",
    year: 2024,
    rating: 9,
  },
  {
    image: "/img/gambar 4.jpg",
    title: "Furiosa : A mad max saga",
    year: 2024,
    rating: 9,
  },
  {
    image: "/img/gambar 4.jpg",
    title: "Furiosa : A mad max saga",
    year: 2024,
    rating: 9,
  },
];

const genreList = [
  "Komedi",
  "Action",
  "Animation",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Fantasy",
];

const Dashboard = () => {
  return (
    <section className="text-white">
      <Hero
        title="Lilo & Stitch"
        description="The wildly funny and touching story of a lonely Hawaiian girl and the fugitive alien who helps to mend her broken family."
        imageSrc="/img/header.png"
        linkOrder="/order"
        linkTrailer="/trailer"
      />

      <div className="flex gap-2 flex-wrap mb-6">
        {genreList.map((genre, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full text-sm ${
              genre === "Animation"
                ? "bg-white text-black"
                : "bg-[#2B2B2B] text-[#B0B0B0]"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Card List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {movieData.map((movie, index) => (
          <CardMovie key={index} {...movie} />
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
