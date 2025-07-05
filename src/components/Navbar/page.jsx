"use client";

import React, { useEffect, useState, useRef } from "react";
import { FiSearch, FiChevronDown, FiLogOut } from "react-icons/fi";
import { MdOutlinePerson } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/Context";
import useClickOutside from "@/lib/useClickOutside";

import supabase from "@/config/supabaseClient";

export const countryList = [
  { label: "All", code: null },
  { label: "American", code: "US" },
  { label: "China", code: "CN" },
  { label: "English", code: "GB" },
  { label: "Indonesian", code: "ID" },
  { label: "Japan", code: "JP" },
  { label: "Korean", code: "KR" },
];

const Navbar = () => {
  const { setSearch, country, setCountry } = useSearch();
  const [searchInput, setSearchInput] = useState("");
  const [countryDropDown, setCountryDropDown] = useState(false);
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);
  const [fetchUsers, setFetchUsers] = useState(null);

  const router = useRouter();

  // refs untuk dropdown
  const countryRef = useRef(null);
  const profileRef = useRef(null);

  useClickOutside(countryRef, () => setCountryDropDown(false), countryDropDown);
  useClickOutside(profileRef, () => setProfileDropDown(false), profileDropDown);

  const buttonCountry = (selectedCountry) => {
    setCountry(selectedCountry);
    setCountryDropDown(false);
    router.push("/dashboard");
  };

  const buttonProfile = () => {
    setProfileDropDown((prev) => !prev);
  };

  const buttonSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim().length > 0) {
      setSearch(searchInput);
      router.push("/dashboard");
    } else {
      setSearch("");
    }
  };

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed : ", error.message);
    } else {
      window.location.href = "/dashboard";
    }
    return console.log("keluar");
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
    <nav className="w-full flex items-center justify-between rounded-lg relative pt-4 mr-4 z-50">
      <div className="relative hidden md:inline mr-4" ref={countryRef}>
        <button
          onClick={() => setCountryDropDown(!countryDropDown)}
          className="flex items-center justify-between w-[150px] bg-[#2C2C2C] px-4 py-3 rounded-full text-[#797F82] text-sm cursor-pointer"
        >
          {country ? country.label : "Country"}
          <FiChevronDown className="ml-2" size={14} />
        </button>
        {countryDropDown && (
          <ul className="absolute mt-2 py-2 bg-[#2C2C2C] text-sm text-[#797F82] rounded-md shadow-lg max-h-64 overflow-y-auto w-40">
            {countryList
              .filter((c) => !country || c.code !== country.code)
              .map((c) => (
                <li
                  key={c.code === null ? "all" : c.code}
                  onClick={() => buttonCountry(c)}
                  className="mx-2 rounded-sm px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer"
                >
                  {c.label}
                </li>
              ))}
          </ul>
        )}
      </div>

      <form onSubmit={buttonSearch} className="flex-grow max-w-xl mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search movies ..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full text-sm bg-[#2C2C2C] text-[#fefefe] placeholder-gray-400 px-4 py-3 rounded-full focus:outline-none"
          />
          <FiSearch
            onClick={buttonSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            size={24}
          />
        </div>
      </form>

      {error && (
        <div className="flex space-x-4 items-center ml-4">
          <Link href="/login">
            <button className="py-3 px-4 rounded-full text-sm text-white hover:bg-[#3a3a3a]">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="flex items-center bg-[#4A2075] px-4 py-3 rounded-full text-[#F6FBFF] text-sm">
              Sign Up
            </button>
          </Link>
        </div>
      )}

      {fetchUsers && (
        <div className="relative ml-4" ref={profileRef}>
          <div
            onClick={buttonProfile}
            className="max-w-[12rem] flex items-center bg-[#2C2C2C] px-2 md:px-4 py-2 rounded-full text-[#F6FBFF] text-sm cursor-pointer"
          >
            <span className="mr-2 hidden md:inline text-right w-full truncate">
              {fetchUsers.full_name.split(" ").slice(0, 2).join(" ")}
            </span>
            <Image
              src="/img/Avatar.png"
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </div>

          {profileDropDown && (
            <div className="flex flex-col min-w-[12rem] absolute bg-[#2C2C2C] right-0 top-[100%] mt-2 rounded-lg">
              <button
                onClick={() => router.push("/profile")}
                className="w-[96%] py-2 hover:bg-[#353535] m-1 text-sm rounded-md shadow-sm"
              >
                <MdOutlinePerson className="inline mr-2" />
                Edit Profile
              </button>
              <button
                onClick={logOut}
                className="w-[96%] py-2 hover:bg-[#752022] m-1 text-sm rounded-md shadow-sm"
              >
                <FiLogOut className="inline mr-2" />
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
