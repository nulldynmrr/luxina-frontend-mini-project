"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/config/supabaseClient";
import { getPosterUrlByTitle } from "@/lib/api";
import { toast } from "react-hot-toast";
import { FaTicketAlt } from "react-icons/fa";

const MyTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [posterUrls, setPosterUrls] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Anda belum login");
        return;
      }

      const { data: ticket, error: Error } = await supabase
        .from("ticket_orders")
        .select("*")
        .eq("user_id", user.id);

      if (ticket) {
        setTickets(ticket);
        setIsLoading(false);
        return;
      }
    };
    fetchTicket();
  }, [tickets]);

  useEffect(() => {
    const fetchPosters = async () => {
      const updates = {};
      for (const ticket of tickets) {
        if (
          !ticket.poster_url &&
          ticket.movie_title &&
          !posterUrls[ticket.id]
        ) {
          const url = await getPosterUrlByTitle(ticket.movie_title);
          if (url) updates[ticket.id] = url;
        }
      }
      if (Object.keys(updates).length > 0) {
        setPosterUrls((prev) => ({ ...prev, ...updates }));
      }
    };
    if (tickets.length > 0) fetchPosters();
  }, [tickets]);

  if (!tickets || tickets.length === 0)
    return (
      <div>
        <div className="w-full flex items-center mb-8 print-hide">
          <FaTicketAlt className="text-white text-2xl mr-2" />
          <span className="text-white text-lg font-semibold">My Ticket</span>
        </div>
        <div className="flex flex-col justify-center items-center pt-12">
          <img src="/img/not found ticket.svg" alt="Ticket not found" />
          <p className="text-4xl text-bold mt-8 text-[#3d3d3d]">
            Tiket tidak ditemukan
          </p>
        </div>
      </div>
    );

  return (
    <div>
      <div className="w-full flex items-center mb-8 print-hide">
        <FaTicketAlt className="text-white text-2xl mr-2" />
        <span className="text-white text-lg font-semibold">My Ticket</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-[#232323] rounded-xl flex flex-col md:flex-row p-6 mb-6 items-start"
          >
            <img
              src={posterUrls[ticket.id] || "/img/cover-film.png"}
              alt={ticket.movie_title}
              className="w-40 h-56 object-cover rounded-lg mr-8 border-2 border-[#232226]"
            />
            <div className="mt-4 md:mt-0 flex-1 flex flex-col justify-between h-full">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 md:mb-2 leading-tight">
                {ticket.movie_title}
              </h2>

              {ticket.status === "ACTIVE" ? (
                <button
                  className="bg-[#6C2EB5] text-white font-bold py-3 rounded-lg text-lg mt-2 hover:bg-[#4A2075] transition-colors px-8 w-auto w-full md:max-w-[300px]"
                  onClick={() =>
                    (window.location.href = `/my-ticket/${ticket.id}`)
                  }
                >
                  LIHAT TICKET
                </button>
              ) : (
                <button
                  className="bg-[#1B0F2B] text-white font-bold py-2 rounded-lg text-lg mt-2 cursor-not-allowed opacity-80 px-8 w-auto w-full md:max-w-[300px]"
                  disabled
                >
                  WATCHED
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTicket;
