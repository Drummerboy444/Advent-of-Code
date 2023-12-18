import { Coordinate, addCoordinates } from "../utils/coordinate-system";
import { readLines } from "../utils/file-reading";

const DIRECTIONS = ["U", "D", "L", "R"] as const;

type Direction = (typeof DIRECTIONS)[number];

const isDirection = (maybeDirection: unknown): maybeDirection is Direction =>
  DIRECTIONS.includes(maybeDirection as Direction);

type Instruction = {
  direction: Direction;
  distance: number;
  colour: string;
};

const DIRECTION_TO_COORDINATE_LOOKUP: Record<Direction, Coordinate> = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

const parseLineToInstruction = (line: string): Instruction => {
  const [direction, distance, colour] = line.split(" ");

  if (
    direction === undefined ||
    distance === undefined ||
    colour === undefined ||
    !isDirection(direction)
  )
    throw new Error();

  return { direction, distance: parseInt(distance), colour };
};

const getHoleOutline = (instructions: Instruction[]): Coordinate[] => {
  const holeOutline: Coordinate[] = [{ x: 0, y: 0 }];

  instructions.forEach(({ direction, distance }) => {
    const lastHolePosition = holeOutline[holeOutline.length - 1];
    if (lastHolePosition === undefined) throw new Error();

    const coordinateChange = DIRECTION_TO_COORDINATE_LOOKUP[direction];
    for (let i = 1; i <= distance; i++) {
      holeOutline.push(
        addCoordinates(lastHolePosition, {
          x: coordinateChange.x * i,
          y: coordinateChange.y * i,
        })
      );
    }
  });

  return holeOutline;
};

const getMinAndMax = (coordinates: Coordinate[]) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  coordinates.forEach(({ x, y }) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  return { minX, maxX, minY, maxY };
};

const getRayCastHits = (
  stringCoordinates: Set<string>,
  minX: number,
  { x, y }: Coordinate
) => {
  let hits = 0;
  let hitting = false;
  let hitType: "BELOW" | "ABOVE" | undefined;

  for (let i = x; i >= minX - 1; i--) {
    const coordinateToCheck = { x: i, y };
    const hitThisTime = stringCoordinates.has(
      `${coordinateToCheck.x},${coordinateToCheck.y}`
    );

    if (!hitting && hitThisTime) {
      if (
        stringCoordinates.has(
          `${coordinateToCheck.x},${coordinateToCheck.y + 1}`
        )
      ) {
        hitType = "BELOW";
      } else {
        hitType = "ABOVE";
      }
    }

    if (!hitThisTime && hitting) {
      if (
        stringCoordinates.has(
          `${coordinateToCheck.x + 1},${coordinateToCheck.y + 1}`
        ) &&
        hitType === "ABOVE"
      ) {
        hits++;
      }
      if (
        stringCoordinates.has(
          `${coordinateToCheck.x + 1},${coordinateToCheck.y - 1}`
        ) &&
        hitType === "BELOW"
      ) {
        hits++;
      }
    }

    hitting = hitThisTime;
  }

  return hits;
};

const solvePart1 = (holeOutline: Coordinate[], render = false) => {
  const { minX, minY, maxX, maxY } = getMinAndMax(holeOutline);
  const stringHoleOutline = new Set(holeOutline.map(({ x, y }) => `${x},${y}`));

  if (render) {
    for (let y = minY; y <= maxY; y++) {
      const line: string[] = [];
      for (let x = minX; x <= maxX; x++) {
        if (stringHoleOutline.has(`${x},${y}`)) line.push("#");
        else if (getRayCastHits(stringHoleOutline, minX, { x, y }) % 2 === 1)
          line.push("#");
        else line.push(".");
      }
      console.log(line.join(""));
    }
  }

  let count = 0;

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      if (stringHoleOutline.has(`${x},${y}`)) {
        count++;
        continue;
      }
      const rayCastHits = getRayCastHits(stringHoleOutline, minX, { x, y });
      if (rayCastHits % 2 === 1) count++;
    }
  }

  return count;
};

const lines = readLines("src/18/inputs/input.txt");
const instructions = lines.map(parseLineToInstruction);
const holeOutline = getHoleOutline(instructions);

const part1 = solvePart1(holeOutline);
console.log("Part 1:", part1);
