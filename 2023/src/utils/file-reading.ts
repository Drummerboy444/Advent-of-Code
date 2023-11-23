import { readFileSync } from "fs";

export const readFile = (fileName: string) => readFileSync(fileName, "utf-8");

type ReadLines = {
  (fileName: string): string[];
  <T>(fileName: string, mapper: (line: string) => T): T[];
};

export const readLines: ReadLines = <T>(
  fileName: string,
  mapper?: (line: string) => T
) => {
  const lines = readFile(fileName).split("\n");
  return mapper ? lines.map(mapper) : lines;
};
