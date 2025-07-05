"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaHeart, FaStar, FaClock } from "react-icons/fa";
import { IoTicket } from "react-icons/io5";
import {
  getMovieDetail,
  getMovieVideos,
  getMovieImages,
  getMovieCredits,
} from "@/lib/api";
import supabase from "@/config/supabaseClient";
import { toast } from "react-hot-toast";

const IMGURL = process.env.NEXT_PUBLIC_BASEIMGURL;

const Trailer = () => {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("id");
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoKey, setVideoKey] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const [movieRes, videoRes, imageRes, creditRes] = await Promise.all([
        getMovieDetail(movieId),
        getMovieVideos(movieId),
        getMovieImages(movieId),
        getMovieCredits(movieId),
      ]);
      setMovie(movieRes);
      setVideos(videoRes);
      setImages(imageRes.slice(0, 6));
      setCredits(creditRes);
      setLoading(false);
    }
    if (movieId) fetchAll();
  }, [movieId]);

  const trailer = videos.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  useEffect(() => {
    if (trailer) {
      setVideoKey(trailer.key);
    }
  }, [trailer]);

  useEffect(() => {
    if (videoKey && isMuted) {
      const timer = setTimeout(() => {
        setIsMuted(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [videoKey, isMuted]);

  const buttonWishlist = async () => {
    // get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error("Anda harus login untuk menambah wishlist.");
      return;
    }

    // cek data supaya tidak double
    const { data: exit, error: Error } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", user.id)
      .eq("movie_id", movie.id)
      .maybeSingle();

    if (Error) {
      toast.error("Gagal memeriksa data");
      return;
    }

    if (exit) {
      toast.error("Film sudah tersimpan di watchlist kamu");
      return;
    }

    // Insert ke tabel watchlist
    const { error } = await supabase.from("watchlist").insert({
      user_id: user.id,
      movie_id: movie.id,
      movie_title: movie.title,
      movie_poster: movie.backdrop_path
        ? process.env.NEXT_PUBLIC_BASEIMGURL + movie.backdrop_path
        : null,
    });
    if (error) {
      toast.error("Gagal menambah ke wishlist.");
    } else {
      toast.success("Film tersimpan di watchlist");
    }
  };

  if (loading || !movie) {
    return (
      <div className="min-h-screen bg-[#212121] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const mainCrew = credits.crew.filter((c) =>
    ["Director", "Producer", "Original Music Composer"].includes(c.job)
  );
  const cast = credits.cast.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#212121] text-white">
      <div className="relative w-full h-[320px] md:h-[420px] rounded-3xl overflow-hidden mb-8">
        {/* BACKDROP */}
        {trailer && videoKey ? (
          <iframe
            ref={iframeRef}
            key={`${videoKey}-${isMuted}`}
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${
              isMuted ? 1 : 0
            }&loop=1&playlist=${videoKey}&controls=0&rel=0&showinfo=0&modestbranding=1&enablejsapi=1&origin=${
              window.location.origin
            }`}
            title="YouTube trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute left-1/2 top-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 scale-150 object-cover object-center rounded-3xl border-0 z-0"
            style={{ transformOrigin: "center" }}
            onLoad={() => {
              console.log("Video loaded successfully");
            }}
          />
        ) : (
          <img
            src={IMGURL + movie.backdrop_path}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover object-top z-0"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#212121] via-[#212121]/30 to-transparent z-10" />
      </div>
      <div className="md:px-6 pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h1 className="text-4xl font-bold mb-2 md:mb-0">{movie.title}</h1>
          <div className="flex gap-4">
            <button
              className="flex items-center gap-2 border border-[#F3F3F3] text-[#F3F3F3] font-semibold px-4 py-2 md:px-6 md:py-3 rounded-full text-base bg-transparent hover:bg-[#4A2075] hover:text-white hover:border-[#4A2075] hover:scale-105 transition-all duration-200"
              onClick={() => router.push(`/order?movieId=${movie.id}`)}
            >
              <IoTicket size={20} className="-ml-1" /> Order Now
            </button>
            <button
              className="group flex items-center gap-2 border border-[#F3F3F3] text-[#F3F3F3] font-semibold px-4 py-2 md:px-6 md:py-3 rounded-full text-base bg-transparent hover:bg-[#F3F3F3] hover:text-[#4A2075] hover:border-[#F3F3F3] hover:scale-105 transition-all duration-200"
              onClick={buttonWishlist}
            >
              <FaHeart
                size={18}
                className="text-[#F3F3F3] group-hover:text-[#4A2075] transition-colors duration-200"
              />
              Add My Wishlist
            </button>
          </div>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {movie.genres.map((g) => (
            <span
              key={g.id}
              className="bg-[#2C2C2C] px-3 py-1 rounded-full text-xs text-gray-300"
            >
              {g.name}
            </span>
          ))}
        </div>
        <p className="text-gray-300 mb-4">{movie.overview}</p>
        <div className="flex gap-6 text-sm text-gray-400 items-center mb-8">
          <span className="bg-[#232226] px-2 py-1 rounded text-white text-xs">
            {movie.original_language?.toUpperCase()}
          </span>
          <span className="text-[#D5AE00] flex items-center gap-1">
            <FaStar size={16} color="#D5AE00" />
            {movie.vote_average?.toFixed(1)}
          </span>
          <span>Semua Umur</span>
          <span className="flex items-center gap-1">
            <FaClock size={14} /> {movie.runtime} menit
          </span>
        </div>
      </div>
      <div className="md:px-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Scene Highlights</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={IMGURL + img.file_path}
                alt="scene"
                className="w-full aspect-[16/9] object-cover rounded-xl"
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Main Crew</h2>
          <div className="flex gap-4 flex-wrap">
            {mainCrew.map((crew, idx) => (
              <div key={idx} className="flex flex-col items-center w-32">
                <img
                  src={
                    crew.profile_path
                      ? IMGURL + crew.profile_path
                      : "/img/Avatar.png"
                  }
                  alt={crew.name}
                  className="w-16 h-16 object-cover rounded-full mb-2 bg-[#2C2C2C]"
                />
                <span className="text-sm font-semibold text-center">
                  {crew.name}
                </span>
                <span className="text-xs text-gray-400 text-center">
                  sebagai {crew.job}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Cast</h2>
          <div className="flex gap-4 flex-wrap">
            {cast.map((actor, idx) => (
              <div key={idx} className="flex flex-col items-center w-32">
                <img
                  src={
                    actor.profile_path
                      ? IMGURL + actor.profile_path
                      : "/img/Avatar.png"
                  }
                  alt={actor.name}
                  className="w-16 h-16 object-cover rounded-full mb-2 bg-[#2C2C2C]"
                />
                <span className="text-sm font-semibold text-center">
                  {actor.name}
                </span>
                <span className="text-xs text-gray-400 text-center">
                  sebagai {actor.character}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trailer;
