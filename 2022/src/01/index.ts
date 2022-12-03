import { sumArray } from "../utils/arrays";
import { readLines } from "../utils/file-reading";
import { sortNumbers } from "../utils/sorting";

const chunkLines = (lines: string[]) => {
  const elves: number[][] = [[]];

  for (const line of lines) {
    if (line === "") {
      elves.push([]);
    } else {
      elves[elves.length - 1].push(Number(line));
    }
  }

  return elves;
};

const lines = readLines("src/01/input.txt");
const elves = chunkLines(lines);
const caloryTotals = elves.map(sumArray);
const sortedCaloryTotals = sortNumbers(caloryTotals, "desc");

const first = sortedCaloryTotals[0];
const second = sortedCaloryTotals[1];
const third = sortedCaloryTotals[2];

console.log("Part 1:", first);
console.log("Part 2:", first + second + third);
