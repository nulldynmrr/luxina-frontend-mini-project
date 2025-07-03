import axios from "axios";

const BASEURL = process.env.NEXT_PUBLIC_BASEURL;
const APIKEY = process.env.NEXT_PUBLIC_APIKEY;

export const getMovieList = async () => {
  try {
    const response = await axios.get(
      `${BASEURL}/movie/popular?api_key=${APIKEY}`
    );
    console.log("response axios:", response);
    return response.data.results;
  } catch (error) {
    console.error("Gagal fetch movie list:", error);
    return [];
  }
};
