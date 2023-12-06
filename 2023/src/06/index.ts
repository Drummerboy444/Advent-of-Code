import {
  TEST_RACES_PART_1,
  RACES_PART_1,
  TEST_RACE_PART_2,
  RACE_PART_2,
} from "./input";
import { Race } from "./types";

const solvePart1 = (races: Race[]) =>
  races
    .map(getWinningButtonHoldDurations)
    .map(({ length }) => length)
    .reduce(multiply, 1);

const solvePart2 = (race: Race) => getWinningButtonHoldDurations(race).length;

const getWinningButtonHoldDurations = ({ duration, recordDistance }: Race) =>
  getArrayOfIntegers(1, duration - 1)
    .map(getDistance(duration))
    .filter(greaterThan(recordDistance));

const getArrayOfIntegers = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }).map((_, i) => i + start);

const getDistance = (raceDuration: number) => (buttonHoldDuration: number) =>
  buttonHoldDuration * (raceDuration - buttonHoldDuration);

const greaterThan = (b: number) => (a: number) => a > b;

const multiply = (a: number, b: number) => a * b;

console.log("Part 1 (test):", solvePart1(TEST_RACES_PART_1));
console.log("Part 1:", solvePart1(RACES_PART_1));

console.log("Part 2 (test):", solvePart2(TEST_RACE_PART_2));
console.log("Part 2:", solvePart2(RACE_PART_2));
