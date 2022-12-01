export const sortNumbers = (numbers: number[], direction: "asc" | "desc") =>
  numbers.sort((a, b) => (direction === "asc" ? a - b : b - a));
