"use client";

import React, { useEffect, useState } from "react";
import CardMovie from "@/components/CardMovie/page";
import Hero from "@/components/Hero/page";
import {
  getMovieList,
  getMoviesByGenre,
  searchMovie,
  getMoviesByCountry,
} from "@/lib/api";
import { useSearch } from "@/context/Context";

const genreList = [
  { name: "All", id: null },
  { name: "Action", id: 28 },
  { name: "Aniamtion", id: 16 },
  { name: "Comedy", id: 35 },
  { name: "Drama", id: 18 },
  { name: "Horror", id: 27 },
  { name: "Sci-Fi", id: 878 },
  { name: "Thriller", id: 53 },
];

const IMGURL = process.env.NEXT_PUBLIC_BASEIMGURL;

const Dashboard = () => {
  const { search, country } = useSearch();
  const [movies, setMovies] = useState([]);
  const [selectGenre, setSelectGenre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [heroList, setHeroList] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  const onClickGenre = async (genre) => {
    setSelectGenre(genre);
    if (genre == null) {
      const allMovies = await getMovieList();
      setMovies(allMovies);
    } else {
      const search = await getMoviesByGenre(genre);
      setMovies(search);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (search && country && country.code) {
        const moviesByCountry = await getMoviesByCountry(country.code);
        const filtered = moviesByCountry.filter((m) =>
          m.title.toLowerCase().includes(search.toLowerCase())
        );
        setMovies(filtered);
      } else if (search) {
        setSelectGenre(null);
        const movies = await searchMovie(search);
        setMovies(movies);
      } else if (country && country.code) {
        setSelectGenre(null);
        const movies = await getMoviesByCountry(country.code);
        setMovies(movies);
      } else {
        const movies = await getMovieList();
        setMovies(movies);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [search, country]);

  useEffect(() => {
    const fetchHeroList = async () => {
      const movies = await getMovieList();
      setHeroList(movies);
    };
    fetchHeroList();
  }, []);

  useEffect(() => {
    if (heroList.length > 0) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => {
          let next = Math.floor(Math.random() * heroList.length);
          while (next === prev && heroList.length > 1) {
            next = Math.floor(Math.random() * heroList.length);
          }
          return next;
        });
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [heroList]);

  const cardMovies = movies.filter((m) => m.id !== heroList[heroIndex]?.id);

  return (
    <section className="text-white">
      <div className="relative w-full overflow-hidden h-[310px]">
        {heroList.length > 0 && (
          <Hero
            key={heroList[heroIndex].id}
            title={heroList[heroIndex].title}
            description={heroList[heroIndex].overview}
            imageSrc={IMGURL + heroList[heroIndex].backdrop_path}
            linkOrder={`/order?movieId=${heroList[heroIndex].id}`}
            linkTrailer={`/trailer?id=${heroList[heroIndex].id}`}
          />
        )}
      </div>

      <div className="flex gap-2 flex-wrap mb-6 mt-2">
        {genreList.map((genre, index) => (
          <button
            key={index}
            onClick={() => onClickGenre(genre.id)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectGenre === genre.id || null
                ? "bg-white text-black"
                : "bg-[#2B2B2B] text-[#B0B0B0]"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pb-8">
        {cardMovies.map((movie, index) => (
          <CardMovie key={index} {...movie} />
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
