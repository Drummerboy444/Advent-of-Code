import { Point } from "../utils/coordinate-system";
import { readLines } from "../utils/file-reading";
import * as C from "../utils/coordinate-system";
import { sortNumbers } from "../utils/sorting";

type Location = {
  sensor: Point;
  beacon: Point;
};
type LocationWithManhattanDistance = Location & { manhattanDistance: number };

const locations: Location[] = readLines("src/15/inputs/input.txt", (line) => {
  const split = line.split(": closest beacon is at ");

  const sensorXAndY = split[0].substring("Sensor at ".length);
  const sensorX = Number(sensorXAndY.split(", ")[0].substring(2));
  const sensorY = Number(sensorXAndY.split(", ")[1].substring(2));
  const sensor: Point = [sensorX, sensorY];

  const beaconX = Number(split[1].split(", ")[0].substring(2));
  const beaconY = Number(split[1].split(", ")[1].substring(2));
  const beacon: Point = [beaconX, beaconY];

  return { sensor, beacon };
});

const getManhattanDistance = ([x1, y1]: Point, [x2, y2]: Point) =>
  Math.abs(x2 - x1) + Math.abs(y2 - y1);

const toCoordinateSystem = (
  locations: Location[]
): C.CoordinateSystem<"S" | "B" | "#"> => {
  let coordinateSystem: C.CoordinateSystem<"S" | "B" | "#"> = {};

  locations.forEach(({ sensor, beacon }) => {
    coordinateSystem = C.add(
      coordinateSystem,
      [sensor, "S"],
      (_previous, next) => next
    );
    coordinateSystem = C.add(
      coordinateSystem,
      [beacon, "B"],
      (_previous, next) => next
    );

    const manhattanDistance = getManhattanDistance(sensor, beacon);

    for (let x = -manhattanDistance; x <= manhattanDistance; x++) {
      for (let y = -manhattanDistance; y <= manhattanDistance; y++) {
        const point: Point = [sensor[0] + x, sensor[1] + y];
        const newManhattanDistance = getManhattanDistance(sensor, point);
        if (newManhattanDistance <= manhattanDistance) {
          coordinateSystem = C.add(
            coordinateSystem,
            [point, "#"],
            (previous, _next) => previous
          );
        }
      }
    }
  });

  return coordinateSystem;
};

const withManhattanDistance = ({
  sensor,
  beacon,
}: Location): LocationWithManhattanDistance => ({
  sensor,
  beacon,
  manhattanDistance: getManhattanDistance(sensor, beacon),
});

const getMinX = (locations: LocationWithManhattanDistance[]) =>
  sortNumbers(
    locations.map(
      ({ sensor, manhattanDistance }) => sensor[0] - manhattanDistance
    ),
    "asc"
  )[0];

const getMaxX = (locations: LocationWithManhattanDistance[]) =>
  sortNumbers(
    locations.map(
      ({ sensor, manhattanDistance }) => sensor[0] + manhattanDistance
    ),
    "desc"
  )[0];

const withManhattanDistances = locations.map(withManhattanDistance);
const minX = getMinX(withManhattanDistances);
const maxX = getMaxX(withManhattanDistances);

let i = 0;
for (let x = minX; x <= maxX; x++) {
  if (x % 10_000 === 0) console.log(`${x}/${maxX}`);

  if (
    locations.some(
      ({ sensor: [sX, sY], beacon: [bX, bY] }) =>
        (sX === x && sY === 2_000_000) || (bX === x && bY === 2_000_000)
    )
  )
    continue;

  const withManhattanDistancesToXs = withManhattanDistances.map(
    ({ sensor, manhattanDistance }) => ({
      sensor,
      manhattanDistance,
      manhattanDistanceToX: getManhattanDistance(sensor, [x, 2_000_000]),
    })
  );

  const isWithin = withManhattanDistancesToXs.some(
    ({ manhattanDistance, manhattanDistanceToX }) =>
      manhattanDistanceToX <= manhattanDistance
  );
  i += isWithin ? 1 : 0;
}
console.log(i);
// const coordinateSystem = toCoordinateSystem(locations);

// C.render(coordinateSystem, (s) => s, {
//   x1: -2,
//   x2: 25,
//   y1: 0,
//   y2: 22,
// });

// const row = C.getRow(coordinateSystem, 10)
//   .map((value) => value ?? ".")
//   .join("");
// console.log("Row:");
// console.log(row);

export const part1 = 123;
console.log("Part 1:", part1);

export const part2 = 456;
console.log("Part 2:", part2);