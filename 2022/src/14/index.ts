import { range, sumArray } from "../utils/arrays";
import { readLines } from "../utils/file-reading";
import { sortNumbers } from "../utils/sorting";

type CoordinateSystem = Record<number, Set<number>>;
type Point = [number, number];
type Path = Point[];

const paths: Path[] = readLines("src/14/inputs/input.txt", (line) =>
  line
    .split(" -> ")
    .map((coordinate) => coordinate.split(",").map(Number) as Point)
);

const getPoints = (path: Path): Set<Point> => {
  const points = new Set<Point>();

  for (let i = 0; i < path.length - 1; i++) {
    const [x1, y1] = path[i];
    const [x2, y2] = path[i + 1];

    if (x1 === x2) {
      range(y1 < y2 ? y1 : y2, y1 < y2 ? y2 : y1)
        .map((y) => [x1, y] as Point)
        .forEach((point) => points.add(point));
    } else {
      range(x1 < x2 ? x1 : x2, x1 < x2 ? x2 : x1)
        .map((x) => [x, y1] as Point)
        .forEach((point) => points.add(point));
    }
  }

  return points;
};

const getCave = (paths: Path[]): CoordinateSystem => {
  const cave: CoordinateSystem = {};

  paths.forEach((path) => {
    const points = getPoints(path);

    points.forEach(([x, y]) => {
      if (!(x in cave)) cave[x] = new Set();
      cave[x].add(y);
    });
  });

  return cave;
};

const renderCave = (
  cave: CoordinateSystem,
  grainsOfSand: CoordinateSystem,
  x1: number,
  x2: number,
  y1: number,
  y2: number
) => {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      const containsGrainOfSand = x in grainsOfSand && grainsOfSand[x].has(y);
      const containsCaveWall = x in cave && cave[x].has(y);

      if (containsGrainOfSand && containsCaveWall) {
        throw new Error(
          `Coordinate contained both a grain of sand and a wall: (${x}, ${y})`
        );
      }

      if (containsGrainOfSand) {
        process.stdout.write("s");
      } else if (containsCaveWall) {
        process.stdout.write("█");
      } else {
        process.stdout.write(".");
      }
    }
    process.stdout.write("\n");
  }
};

const getMinX = (c: CoordinateSystem) =>
  sortNumbers(Object.keys(c).map(Number), "asc")[0];

const getMaxX = (c: CoordinateSystem) =>
  sortNumbers(Object.keys(c).map(Number), "desc")[0];

const getMaxY = (c: CoordinateSystem) =>
  sortNumbers(
    Object.values(c).flatMap((ys) => Array.from(ys)),
    "desc"
  )[0];

const forEachPoint = (
  c: CoordinateSystem,
  callback: (point: Point) => void
) => {
  Object.entries(c)
    .map(([x, ys]) => [Number(x), ys] as const)
    .forEach(([x, ys]) => {
      ys.forEach((y) => callback([x, y]));
    });
};

const copyCoordinateSystem = (c: CoordinateSystem) => {
  const copy: CoordinateSystem = {};
  forEachPoint(c, ([x, y]) => {
    if (!(x in copy)) copy[x] = new Set();
    copy[x].add(y);
  });
  return copy;
};

const mergeCoordinateSystems = (c1: CoordinateSystem, c2: CoordinateSystem) => {
  const c: CoordinateSystem = copyCoordinateSystem(c1);
  forEachPoint(c2, ([x, y]) => {
    if (!(x in c)) c[x] = new Set();
    c[x].add(y);
  });
  return c;
};

const addPoint = (c: CoordinateSystem, [x, y]: Point) => {
  const copy = copyCoordinateSystem(c);
  if (!(x in copy)) copy[x] = new Set();
  copy[x].add(y);
  return copy;
};

const containsPoint = (c: CoordinateSystem, [x, y]: Point) =>
  x in c && c[x].has(y);

const countCoordinateSystem = (c: CoordinateSystem) =>
  sumArray(Object.values(c).map((ys) => ys.size));

const dropGrainOfSand = (
  coordinateSystem: CoordinateSystem
): Point | "no-resting-point" => {
  let point: Point = [500, 0];

  const minX = getMinX(coordinateSystem);
  const maxX = getMaxX(coordinateSystem);
  const maxY = getMaxY(coordinateSystem);

  while (true) {
    const [x, y] = point;
    if (x < minX) return "no-resting-point";
    if (x > maxX) return "no-resting-point";
    if (y > maxY) return "no-resting-point";

    const below: Point = [x, y + 1];
    const belowLeft: Point = [x - 1, y + 1];
    const belowRight: Point = [x + 1, y + 1];

    const hasPointBelow = containsPoint(coordinateSystem, below);
    const hasPointBelowLeft = containsPoint(coordinateSystem, belowLeft);
    const hasPointBelowRight = containsPoint(coordinateSystem, belowRight);

    if (hasPointBelow && hasPointBelowLeft && hasPointBelowRight) return point;
    else if (hasPointBelow && hasPointBelowLeft) point = belowRight;
    else if (hasPointBelow) point = belowLeft;
    else point = below;
  }
};

const dropGrainsOfSandUntilOverflowing = (
  cave: CoordinateSystem
): CoordinateSystem => {
  let grainsOfSand: CoordinateSystem = {};

  while (true) {
    const grainOfSand = dropGrainOfSand(
      mergeCoordinateSystems(cave, grainsOfSand)
    );
    if (grainOfSand === "no-resting-point") break;
    grainsOfSand = addPoint(grainsOfSand, grainOfSand);
  }

  return grainsOfSand;
};

const dropGrainsOfSandUntilBlocked = (
  cave: CoordinateSystem
): CoordinateSystem => {
  let grainsOfSand: CoordinateSystem = {};

  while (true) {
    const grainOfSand = dropGrainOfSand(
      mergeCoordinateSystems(cave, grainsOfSand)
    );
    if (grainOfSand === "no-resting-point") break;
    grainsOfSand = addPoint(grainsOfSand, grainOfSand);
    if (containsPoint(grainsOfSand, [500, 0])) break;
  }

  return grainsOfSand;
};

const cave = getCave(paths);

const grainsOfSandBeforeOverflowing = dropGrainsOfSandUntilOverflowing(cave);

export const part1 = countCoordinateSystem(grainsOfSandBeforeOverflowing);
console.log("Part 1:", part1);

const maxY = getMaxY(cave);
const caveFloor = getCave([
  [
    [-1_000, maxY + 2],
    [1_000, maxY + 2],
  ],
]);
const caveWithFloor = mergeCoordinateSystems(cave, caveFloor);
const grainsOfSandWhenBlocked = dropGrainsOfSandUntilBlocked(caveWithFloor);

export const part2 = countCoordinateSystem(grainsOfSandWhenBlocked);
console.log("Part 2:", part2);
