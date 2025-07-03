"use client";

import React, { useEffect, useState } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

import supabase from "@/config/supabaseClient";

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fic",
  "TV Movie",
  "Thriller",
  "War",
  "Western",
];

const Navbar = () => {
  const [selectedGenre, setSelectedGenre] = useState("Genre");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);
  const [fetchUsers, setFetchUsers] = useState(null);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setDropdownOpen(false);
  };

  console.log(supabase);

  useEffect(() => {
    const fetchUsers = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(userError?.message);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id);

      if (error || !data || data.length == 0) {
        setError(error.message);
        setFetchUsers(null);
      } else {
        setFetchUsers(data[0]);
        setError(null);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <nav className="w-full flex items-center justify-between rounded-lg relative pt-4 mr-4 z-50 space-x-4">
      <div className="relative hidden md:inline">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center justify-between w-[150px] bg-[#2C2C2C] px-4 py-3 rounded-full text-[#797F82] text-sm cursor-pointer"
        >
          {selectedGenre}
          <FiChevronDown className="ml-2" size={14} />
        </button>
        {dropdownOpen && (
          <ul className="absolute mt-2 bg-[#2C2C2C] text-sm text-[#797F82] rounded-md shadow-lg max-h-60 overflow-y-auto w-40">
            {genres.map((genre) => (
              <li
                key={genre}
                onClick={() => handleGenreSelect(genre)}
                className="px-4 py-2 hover:bg-[#2B2B2B] cursor-pointer"
              >
                {genre}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative flex-1 w-full">
        <input
          type="text"
          placeholder="Search movies ..."
          className="w-full bg-[#2C2C2C] text-sm text-[#fefefe] placeholder-gray-400 px-4 py-3 pl-4 pr-10 rounded-full focus:outline-none"
        />
        <FiSearch
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={24}
        />
      </div>

      {error && (
        <div className="flex space-x-4">
          <Link href="/login">
            <button className="flex items-center py-3 rounded-full text-sm ml-4">
              Login
            </button>
          </Link>
          <Link href="/login">
            <button className="flex items-center bg-[#4A2075] px-4 py-3 pl-4 rounded-full text-[#F6FBFF] text-sm ml-4">
              Sign Up
            </button>
          </Link>
        </div>
      )}
      {fetchUsers && (
        <div className="flex items-center bg-[#2C2C2C] px-4 py-2 rounded-full text-[#F6FBFF] text-sm ml-4">
          <span className="mr-2 hidden md:inline">{fetchUsers.full_name}</span>
          <Image
            src="/img/Avatar.png"
            alt="User Avatar"
            width={30}
            height={30}
            className="rounded-full object-cover"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
