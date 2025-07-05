"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMovieById } from "@/lib/api";
import supabase from "@/config/supabaseClient";
import { toast } from "react-hot-toast";
import { FaTicketAlt } from "react-icons/fa";

const MyTicket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [movie, setMovie] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Anda harus login dulu");
        setLoading(false);
        return;
      }

      // fetch ticket
      const { data, error } = await supabase
        .from("ticket_orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setTicket(null);
      } else {
        setTicket(data);
      }
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const fetchMovie = async () => {
      if (ticket && ticket.movie_id) {
        const movie = await getMovieById(ticket.movie_id);
        setMovie(movie || null);
      }
    };
    fetchMovie();
  }, [ticket]);

  if (loading)
    return (
      <div className="text-white flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!ticket)
    return (
      <div className="text-white flex justify-center items-center h-screen">
        Tiket tidak ditemukan
      </div>
    );
  if (!movie)
    return (
      <div className="text-white flex justify-center items-center h-screen">
        Movie tidak ditemukan
      </div>
    );

  // Format tanggal
  const dateObj = new Date(ticket.show_date);
  const dateStr = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Format jam
  const timeStr = ticket.show_time?.slice(0, 5) || "";

  // Format harga
  const priceStr = ticket.total_price
    ? `Rp.${ticket.total_price.toLocaleString("id-ID")}`
    : "-";

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center mb-8">
        <FaTicketAlt className="text-white text-2xl mr-2" />
        <span className="text-white text-lg font-semibold">My Ticket</span>
      </div>
      {/* Ticket */}
      <div className="w-full bg-[#FAFAFA] rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden print-ticket">
        <div className="flex flex-col md:flex-row items-stretch min-w-[120px]">
          <div className="w-full flex flex-col justify-center items-center bg-[#4A2075] md:w-12">
            <span className="md:w-full text-white font-bold text-sm md:rotate-[-90deg] whitespace-nowrap">
              E-TICKET
            </span>
          </div>
          <div className="flex flex-col justify-center items-center px-6 py-8">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-48 h-64 object-cover rounded-lg"
            />
          </div>
        </div>
        {/* Movie details */}
        <div className="flex-1 flex flex-col justify-center px-8 py-8">
          <h2 className="text-3xl font-extrabold text-[#232226] mb-1 leading-tight">
            {movie.title}
          </h2>
          <div className="text-gray-500 text-lg mb-6">
            {ticket.cinema_name} {ticket.location} -{" "}
            {ticket.studio_name?.toUpperCase()}
          </div>
          <div className="grid md:grid-cols-3 gap-y-2 items-start w-fit">
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1 text-left">
                Time
              </div>
              <div className="font-extrabold text-lg text-[#232226] text-left">
                {timeStr}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1 text-left">
                Date
              </div>
              <div className="font-extrabold text-lg text-[#232226] text-left">
                {dateStr}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1 text-left">
                Seating
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1 w-full">
                {ticket.seats.map((seat) => (
                  <span
                    key={seat}
                    className="bg-[#4A2075] text-white px-4 py-1 rounded-md font-semibold text-base text-left"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1 text-left">
                People
              </div>
              <div className="font-extrabold text-lg text-[#232226] text-left">
                {String(ticket.people).padStart(2, "0")}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1 text-left">
                Price
              </div>
              <div className="font-extrabold text-lg text-[#232226] text-left">
                {priceStr}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTicket;
