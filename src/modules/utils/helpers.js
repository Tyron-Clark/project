export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function calculateWinPercentage(wins, losses) {
  const total = wins + losses;
  if (total === 0) return "0%";
  return Math.round((wins / total) * 100) + "%";
}
