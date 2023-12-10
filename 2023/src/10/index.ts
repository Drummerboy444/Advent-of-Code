import { readLines } from "../utils/file-reading";

const pipes = ["|", "-", "L", "J", "7", "F", ".", "S"] as const;
type Pipe = (typeof pipes)[number];
const isPipe = (maybePipe: unknown): maybePipe is Pipe =>
  pipes.includes(maybePipe as Pipe);

type CoordinateSystem = Pipe[][];

const COORDINATE_CHANGE_LOOKUP: Record<
  Pipe,
  [[number, number], [number, number]]
> = {
  "|": [
    [0, -1],
    [0, 1],
  ],
  "-": [
    [1, 0],
    [-1, 0],
  ],
  L: [
    [0, -1],
    [1, 0],
  ],
  J: [
    [-1, 0],
    [0, -1],
  ],
  7: [
    [-1, 0],
    [0, 1],
  ],
  F: [
    [1, 0],
    [0, 1],
  ],
  ".": [
    [0, 0],
    [0, 0],
  ],
  S: [
    [0, 0],
    [0, 0],
  ],
};

const parseToCoordinateSystem = (lines: string[]): CoordinateSystem =>
  lines.map((line) =>
    line.split("").map((maybePipe) => {
      if (!isPipe(maybePipe)) throw new Error();
      return maybePipe;
    })
  );

const findStart = (coordinateSystem: CoordinateSystem): [number, number] => {
  for (let i = 0; i < coordinateSystem.length; i++) {
    const line = coordinateSystem[i];
    if (line === undefined) throw new Error();

    for (let j = 0; j < line.length; j++) {
      const pipe = line[j];
      if (pipe === undefined) throw new Error();
      if (pipe === "S") return [j, i];
    }
  }

  throw new Error();
};

const getPipe = (
  coordinateSystem: CoordinateSystem,
  [x, y]: [number, number]
) => {
  const row = coordinateSystem[y];
  if (row === undefined) throw new Error();
  const pipe = row[x];
  if (pipe === undefined) throw new Error();
  return pipe;
};

const addCoordinates = (
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): [number, number] => [x1 + x2, y1 + y2];

const getNextPositions = (
  coordinateSystem: CoordinateSystem,
  [x, y]: [number, number]
): [[number, number], [number, number]] => {
  const pipe = getPipe(coordinateSystem, [x, y]);
  const coordinateChanges = COORDINATE_CHANGE_LOOKUP[pipe];
  return [
    addCoordinates([x, y], coordinateChanges[0]),
    addCoordinates([x, y], coordinateChanges[1]),
  ];
};

const isSameCoordinate = (
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
) => x1 === x2 && y1 === y2;

const solvePart1 = (coordinateSystem: CoordinateSystem, startType: Pipe) => {
  const start = findStart(coordinateSystem);

  let previousPositions: [[number, number], [number, number]] = [start, start];
  let positions: [[number, number], [number, number]] = [
    [
      start[0] + COORDINATE_CHANGE_LOOKUP[startType][0][0],
      start[1] + COORDINATE_CHANGE_LOOKUP[startType][0][1],
    ],
    [
      start[0] + COORDINATE_CHANGE_LOOKUP[startType][1][0],
      start[1] + COORDINATE_CHANGE_LOOKUP[startType][1][1],
    ],
  ];

  let steps = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const previousPosition1 = previousPositions[0];
    const position1 = positions[0];
    const nextPositions1 = getNextPositions(coordinateSystem, position1);
    const nextPosition1 = isSameCoordinate(nextPositions1[0], previousPosition1)
      ? nextPositions1[1]
      : nextPositions1[0];

    const previousPosition2 = previousPositions[1];
    const position2 = positions[1];
    const nextPositions2 = getNextPositions(coordinateSystem, position2);
    const nextPosition2 = isSameCoordinate(nextPositions2[0], previousPosition2)
      ? nextPositions2[1]
      : nextPositions2[0];

    if (isSameCoordinate(nextPosition1, nextPosition2)) return steps;

    previousPositions = [position1, position2];
    positions = [nextPosition1, nextPosition2];

    steps++;
  }
};

const lines = readLines("src/10/inputs/input.txt");
const coordinateSystem = parseToCoordinateSystem(lines);

const part1 = solvePart1(coordinateSystem, "|");
console.log("Part 1:", part1);
