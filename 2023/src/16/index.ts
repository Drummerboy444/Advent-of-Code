import { absurd } from "../utils/absurd";
import {
  Coordinate,
  CoordinateSystem,
  addCoordinates,
  getMaxX,
  getMaxY,
  getValue,
  setValue,
} from "../utils/coordinate-system";
import { readLines } from "../utils/file-reading";

type Mirror = "/" | "\\";
type Splitter = "|" | "-";
type EmptySpace = ".";
type ContraptionItemType = Mirror | Splitter | EmptySpace;
type Contraption = CoordinateSystem<ContraptionItemType>;
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
const DIRECTION_ADDITION_LOOKUP: Record<Direction, Coordinate> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};
const MIRROR_DIRECTION_LOOKUP: Record<Mirror, Record<Direction, Direction>> = {
  "/": { UP: "RIGHT", DOWN: "LEFT", LEFT: "DOWN", RIGHT: "UP" },
  "\\": { UP: "LEFT", DOWN: "RIGHT", LEFT: "UP", RIGHT: "DOWN" },
};
type Beam = { position: Coordinate; direction: Direction };

const parseLinesToContraption = (lines: string[]): Contraption =>
  lines.reduce((contraption, line, y) => {
    line.split("").forEach((character, x) => {
      setValue(contraption, { x, y }, character);
    });
    return contraption;
  }, {});

const getEnergisedTiles = (
  { position, direction }: Beam,
  contraption: Contraption,
  energisedTiles: Set<string>,
  energisedTilesWithDirection: Set<string>
) => {
  const maxX = getMaxX(contraption);
  const maxY = getMaxY(contraption);
  let currentPosition = position;
  let currentDirection = direction;

  while (true) {
    const nextPosition = addCoordinates(
      currentPosition,
      DIRECTION_ADDITION_LOOKUP[currentDirection]
    );

    if (nextPosition.x < 0 || nextPosition.x > maxX) break;
    if (nextPosition.y < 0 || nextPosition.y > maxY) break;
    if (
      energisedTilesWithDirection.has(
        `${nextPosition.x},${nextPosition.y},${currentDirection}`
      )
    )
      break;

    currentPosition = nextPosition;

    energisedTiles.add(`${currentPosition.x},${currentPosition.y}`);
    energisedTilesWithDirection.add(
      `${nextPosition.x},${nextPosition.y},${currentDirection}`
    );

    const nextTileType = getValue(contraption, currentPosition);

    if (nextTileType === ".") continue;

    if (nextTileType === "/" || nextTileType === "\\") {
      currentDirection =
        MIRROR_DIRECTION_LOOKUP[nextTileType][currentDirection];
      continue;
    }

    if (nextTileType === "|") {
      if (currentDirection === "UP" || currentDirection === "DOWN") continue;

      getEnergisedTiles(
        {
          position: currentPosition,
          direction: "UP",
        },
        contraption,
        energisedTiles,
        energisedTilesWithDirection
      );
      getEnergisedTiles(
        {
          position: currentPosition,
          direction: "DOWN",
        },
        contraption,
        energisedTiles,
        energisedTilesWithDirection
      );
      break;
    }

    if (nextTileType === "-") {
      if (currentDirection === "LEFT" || currentDirection === "RIGHT") continue;

      getEnergisedTiles(
        {
          position: currentPosition,
          direction: "LEFT",
        },
        contraption,
        energisedTiles,
        energisedTilesWithDirection
      );
      getEnergisedTiles(
        {
          position: currentPosition,
          direction: "RIGHT",
        },
        contraption,
        energisedTiles,
        energisedTilesWithDirection
      );
      break;
    }

    absurd(nextTileType);
  }
};

const solvePart1 = (contraption: Contraption, startBeam: Beam) => {
  const energisedTiles = new Set<string>();
  getEnergisedTiles(startBeam, contraption, energisedTiles, new Set<string>());
  return energisedTiles.size;
};

const solvePart2 = (contraption: Contraption) => {
  const maxX = getMaxX(contraption);
  const maxY = getMaxY(contraption);

  const total = maxX + maxY;

  let maxEnergisedTiles = -1;

  for (let i = 0; i <= maxX; i++) {
    console.log(`Calculating ${i} of ${total}`);

    const topAnswer = solvePart1(contraption, {
      position: { x: i, y: -1 },
      direction: "DOWN",
    });

    if (topAnswer > maxEnergisedTiles) maxEnergisedTiles = topAnswer;

    const bottomAnswer = solvePart1(contraption, {
      position: { x: i, y: maxY + 1 },
      direction: "UP",
    });

    if (bottomAnswer > maxEnergisedTiles) maxEnergisedTiles = bottomAnswer;
  }

  for (let i = 0; i <= maxY; i++) {
    console.log(`Calculating ${maxX + i} of ${total}`);

    const leftAnswer = solvePart1(contraption, {
      position: { x: -1, y: i },
      direction: "RIGHT",
    });

    if (leftAnswer > maxEnergisedTiles) maxEnergisedTiles = leftAnswer;

    const rightAnswer = solvePart1(contraption, {
      position: { x: maxX + 1, y: i },
      direction: "LEFT",
    });

    if (rightAnswer > maxEnergisedTiles) maxEnergisedTiles = rightAnswer;
  }

  return maxEnergisedTiles;
};

const lines = readLines("src/16/inputs/input.txt");
const contraption = parseLinesToContraption(lines);

console.log(
  "Part 1:",
  solvePart1(contraption, {
    position: { x: -1, y: 0 },
    direction: "RIGHT",
  })
);

console.log("Part 2:", solvePart2(contraption));
