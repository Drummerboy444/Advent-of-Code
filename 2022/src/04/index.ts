import { range } from "../utils/arrays";
import { readLines } from "../utils/file-reading";

type RangePair = [number[], number[]];

const parseToRange = (rawRange: string) => {
  const split = rawRange.split("-");
  return range(Number(split[0]), Number(split[1]));
};

const parseToRangePair = (line: string): RangePair => {
  const split = line.split(",");
  return [parseToRange(split[0]), parseToRange(split[1])];
};

const isOneRangeFullyContainedInOther = ([first, second]: RangePair) =>
  first.every((n) => second.includes(n)) ||
  second.every((n) => first.includes(n));

const doRangesOverlap = ([first, second]: RangePair) =>
  first.some((n) => second.includes(n));

const lines = readLines("src/04/input.txt");
const rangePairs = lines.map(parseToRangePair);

export const part1 = rangePairs.filter(isOneRangeFullyContainedInOther).length;
console.log("Part 1:", part1);

export const part2 = rangePairs.filter(doRangesOverlap).length;
console.log("Part 2:", part2);
