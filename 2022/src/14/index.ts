import { range } from "../utils/arrays";
import { Point } from "../utils/coordinate-system";
import { readLines } from "../utils/file-reading";
import * as C from "../utils/coordinate-system";

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

const getCave = (paths: Path[]): C.CoordinateSystem<"#"> => {
  const cave: C.CoordinateSystem<"#"> = {};

  paths.forEach((path) => {
    const points = getPoints(path);

    points.forEach(([x, y]) => {
      if (!C.contains(cave, x)) cave[x] = {};
      cave[x][y] = "#";
    });
  });

  return cave;
};

const dropGrainOfSand = <T>(
  coordinateSystem: C.CoordinateSystem<T>
): Point | "no-resting-point" => {
  let point: Point = [500, 0];

  const minX = C.minX(coordinateSystem);
  const maxX = C.maxX(coordinateSystem);
  const maxY = C.maxY(coordinateSystem);

  while (true) {
    const [x, y] = point;
    if (x < minX) return "no-resting-point";
    if (x > maxX) return "no-resting-point";
    if (y > maxY) return "no-resting-point";

    const below: Point = [x, y + 1];
    const belowLeft: Point = [x - 1, y + 1];
    const belowRight: Point = [x + 1, y + 1];

    const hasPointBelow = C.contains(coordinateSystem, below);
    const hasPointBelowLeft = C.contains(coordinateSystem, belowLeft);
    const hasPointBelowRight = C.contains(coordinateSystem, belowRight);

    if (hasPointBelow && hasPointBelowLeft && hasPointBelowRight) return point;
    else if (hasPointBelow && hasPointBelowLeft) point = belowRight;
    else if (hasPointBelow) point = belowLeft;
    else point = below;
  }
};

const dropGrainsOfSandUntilOverflowing = (
  cave: C.CoordinateSystem<"#">
): C.CoordinateSystem<"s"> => {
  let grainsOfSand: C.CoordinateSystem<"s"> = {};

  while (true) {
    const grainOfSand = dropGrainOfSand(C.add(cave, grainsOfSand));
    if (grainOfSand === "no-resting-point") break;
    grainsOfSand = C.add(grainsOfSand, [grainOfSand, "s"]);
  }

  return grainsOfSand;
};

const dropGrainsOfSandUntilBlocked = (
  cave: C.CoordinateSystem<"#">
): C.CoordinateSystem<"s"> => {
  let grainsOfSand: C.CoordinateSystem<"s"> = {};

  while (true) {
    const grainOfSand = dropGrainOfSand(C.add(cave, grainsOfSand));
    if (grainOfSand === "no-resting-point") break;
    grainsOfSand = C.add(grainsOfSand, [grainOfSand, "s"]);
    if (C.contains(grainsOfSand, [500, 0])) break;
  }

  return grainsOfSand;
};

const cave = getCave(paths);

const grainsOfSandBeforeOverflowing = dropGrainsOfSandUntilOverflowing(cave);

export const part1 = C.count(grainsOfSandBeforeOverflowing);
console.log("Part 1:", part1);

const maxY = C.maxY(cave);
const caveFloor = getCave([
  [
    [-1_000, maxY + 2],
    [1_000, maxY + 2],
  ],
]);
const caveWithFloor = C.add(cave, caveFloor);
const grainsOfSandWhenBlocked = dropGrainsOfSandUntilBlocked(caveWithFloor);

export const part2 = C.count(grainsOfSandWhenBlocked);
console.log("Part 2:", part2);
