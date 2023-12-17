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

const lines = readLines("src/16/inputs/input.txt");
const contraption = parseLinesToContraption(lines);
const energisedTiles = new Set<string>();
getEnergisedTiles(
  {
    position: { x: -1, y: 0 },
    direction: "RIGHT",
  },
  contraption,
  energisedTiles,
  new Set<string>()
);

console.log(energisedTiles.size);
