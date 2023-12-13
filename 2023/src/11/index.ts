import { readLines } from "../utils/file-reading";

type ImageRow = string[];
type Image = ImageRow[];
type Coordinate = { x: number; y: number };

const parseLinesToImage = (lines: string[]): Image =>
  lines.map((line) => line.split(""));

const expandEmptyRows = (image: Image) => {
  const newImage: Image = [];
  image.forEach((row) => {
    newImage.push(row);
    if (row.every((item) => item === "." || item === "E"))
      newImage.push(row.map(() => "E"));
  });
  return newImage;
};

const expandEmptyColumns = (image: Image) => {
  const newImage: Image = [...image.map((row) => [...row])];
  const firstRow = image[0];
  if (firstRow === undefined) throw new Error();
  const imageWidth = firstRow.length;

  for (let i = imageWidth - 1; i >= 0; i--) {
    const column = image.map((row) => {
      const item = row[i];
      if (item === undefined) throw new Error();
      return item;
    });

    if (column.every((item) => item === "." || item === "E")) {
      newImage.forEach((row) => {
        row.splice(i + 1, 0, "E");
      });
    }
  }

  return newImage;
};

const getGalaxyCoordinates = (image: Image) => {
  const galaxyCoordinates: Coordinate[] = [];

  image.forEach((row, y) => {
    row.forEach((item, x) => {
      if (item === "#") galaxyCoordinates.push({ x, y });
    });
  });

  return galaxyCoordinates;
};

const getAllPairs = <T>(items: T[]): [T, T][] => {
  const pairs: [T, T][] = [];

  for (let i = 0; i < items.length - 1; i++) {
    const item1 = items[i];
    if (item1 === undefined) throw new Error();

    for (let j = i + 1; j < items.length; j++) {
      const item2 = items[j];
      if (item2 === undefined) throw new Error();

      pairs.push([item1, item2]);
    }
  }

  return pairs;
};

const getDistance = (
  { x: x1, y: y1 }: Coordinate,
  { x: x2, y: y2 }: Coordinate
) => Math.abs(x2 - x1) + Math.abs(y2 - y1);

const solvePart1 = (
  galaxyCoordinatePairs: [Coordinate, Coordinate][]
): number =>
  galaxyCoordinatePairs
    .map(([c1, c2]) => getDistance(c1, c2))
    .reduce((a, b) => a + b, 0);

const getDistanceWithLargeSpaces = (
  image: Image,
  { x: x1, y: y1 }: Coordinate,
  { x: x2, y: y2 }: Coordinate,
  space: number
): number => {
  let distance = 0;

  for (let i = Math.min(x1, x2) + 1; i <= Math.max(x1, x2); i++) {
    const row = image[y1];
    if (row === undefined) throw new Error();
    const item = row[i];
    if (item === undefined) throw new Error();

    distance += item === "E" ? space - 1 : 1;
  }

  for (let i = Math.min(y1, y2) + 1; i <= Math.max(y1, y2); i++) {
    const row = image[i];
    if (row === undefined) throw new Error();
    const item = row[x2];
    if (item === undefined) throw new Error();

    distance += item === "E" ? space - 1 : 1;
  }

  return distance;
};

const solvePart2 = (
  image: Image,
  galaxyCoordinatePairs: [Coordinate, Coordinate][]
) =>
  galaxyCoordinatePairs
    .map(([c1, c2]) => getDistanceWithLargeSpaces(image, c1, c2, 1_000_000))
    .reduce((a, b) => a + b, 0);

const lines = readLines("src/11/inputs/input.txt");
const image = parseLinesToImage(lines);
const expandedImage = expandEmptyColumns(expandEmptyRows(image));
const galaxyCoordinatePairs = getAllPairs(getGalaxyCoordinates(expandedImage));

const part1 = solvePart1(galaxyCoordinatePairs);
console.log("Part 1:", part1);

const part2 = solvePart2(expandedImage, galaxyCoordinatePairs);
console.log("Part 2:", part2);
