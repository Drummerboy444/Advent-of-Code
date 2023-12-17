import {
  Coordinate,
  CoordinateSystem,
  addCoordinates,
  areEqualCoordinates,
  getMaxX,
  getMaxY,
  getValue,
  setValue,
} from "../utils/coordinate-system";
import { readLines } from "../utils/file-reading";

type City = CoordinateSystem<number>;
type Path = Coordinate[];

const parseLinesToCity = (lines: string[]): City =>
  lines.reduce((city, line, y) => {
    line.split("").forEach((character, x) => {
      setValue(city, { x, y }, parseInt(character));
    });
    return city;
  }, {});

const getNextCoordinates = (
  path: Path,
  maxX: number,
  maxY: number
): Coordinate[] => {
  const lastCoordinate = path[path.length - 1];
  if (lastCoordinate === undefined) throw new Error();

  const nextPotentialCoordinates = [
    addCoordinates(lastCoordinate, { x: 1, y: 0 }),
    addCoordinates(lastCoordinate, { x: -1, y: 0 }),
    addCoordinates(lastCoordinate, { x: 0, y: 1 }),
    addCoordinates(lastCoordinate, { x: 0, y: -1 }),
  ];

  const x = nextPotentialCoordinates.filter((nextPotentialCoordinate) => {
    return !path.some((pathCoordinate) =>
      areEqualCoordinates(nextPotentialCoordinate, pathCoordinate)
    );
  });
  const y = x.filter(
    (nextPotentialCoordinate) =>
      nextPotentialCoordinate.x !== -1 &&
      nextPotentialCoordinate.x !== maxX + 1 &&
      nextPotentialCoordinate.y !== -1 &&
      nextPotentialCoordinate.y !== maxY + 1
  );

  return y;

  // TODO...
  // const lastThreeCoordinates;
};

const getBestPath = (pathsWithHeatLoss: { path: Path; heatLoss: number }[]) => {
  const sortedPaths = pathsWithHeatLoss.sort(
    ({ heatLoss: heatLoss1 }, { heatLoss: heatLoss2 }) => heatLoss1 - heatLoss2
  );

  const bestPath = sortedPaths[sortedPaths.length - 1];
  if (bestPath === undefined) throw new Error();
  return bestPath;
};

const solvePart1 = (city: City) => {
  const maxX = getMaxX(city);
  const maxY = getMaxY(city);

  // Note: You may want to store paths with their heat loss to
  // avoid having to keep recalculating this...
  // Note: You could improve things further by not considering paths
  // that join another path that already has a better score...

  // const paths: Path[] = [];
  // let bestPath: Path = [{ x: 0, y: 0 }];
  let bestPathWithHeatLoss: { path: Path; heatLoss: number } = {
    path: [{ x: 0, y: 0 }],
    heatLoss: 2,
  };
  const pathsWithHeatLoss: { path: Path; heatLoss: number }[] = [
    bestPathWithHeatLoss,
  ];

  while (true) {
    // Get next coordinates for the best path.
    const nextCoordinates = getNextCoordinates(
      bestPathWithHeatLoss.path,
      maxX,
      maxY
    );

    // Create new paths from best path + next coordinates.
    const newPaths: { path: Path; heatLoss: number }[] = nextCoordinates.map(
      (nextCoordinate) => ({
        path: [...bestPathWithHeatLoss.path, nextCoordinate],
        heatLoss:
          bestPathWithHeatLoss.heatLoss + getValue(city, nextCoordinate),
      })
    );

    // Set the best path to be the new best path of all paths.
    pathsWithHeatLoss.splice(
      pathsWithHeatLoss.indexOf(bestPathWithHeatLoss),
      0
    );
    pathsWithHeatLoss.push(...newPaths);
    bestPathWithHeatLoss = getBestPath(pathsWithHeatLoss);

    // If the best path of all paths is at the end, then stop...
    const lastCoordinate =
      bestPathWithHeatLoss.path[bestPathWithHeatLoss.path.length - 1];
    if (
      lastCoordinate !== undefined &&
      lastCoordinate.x === maxX &&
      lastCoordinate.y === maxY
    )
      break;
  }

  // return getPathHeatLoss(city, bestPath);
  console.log(bestPathWithHeatLoss);
  return bestPathWithHeatLoss.heatLoss;
};

const lines = readLines("src/17/inputs/input.test-2.txt");
const city = parseLinesToCity(lines);

const part1 = solvePart1(city);
console.log("Part 1:", part1);
