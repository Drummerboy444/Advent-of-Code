import { sumArray } from "../utils/arrays";
import { readLines } from "../utils/file-reading";
import { sortNumbers } from "../utils/sorting";

type Coordinates3D = Record<number, Record<number, Set<number>>>;
type Cube = [number, number, number];

const toCube = (line: string): Cube => {
  const split = line.split(",");
  return [Number(split[0]), Number(split[1]), Number(split[2])];
};

const add = (coordinates3D: Coordinates3D, [x, y, z]: Cube) => {
  if (!(x in coordinates3D)) coordinates3D[x] = {};
  if (!(y in coordinates3D[x])) coordinates3D[x][y] = new Set();
  coordinates3D[x][y].add(z);
};

const toCoordinates3D = (cubes: Cube[]): Coordinates3D => {
  const coordinates3D: Coordinates3D = {};
  cubes.forEach((cube) => add(coordinates3D, cube));
  return coordinates3D;
};

const contains = (coordinates3D: Coordinates3D, [x, y, z]: Cube) =>
  x in coordinates3D && y in coordinates3D[x] && coordinates3D[x][y].has(z);

const forEach = (
  coordinates3D: Coordinates3D,
  callback: (cube: Cube) => void
) => {
  Object.entries(coordinates3D).forEach(([x, ys]) => {
    Object.entries(ys).forEach(([y, zs]) => {
      zs.forEach((z) => {
        callback([Number(x), Number(y), Number(z)]);
      });
    });
  });
};

const getTotalSurfaceArea = (coordinates3D: Coordinates3D) => {
  let surfaceArea = 0;

  forEach(coordinates3D, ([x, y, z]) => {
    if (!contains(coordinates3D, [x + 1, y, z])) surfaceArea++;
    if (!contains(coordinates3D, [x - 1, y, z])) surfaceArea++;
    if (!contains(coordinates3D, [x, y + 1, z])) surfaceArea++;
    if (!contains(coordinates3D, [x, y - 1, z])) surfaceArea++;
    if (!contains(coordinates3D, [x, y, z + 1])) surfaceArea++;
    if (!contains(coordinates3D, [x, y, z - 1])) surfaceArea++;
  });

  return surfaceArea;
};

const getMinX = (coordinates3D: Coordinates3D) =>
  sortNumbers(Object.keys(coordinates3D).map(Number), "asc")[0];

const getMaxX = (coordinates3D: Coordinates3D) =>
  sortNumbers(Object.keys(coordinates3D).map(Number), "desc")[0];

const getMinY = (coordinates3D: Coordinates3D) =>
  sortNumbers(
    Object.values(coordinates3D).flatMap((ys) => Object.keys(ys).map(Number)),
    "asc"
  )[0];

const getMaxY = (coordinates3D: Coordinates3D) =>
  sortNumbers(
    Object.values(coordinates3D).flatMap((ys) => Object.keys(ys).map(Number)),
    "desc"
  )[0];

const getMinZ = (coordinates3D: Coordinates3D) =>
  sortNumbers(
    Object.values(coordinates3D).flatMap((ys) =>
      Object.values(ys).flatMap((zs) => Array.from(zs))
    ),
    "asc"
  )[0];

const getMaxZ = (coordinates3D: Coordinates3D) =>
  sortNumbers(
    Object.values(coordinates3D).flatMap((ys) =>
      Object.values(ys).flatMap((zs) => Array.from(zs))
    ),
    "desc"
  )[0];

const tryGetAirPocket = (
  coordinates3D: Coordinates3D,
  cube: Cube
): Coordinates3D | null => {
  const airPocket: Coordinates3D = {
    [cube[0]]: {
      [cube[1]]: new Set([cube[2]]),
    },
  };
  let currentLayer: Coordinates3D = {
    [cube[0]]: {
      [cube[1]]: new Set([cube[2]]),
    },
  };

  const minX = getMinX(coordinates3D);
  const maxX = getMaxX(coordinates3D);
  const minY = getMinY(coordinates3D);
  const maxY = getMaxY(coordinates3D);
  const minZ = getMinZ(coordinates3D);
  const maxZ = getMaxZ(coordinates3D);

  while (true) {
    const nextLayer: Coordinates3D = {};

    forEach(currentLayer, ([x, y, z]) => {
      const potentialAirPockets: Cube[] = [
        [x + 1, y, z],
        [x - 1, y, z],
        [x, y + 1, z],
        [x, y - 1, z],
        [x, y, z + 1],
        [x, y, z - 1],
      ];

      potentialAirPockets.forEach((potentialAirPocket) => {
        if (
          !contains(coordinates3D, potentialAirPocket) &&
          !contains(airPocket, potentialAirPocket) &&
          !contains(nextLayer, potentialAirPocket)
        ) {
          add(airPocket, potentialAirPocket);
          add(nextLayer, potentialAirPocket);
        }
      });
    });

    currentLayer = nextLayer;

    let outsideBoundary = false;
    forEach(currentLayer, ([x, y, z]) => {
      if (x < minX || x > maxX || y < minY || y > maxY || z < minZ || z > maxZ)
        outsideBoundary = true;
    });
    if (outsideBoundary) return null;

    let currentLayerIsEmpty = true;
    forEach(currentLayer, () => (currentLayerIsEmpty = false));
    if (currentLayerIsEmpty) break;
  }

  return airPocket;
};

const getAirPockets = (coordinates3D: Coordinates3D) => {
  const airPockets: Coordinates3D[] = [];

  for (let x = getMinX(coordinates3D); x <= getMaxX(coordinates3D); x++) {
    for (let y = getMinY(coordinates3D); y <= getMaxY(coordinates3D); y++) {
      for (let z = getMinZ(coordinates3D); z <= getMaxZ(coordinates3D); z++) {
        const cube: Cube = [x, y, z];

        if (contains(coordinates3D, cube)) continue;
        if (airPockets.some((airPocket) => contains(airPocket, cube))) continue;

        const potentialAirPocket = tryGetAirPocket(coordinates3D, cube);
        if (potentialAirPocket !== null) airPockets.push(potentialAirPocket);
      }
    }
  }

  return airPockets;
};

const getExternalSurfaceArea = (coordinates3D: Coordinates3D) => {
  const totalSurfaceArea = getTotalSurfaceArea(coordinates3D);
  const airPockets = getAirPockets(coordinates3D);
  const airPocketSurfaceArea = sumArray(airPockets.map(getTotalSurfaceArea));
  return totalSurfaceArea - airPocketSurfaceArea;
};

const cubes = readLines("src/18/inputs/input.txt", toCube);
const lavaDroplet = toCoordinates3D(cubes);

export const part1 = getTotalSurfaceArea(lavaDroplet);
console.log("Part 1:", part1);

export const part2 = getExternalSurfaceArea(lavaDroplet);
console.log("Part 2:", part2);
