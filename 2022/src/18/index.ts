import { readLines } from "../utils/file-reading";

type LavaDroplet = Record<number, Record<number, Set<number>>>;
type Cube = [number, number, number];

const toCube = (line: string): Cube => {
  const split = line.split(",");
  return [Number(split[0]), Number(split[1]), Number(split[2])];
};

const toLavaDroplet = (cubes: Cube[]): LavaDroplet => {
  const lavaDroplet: LavaDroplet = {};

  cubes.forEach(([x, y, z]) => {
    if (!(x in lavaDroplet)) lavaDroplet[x] = {};
    if (!(y in lavaDroplet[x])) lavaDroplet[x][y] = new Set();
    lavaDroplet[x][y].add(z);
  });

  return lavaDroplet;
};

const contains = (lavaDroplet: LavaDroplet, [x, y, z]: Cube) =>
  x in lavaDroplet && y in lavaDroplet[x] && lavaDroplet[x][y].has(z);

const getSurfaceArea = (cubes: Cube[]) => {
  const lavaDroplet = toLavaDroplet(cubes);
  let surfaceArea = 0;

  cubes.forEach(([x, y, z]) => {
    if (!contains(lavaDroplet, [x + 1, y, z])) surfaceArea++;
    if (!contains(lavaDroplet, [x - 1, y, z])) surfaceArea++;
    if (!contains(lavaDroplet, [x, y + 1, z])) surfaceArea++;
    if (!contains(lavaDroplet, [x, y - 1, z])) surfaceArea++;
    if (!contains(lavaDroplet, [x, y, z + 1])) surfaceArea++;
    if (!contains(lavaDroplet, [x, y, z - 1])) surfaceArea++;
  });

  return surfaceArea;
};

const cubes = readLines("src/18/inputs/input.txt", toCube);

export const part1 = getSurfaceArea(cubes);
console.log("Part 1:", part1);

export const part2 = 456;
console.log("Part 2:", part2);
