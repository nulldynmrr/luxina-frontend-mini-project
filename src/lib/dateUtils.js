export function getDates(now = new Date()) {
  const start = new Date(now);
  if (now.getHours() >= 20) {
    start.setDate(start.getDate() + 1);
  }
  start.setHours(0, 0, 0, 0);

  const days = [];
  const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  for (let i = 0; i < 4; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      day: d.getDate(),
      label: dayLabels[d.getDay()],
      dateObj: d,
    });
  }
  return days;
}
