import axios from "axios";

const BASEURL = process.env.NEXT_PUBLIC_BASEURL;
const APIKEY = process.env.NEXT_PUBLIC_APIKEY;

export const getMovieList = async () => {
  const response = await axios.get(
    `${BASEURL}/movie/popular?api_key=${APIKEY}`
  );
  return response.data.results;
};

export const searchMovie = async (q) => {
  const response = await axios.get(
    `${BASEURL}/search/movie?api_key=${APIKEY}&query=${q}`
  );
  return response.data.results;
};

export const getMovieById = async (movieId) => {
  const response = await axios.get(
    `${BASEURL}/movie/${movieId}?api_key=${APIKEY}`
  );
  return response.data;
};
export const getMoviesByGenre = async (genreId) => {
  const response = await axios.get(
    `${BASEURL}/discover/movie?api_key=${APIKEY}&with_genres=${genreId}`
  );
  console.log("response axios:", response);
  return response.data.results;
};

export const getMoviesByCountry = async (country) => {
  const response = await axios.get(
    `${BASEURL}/discover/movie?api_key=${APIKEY}&with_origin_country=${country}`
  );
  return response.data.results;
};

export const getGenreMap = async () => {
  const response = await axios.get(
    `${BASEURL}/genre/movie/list?api_key=${APIKEY}`
  );
  const genres = response.data.genres;
  const map = {};
  genres.forEach((g) => {
    map[g.id] = g.name;
  });
  return map;
};

export const getMovieDetail = async (id) => {
  const response = await axios.get(`${BASEURL}/movie/${id}?api_key=${APIKEY}`);
  return response.data;
};

export const getMovieVideos = async (id) => {
  const response = await axios.get(
    `${BASEURL}/movie/${id}/videos?api_key=${APIKEY}`
  );
  return response.data.results;
};

export const getMovieImages = async (id) => {
  const response = await axios.get(
    `${BASEURL}/movie/${id}/images?api_key=${APIKEY}`
  );
  return response.data.backdrops;
};

export const getMovieCredits = async (id) => {
  const response = await axios.get(
    `${BASEURL}/movie/${id}/credits?api_key=${APIKEY}`
  );
  return response.data;
};

export async function getPosterUrlByTitle(title) {
  const URL = `${BASEURL}/search/movie?api_key=${APIKEY}&query=${encodeURIComponent(
    title
  )}`;
  const response = await fetch(URL);
  const data = await response.json();
  if (data.results && data.results.length > 0 && data.results[0].poster_path) {
    return `${process.env.NEXT_PUBLIC_BASEIMGURL}${data.results[0].poster_path}`;
  }
  return null;
}
