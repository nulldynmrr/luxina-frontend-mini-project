"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import supabase from "@/config/supabaseClient";
import { getMovieList } from "@/lib/api";

const formSchema = z.object({
  full_name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phone_number: z.string().min(8, "Nomor HP tidak valid"),
});

const BASEIMGURL = process.env.NEXT_PUBLIC_BASEIMGURL;

const Signup = () => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState({});
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const result = formSchema.safeParse(form); // validasi zod
    console.log("hasil", result);

    if (!result.success) {
      const errors = {};
      resulr.error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setErrors(erros);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { email, password, full_name, phone_number } = form;

      // daftar akun ke Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        toast.error("Gagal daftar: " + authError.message);
        return;
      }

      // save data ke tabel users
      const hashedPassword = await bcrypt.hash(password, 10);

      const { error: insertError } = await supabase.from("users").insert({
        id: authData.user.id,
        full_name,
        email,
        phone_number,
        password: hashedPassword,
      });

      if (insertError) {
        toast.error("Gagal menyimpan user: " + insertError.message);
      } else {
        toast.success("Pendaftaran berhasil!");
        router.push("/login");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan.");
    }
  };

  useEffect(() => {
    const fetchImageMovie = async () => {
      const movieData = await getMovieList();

      const filterMovie = movieData.filter((movie) => {
        const year = parseInt(movie.release_date?.slice(0, 4));
        console.log(movie.title, year, movie.original_language);
        return year >= 2024 && year <= 2025;
      });

      const randomMovie = filterMovie.sort(() => 0.5 - Math.random());
      const image = randomMovie.slice(0, 6);
      setMovies(image);
      setIsLoading(false);
    };
    fetchImageMovie();
  }, []);

  return (
    <div className="min-h-screen flex text-white">
      <div className="w-3/5 hidden lg:block relative my-8 mx-12">
        {movies.length > 0 && (
          <>
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              loop={true}
              className="h-full z-0"
            >
              {movies.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <div className="relative w-full h-full">
                    <Image
                      src={`${BASEIMGURL}${movie.backdrop_path}`}
                      alt={movie.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="absolute bottom-0 left-0 w-full h-[150px] text-center bg-gradient-to-t from-black to-transparent py-4 z-10 rounded-lg   ">
              <p className="text-white text-3xl font-semibold mb-12 pointer-events-none">
                Nikmati film terbaik untuk <br /> menemani waktu luangmu
              </p>
            </div>
          </>
        )}
      </div>

      <div className="w-full lg:w-2/5 flex flex-col justify-center px-4 md:mr-12">
        <div className="flex items-center mb-10">
          <Image
            src="/img/logo luxina.svg"
            alt="Luxina Logo"
            width={150}
            height={150}
          />
        </div>

        <h2 className="text-3xl font-semibold mb-2">Sign Up</h2>
        <p className="text-gray-400 mb-8">
          Nikmati kemudahan booking tiket kapan saja dan dimana saja.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 my-4">
          <input
            name="full_name"
            type="text"
            value={form.full_name}
            onChange={onChange}
            placeholder="Masukkan Nama Lengkap"
            className="w-full px-4 py-3 font-light bg-[#262132] text-white rounded-md outline-none placeholder-[#A9B2BC]"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="Masukkan Email"
            className="w-full px-4 py-3 font-light bg-[#262132] text-white rounded-md outline-none placeholder-[#A9B2BC]"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Masukkan Password"
            className="w-full px-4 py-3 font-light bg-[#262132] text-white rounded-md outline-none placeholder-[#A9B2BC]"
          />
          <input
            name="phone_number"
            type="phone"
            value={form.phone_number}
            onChange={onChange}
            placeholder="Masukkan nomor handphone"
            className="w-full px-4 py-3 font-light bg-[#262132] text-white rounded-md outline-none placeholder-[#A9B2BC]"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#4A2075] hover:bg-[#4a1784] transition-colors rounded-md text-white font-medium"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Anda sudah punya akun?{" "}
          <Link href="/login">
            <span className="text-purple-400 hover:underline cursor-pointer">
              Masuk
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
