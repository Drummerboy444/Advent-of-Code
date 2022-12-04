import { readLines } from "../utils/file-reading";

const lines = readLines("src/04/input.txt");

const parseRange = (range: string) => {
  const split = range.split("-");

  const numbers: number[] = [];

  for (let i = Number(split[0]); i < Number(split[1]) + 1; i++) {
    numbers.push(i);
  }

  return numbers;
};

const parseToRangePairs = (line: string) => {
  const split = line.split(",");
  return [parseRange(split[0]), parseRange(split[1])];
};

const doesRangeFullyContainOther = (range: number[][]) => {
  const range1 = range[0];
  const range2 = range[1];

  if (range1.every((n) => range2.includes(n))) {
    return true;
  }

  if (range2.every((n) => range1.includes(n))) {
    return true;
  }

  return false;
};

const doRangesOverlap = (range: number[][]) => {
  const range1 = range[0];
  const range2 = range[1];

  for (const n of range1) {
    if (range2.includes(n)) {
      return true;
    }
  }

  return false;
};

const rangePairs = lines.map(parseToRangePairs);

const fullyOverlappingRangePairs = rangePairs.filter(
  doesRangeFullyContainOther
);
export const part1 = fullyOverlappingRangePairs.length;
console.log("Part 1:", part1);

const partiallyOverlappingRangePairs = rangePairs.filter(doRangesOverlap);
export const part2 = partiallyOverlappingRangePairs.length;
console.log("Part 2:", part2);
