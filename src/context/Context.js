import { createContext, useContext, useState } from "react";

const Context = createContext();

export function SearchProvider({ children }) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  return (
    <Context.Provider value={{ search, setSearch, country, setCountry }}>
      {children}
    </Context.Provider>
  );
}

export function useSearch() {
  return useContext(Context);
}
