export function calculatePrice(selectedSeats, activeDate) {
  if (!activeDate || selectedSeats.length === 0) return 0;
  const isWeekend = activeDate.label === "SUN" || activeDate.label === "SAT";
  return selectedSeats.length * (isWeekend ? 50000 : 30000);
}

export function getUniqueCinemas(cinemas) {
  return cinemas.filter(
    (cinema, idx, arr) =>
      arr.findIndex(
        (c) =>
          c.name === cinema.name &&
          c.location === cinema.location &&
          c.studio_name === cinema.studio_name
      ) === idx
  );
}

export function formatPrice(price) {
  return price > 0 ? `Rp.${price.toLocaleString("id-ID")}` : "-";
}

export function getSeatsArr(selectedSeats) {
  return selectedSeats.length > 0 ? selectedSeats : ["-"];
}
