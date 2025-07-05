"use client";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import supabase from "@/config/supabaseClient";
import { toast } from "react-hot-toast";

const MyWatchlist = () => {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWatchlist = async () => {
    setLoading(true);
    setError("");
    // get Current User
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      setError("Anda harus login untuk melihat watchlist.");
      setLoading(false);
      return;
    }
    // Fetch watchlist
    const { data, error: watchlistError } = await supabase
      .from("watchlist")
      .select("id, movie_id, movie_title, movie_poster")
      .eq("user_id", user.id);
    if (watchlistError) {
      setError("Gagal mengambil data watchlist.");
      setLoading(false);
      return;
    }
    setWatchlist(data || []);
    setLoading(false);
  };

  const buttonDeleteWatchlist = async (deleteID) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Anda harus login.");
      return;
    }
    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("id", deleteID)
      .eq("user_id", user.id);

    if (!error) {
      toast.success("Berhasil hapus di watchlist kamu");
      fetchWatchlist(); // refetch data
    } else {
      toast.error("Gagal untuk menghapus data");
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {error}
      </div>
    );
  }

  if (!watchlist || watchlist.length == 0) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <FaHeart size={22} className="text-white" />
          <span className="text-white text-lg font-semibold">My Watchlist</span>
        </div>
        <div className="flex flex-col justify-center items-center pt-12">
          <img src="/img/not found watchlist.svg" alt="Watchlist not found" />
          <p className="text-4xl text-bold mt-8 text-[#3d3d3d]">
            Watchlist kamu tidak ditemukan
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <FaHeart size={22} className="text-white" />
        <span className="text-white text-lg font-semibold">My Watchlist</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {watchlist.map((movie) => (
          <div
            key={movie.id}
            className="group bg-[#18181B] rounded-2xl overflow-hidden shadow-lg flex flex-col relative"
          >
            <button
              onClick={() => buttonDeleteWatchlist(movie.id)}
              className="hidden group-hover:flex absolute top-3 right-3 bg-[#232226] p-2 rounded-full hover:bg-red-600 transition-colors"
              title="Hapus dari watchlist"
            >
              <FaTrash size={16} className="text-white" />
            </button>
            <img
              src={movie.movie_poster}
              alt={movie.movie_title}
              className="w-full h-80 object-cover cursor-pointer"
              onClick={() => router.push(`/order?movieId=${movie.movie_id}`)}
            />
            <button
              className="w-full bg-[#4A2075] text-white font-bold py-3 rounded-b-2xl mt-auto text-base tracking-wide shadow-md hover:bg-[#3a1760] transition-colors"
              onClick={() => router.push(`/order?movieId=${movie.movie_id}`)}
            >
              ORDER
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyWatchlist;
