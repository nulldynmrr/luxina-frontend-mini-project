"use client";

import CardDetailOrder from "@/components/CardDetailOrder/page";
import CardOrder from "@/components/CardOrder/page";
import CardSeats from "@/components/CardSeats/page";
import { useState, useEffect } from "react";
import { getDates } from "@/lib/dateUtils";
import { useRouter, useSearchParams } from "next/navigation";
import { getGenreMap, getMovieDetail } from "@/lib/api";
import { FaPlay, FaHeart, FaStar } from "react-icons/fa";
import supabase from "@/config/supabaseClient";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal/page";
import {
  calculatePrice,
  getUniqueCinemas,
  formatPrice,
  getSeatsArr,
} from "@/lib/orderUtils";

const dateList = getDates();

const Order = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [orderInfo, setOrderInfo] = useState({
    date: null,
    time: null,
    location: "CGV Ciwalk",
    people: 1,
  });
  const [activeDate, setActiveDate] = useState(null);
  const [activeTime, setActiveTime] = useState(null);
  const [activeLocation, setActiveLocation] = useState("CGV");
  const [activePeople, setActivePeople] = useState(1);
  const [movie, setMovie] = useState(null);
  const [genreMap, setGenreMap] = useState({});
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  const searchParams = useSearchParams();
  const movieId = searchParams.get("movieId");
  const router = useRouter();

  useEffect(() => {
    const fetchMovie = async () => {
      if (movieId) {
        const data = await getMovieDetail(movieId);
        setMovie(data);
      }
    };
    const fetchGenres = async () => {
      const map = await getGenreMap();
      setGenreMap(map);
    };
    const fetchCinemas = async () => {
      const { data, error } = await supabase.from("cinemas").select("*");
      if (error) {
        toast.error("Gagal mengambil data cinema");
        return;
      }
      setCinemas(data);
      if (data && data.length > 0) setSelectedCinema(data[0]);
    };
    fetchMovie();
    fetchGenres();
    fetchCinemas();
  }, [movieId]);

  const toggleSeat = (seatId) => {
    if (selectedCinema?.booked_seats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else if (selectedSeats.length < orderInfo.people) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const onChange = (key, value) => {
    setOrderInfo((prev) => ({ ...prev, [key]: value }));
  };

  const onDateClick = (date) => {
    setActiveDate(date);
    onChange("date", date);
  };

  const onTimeClick = (time) => {
    setActiveTime(time);
    onChange("time", time);
  };

  const onPeopleChange = (e) => {
    setActivePeople(Number(e.target.value));
    onChange("people", Number(e.target.value));
    setSelectedSeats([]);
  };

  const buttonOrder = async () => {
    // get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error("Anda harus login untuk memesan tiket.");
      return;
    }
    if (
      !selectedCinema ||
      !movie ||
      !activeDate ||
      !activeTime ||
      selectedSeats.length === 0
    ) {
      toast.error("Lengkapi semua data pemesanan.");
      return;
    }
    // format tanggal dan waktu
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(activeDate.day).padStart(2, "0");
    const show_date = `${year}-${month}-${day}`;
    const show_time = `${activeTime.hour.padStart(2, "0")}:00:00`;

    // Cek duplikat pesanan
    const { data: existing } = await supabase
      .from("ticket_orders")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movie.id)
      .maybeSingle();
    if (existing) {
      setPendingOrder({
        user,
        movie,
        show_date,
        show_time,
        selectedCinema,
        activePeople,
        selectedSeats,
        price,
      });
      setShowModal(true);
      return;
    }
    // insert ke ticket_orders
    const { data, error } = await supabase
      .from("ticket_orders")
      .insert({
        user_id: user.id,
        movie_id: movie.id,
        movie_title: movie.title,
        show_date,
        show_time,
        cinema_id: selectedCinema.id,
        people: activePeople,
        seats: selectedSeats,
        total_price: price,
        cinema_name: selectedCinema.name,
        studio_name: selectedCinema.studio_name,
        location: selectedCinema.location,
        status: "ACTIVE",
      })
      .select()
      .single();
    if (error) {
      toast.error("Gagal membuat pesanan tiket: " + error.message);
      console.error(error);
      return;
    }
    if (data && data.id) {
      // Update booked_seats di cinemas
      const currentBooked = selectedCinema.booked_seats || [];
      // Gabungkan current booked dan booked seats
      const updatedBooked = Array.from(
        new Set([...currentBooked, ...selectedSeats])
      );
      await supabase
        .from("cinemas")
        .update({ booked_seats: updatedBooked })
        .eq("id", selectedCinema.id);
      router.push(`/my-ticket/${data.id}`);
    }
  };

  const onConfirmOrder = async () => {
    if (!pendingOrder) return;
    const {
      user,
      movie,
      show_date,
      show_time,
      selectedCinema,
      activePeople,
      selectedSeats,
      price,
    } = pendingOrder;
    const { data, error } = await supabase
      .from("ticket_orders")
      .insert({
        user_id: user.id,
        movie_id: movie.id,
        movie_title: movie.title,
        show_date,
        show_time,
        cinema_id: selectedCinema.id,
        people: activePeople,
        seats: selectedSeats,
        total_price: price,
        cinema_name: selectedCinema.name,
        studio_name: selectedCinema.studio_name,
        location: selectedCinema.location,
        status: "ACTIVE",
      })
      .select()
      .single();
    setShowModal(false);
    setPendingOrder(null);
    if (error) {
      toast.error("Gagal membuat pesanan tiket: " + error.message);
      return;
    }
    if (data && data.id) {
      router.push(`/my-ticket/${data.id}`);
    }
  };

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

    // insert ke tabel watchlist
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

  // hitung harga
  const price = calculatePrice(selectedSeats, activeDate);
  const priceStr = formatPrice(price);
  // format tanggal
  const dateStr = activeDate ? `${activeDate.day} ${activeDate.label}` : "-";
  // format waktu
  const timeStr = activeTime ? `${activeTime.hour} ${activeTime.period}` : "-";
  // format lokasi
  const locationStr = activeLocation || "-";
  // format jumlah orang
  const peopleStr = activePeople || "-";
  // format jumlah kursi
  const seatsArr = getSeatsArr(selectedSeats);

  const seatRows = selectedCinema?.seat_rows || [];
  const seatNumbers = selectedCinema?.seat_numbers || [];
  const excludedSeats = selectedCinema?.excluded_seats || [];
  const bookedSeats = selectedCinema?.booked_seats || [];

  // get cinema berdasar nama, lokasi, dan studio
  const uniqueCinemas = getUniqueCinemas(cinemas);

  return (
    <div className="min-h-screen w-full">
      <div className="w-full space-y-4">
        {movie && (
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center mb-4 md:mb-6 min-h-[16rem] md:min-h-[20rem]">
            <img
              src={process.env.NEXT_PUBLIC_BASEIMGURL + movie.poster_path}
              alt={movie.title}
              className="w-40 h-56 md:w-56 md:h-80 object-cover rounded-xl"
            />
            <div className="flex-1 flex flex-col justify-center h-full px-4 md:px-0">
              <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                {movie.title}
              </h2>
              <div className="flex gap-1 md:gap-2 mb-2 flex-wrap">
                {movie.genres && movie.genres.length > 0
                  ? movie.genres.map((g) => (
                      <span
                        key={g.id}
                        className="bg-[#2C2C2C] px-2 md:px-3 py-1 rounded-full text-xs text-gray-300"
                      >
                        {g.name}
                      </span>
                    ))
                  : movie.genre_ids &&
                    movie.genre_ids.map((g) => (
                      <span
                        key={g}
                        className="bg-[#2C2C2C] px-2 md:px-3 py-1 rounded-full text-xs text-gray-300"
                      >
                        {genreMap[g] || g}
                      </span>
                    ))}
              </div>
              <p className="text-gray-300 mb-2 max-w-2xl text-sm md:text-base line-clamp-3 md:line-clamp-none">
                {movie.overview}
              </p>
              <div className="flex gap-2 md:gap-4 text-xs md:text-sm text-gray-400 items-center mb-4 md:mb-6 flex-wrap">
                <span>{movie.original_language?.toUpperCase()}</span>
                <span className="text-[#D5AE00] flex items-center gap-1">
                  <FaStar size={16} color="#D5AE00" />
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span>{movie.release_date?.slice(0, 4)}</span>
                <span>{movie.adult ? "18+" : "All ages"}</span>
                <span>{movie.runtime ? `${movie.runtime} min` : ""}</span>
              </div>
              <div className="flex gap-2 md:gap-4 mt-2 flex-col sm:flex-row">
                <button
                  className="flex items-center justify-center gap-2 bg-[#F3F3F3] text-[#232226] font-semibold px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base"
                  onClick={() => {
                    window.location.href = `/trailer?id=${movie.id}`;
                  }}
                >
                  <FaPlay size={18} color="#4A2075" />
                  Watch Trailer
                </button>
                <button
                  className="flex items-center justify-center gap-2 border border-[#F3F3F3] text-[#F3F3F3] font-semibold px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base"
                  onClick={buttonWishlist}
                >
                  <FaHeart size={18} color="#F3F3F3" />
                  Add My Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
        <p className="my-2 px-4 md:px-0">Order</p>
        <CardOrder
          key={selectedCinema?.id}
          date={dateList}
          time={selectedCinema?.time_list || []}
          cinemas={uniqueCinemas}
          selectedCinema={selectedCinema}
          activeDate={activeDate}
          activeTime={activeTime}
          activePeople={activePeople}
          onDateClick={onDateClick}
          onTimeClick={onTimeClick}
          onCinemaChange={(cinema) => {
            setSelectedCinema(cinema);
            setSelectedSeats([]);
            setActiveTime(null);
          }}
          onPeopleChange={onPeopleChange}
        />

        <div className="flex flex-col lg:flex-row gap-4 mb-8 px-4 md:px-0">
          <div className="w-full lg:w-4/6 flex flex-col items-center bg-[#1C1C1C] rounded-2xl p-4 md:p-6">
            <h3 className="text-sm mb-4 text-gray-400">Seating</h3>
            <div className="mb-4 md:mb-6 w-full overflow-x-auto">
              <div className="min-w-[320px] md:min-w-0">
                <CardSeats
                  seatRows={seatRows}
                  seatNumbers={seatNumbers}
                  excludedSeats={excludedSeats}
                  bookedSeats={bookedSeats}
                  selectedSeats={selectedSeats}
                  onSeatClick={toggleSeat}
                />
              </div>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full mb-2" />
            <span className="text-xs text-gray-400 mb-4">screen</span>
            <div className="flex justify-center w-full">
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 bg-[#232226] rounded-full px-4 md:px-8 py-2 text-xs md:text-base">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-[#232226]" />
                  <span className="text-gray-300">available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-[#F3F3F3]" />
                  <span className="text-gray-300">unavailable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-[#4A2075]" />
                  <span className="text-gray-300">your choice</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-2/6 bg-[#1C1C1C] rounded-2xl p-4 md:p-6">
            <div className="w-full">
              <CardDetailOrder
                date={dateStr}
                time={timeStr}
                people={peopleStr}
                price={priceStr}
                location={locationStr}
                selectedSeats={seatsArr}
                onOrder={buttonOrder}
              />
            </div>
          </div>
        </div>
        <Modal
          open={showModal}
          title="Konfirmasi Pesanan"
          message="Kamu sudah pernah memesan film ini. Apakah kamu ingin memesannya lagi?"
          onConfirm={onConfirmOrder}
          onCancel={() => {
            setShowModal(false);
            setPendingOrder(null);
          }}
          confirmText="Ya, pesan lagi"
          cancelText="Batal"
        />
      </div>
    </div>
  );
};

export default Order;
