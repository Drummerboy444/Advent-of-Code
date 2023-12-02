import { readLines } from "../utils/file-reading";
import { ParsedLine, ParsedResult, parseLine } from "./parsing";

const lines = readLines("src/02/inputs/input.txt");

const CUBE_LIMITS = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

const isPossibleResult = (result: ParsedResult) => {
  return (
    result.red <= CUBE_LIMITS.red &&
    result.green <= CUBE_LIMITS.green &&
    result.blue <= CUBE_LIMITS.blue
  );
};

const isPossibleLine = (line: ParsedLine) => {
  return line.results.every(isPossibleResult);
};

const parsedLines = lines.map(parseLine);

const possibleLines = parsedLines.filter(isPossibleLine);

const part1 = possibleLines.map(({ id }) => id).reduce((a, b) => a + b, 0);

console.log("Part 1:", part1);

const getMinimalCubes = (line: ParsedLine) => {
  const minimalCubes = {
    red: 0,
    green: 0,
    blue: 0,
  };

  line.results.forEach(({ red, green, blue }) => {
    if (red > minimalCubes.red) minimalCubes.red = red;
    if (green > minimalCubes.green) minimalCubes.green = green;
    if (blue > minimalCubes.blue) minimalCubes.blue = blue;
  });

  return minimalCubes;
};

const getPower = (cubes: { red: number; green: number; blue: number }) => {
  return cubes.red * cubes.green * cubes.blue;
};

const part2 = parsedLines
  .map(getMinimalCubes)
  .map(getPower)
  .reduce((a, b) => a + b, 0);

console.log("Part 2:", part2);
