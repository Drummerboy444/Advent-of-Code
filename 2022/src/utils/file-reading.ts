import { readFileSync } from "fs";

const formatDayAsFileName = (day: number) => day.toString().padStart(2, "0");

export const readFile = (day: number) =>
  readFileSync(`src/${formatDayAsFileName(day)}/input.txt`, "utf-8");

export const readLines: {
  (day: number): string[];
  <T>(day: number, mapper: (line: string) => T): T[];
} = <T>(day: number, mapper?: (line: string) => T) => {
  const lines = readFile(day).split("\r\n");
  return mapper ? lines.map(mapper) : lines;
};
