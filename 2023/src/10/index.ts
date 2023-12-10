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

const tryGetPipe = (
  coordinateSystem: CoordinateSystem,
  [x, y]: [number, number]
) => {
  const row = coordinateSystem[y];
  if (row === undefined) return undefined;
  return row[x];
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

const getLoopCoordinates = (
  coordinateSystem: CoordinateSystem,
  startType: Pipe
) => {
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

  const loopCoordinates: [number, number][] = [
    start,
    [
      start[0] + COORDINATE_CHANGE_LOOKUP[startType][0][0],
      start[1] + COORDINATE_CHANGE_LOOKUP[startType][0][1],
    ],
    [
      start[0] + COORDINATE_CHANGE_LOOKUP[startType][1][0],
      start[1] + COORDINATE_CHANGE_LOOKUP[startType][1][1],
    ],
  ];

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

    if (isSameCoordinate(nextPosition1, nextPosition2)) {
      loopCoordinates.push(nextPosition1);
      break;
    }

    previousPositions = [position1, position2];
    positions = [nextPosition1, nextPosition2];
    loopCoordinates.push(nextPosition1, nextPosition2);
  }

  return loopCoordinates;
};

const isInLoopCache: Record<string, boolean> = {};

const isInLoop = (
  loopCoordinates: [number, number][],
  position: [number, number]
) => {
  const cacheValue = isInLoopCache[position.join()];
  if (cacheValue !== undefined) return cacheValue;

  const ans = loopCoordinates.some((loopCoordinate) =>
    isSameCoordinate(position, loopCoordinate)
  );
  isInLoopCache[position.join()] = ans;
  return ans;
};

const isAvailablePositionCache: Record<string, boolean> = {};

// TODO: Check if you can move by 0.5 in any direction (8 directions to
// check and need to check each 0.5 type position that is possible...)
// return [[1, 1]] as [number, number][];
const isAvailablePosition = (
  coordinateSystem: CoordinateSystem,
  loopCoordinates: [number, number][],
  [x, y]: [number, number]
): boolean => {
  const cacheValue = isAvailablePositionCache[[x, y].join()];
  if (cacheValue !== undefined) return cacheValue;

  const xIsWholeNumber = x - Math.floor(x) === 0;
  const yIsWholeNumber = y - Math.floor(y) === 0;

  if (xIsWholeNumber && yIsWholeNumber) {
    const ans = !isInLoop(loopCoordinates, [x, y]);
    isAvailablePositionCache[[x, y].join()] = ans;
    return ans;
  }

  if (xIsWholeNumber && !yIsWholeNumber) {
    const abovePipe = tryGetPipe(coordinateSystem, [x, y - 0.5]);

    if (
      !isInLoop(loopCoordinates, [x, y - 0.5]) ||
      !isInLoop(loopCoordinates, [x, y + 0.5])
    ) {
      isAvailablePositionCache[[x, y].join()] = true;
      return true;
    }

    if (abovePipe === "|" || abovePipe === "7" || abovePipe === "F") {
      isAvailablePositionCache[[x, y].join()] = false;
      return false;
    }

    isAvailablePositionCache[[x, y].join()] = true;
    return true;
  }

  if (!xIsWholeNumber && yIsWholeNumber) {
    const leftPipe = tryGetPipe(coordinateSystem, [x - 0.5, y]);

    if (
      !isInLoop(loopCoordinates, [x - 0.5, y]) ||
      !isInLoop(loopCoordinates, [x + 0.5, y])
    ) {
      isAvailablePositionCache[[x, y].join()] = true;
      return true;
    }

    if (leftPipe === "-" || leftPipe === "L" || leftPipe === "F") {
      isAvailablePositionCache[[x, y].join()] = false;
      return false;
    }

    isAvailablePositionCache[[x, y].join()] = true;
    return true;
  }

  if (!xIsWholeNumber && !yIsWholeNumber) {
    isAvailablePositionCache[[x, y].join()] = true;
    return true;
  }

  isAvailablePositionCache[[x, y].join()] = false;
  return false;
};

const getNextMovablePositionsCache: Record<string, [number, number][]> = {};

const getNextMovablePositions = (
  coordinateSystem: CoordinateSystem,
  loopCoordinates: [number, number][],
  [x, y]: readonly [number, number]
): [number, number][] => {
  const cacheValue = getNextMovablePositionsCache[[x, y].join()];
  if (cacheValue !== undefined) return cacheValue;

  const ans = (
    [
      [x + 0.5, y],
      [x - 0.5, y],
      [x, y + 0.5],
      [x, y - 0.5],
      [x + 0.5, y + 0.5],
      [x + 0.5, y - 0.5],
      [x - 0.5, y + 0.5],
      [x - 0.5, y - 0.5],
    ] as [number, number][]
  ).filter((position) =>
    isAvailablePosition(coordinateSystem, loopCoordinates, position)
  );
  getNextMovablePositionsCache[[x, y].join()] = ans;
  return ans;
};

const inLoopCache = new Set<string>();
const notInLoopCache = new Set<string>();

const solvePart2 = (coordinateSystem: CoordinateSystem, startType: Pipe) => {
  // TODO: Need to handle the S pipe... Maybe just swap this out for its real
  // value right at the start?

  const loopCoordinates = getLoopCoordinates(coordinateSystem, startType);

  // Replace S pipe with its actual type.
  coordinateSystem = coordinateSystem.map((row) =>
    row.map((pipe) => (pipe === "S" ? startType : pipe))
  );

  // console.log(coordinateSystem);

  const maxYCoordinate = coordinateSystem.length - 1;
  const firstRow = coordinateSystem[0];
  if (firstRow === undefined) throw new Error();
  const maxXCoordinate = firstRow.length - 1;

  for (let y = 0; y <= maxYCoordinate; y++) {
    for (let x = 0; x <= maxXCoordinate; x++) {
      // console.log("Checking:", x, y);
      console.log(
        `Checking (${x} / ${maxXCoordinate}, ${y} / ${maxYCoordinate})`
      );

      const coordinate = [x, y] as const;

      if (isInLoop(loopCoordinates, [x, y])) {
        continue;
      }

      if (
        inLoopCache.has(coordinate.join()) ||
        notInLoopCache.has(coordinate.join())
      ) {
        console.log("Using cache...");
        continue;
      }

      const checkedPositions = new Set<string>();
      let currentCheckPositions = [coordinate];

      // - Get next check positions by moving in every direction from the current
      //   check positions, but excluding any that are already in checkedPositions.
      // - If next check positions is empty, break and sort out relevant cache data.
      // - See if any of the next check positions are on the edge.
      //   - If so, break and add relevant data to the caches.
      //   - Carry on.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        let nextCheckPositions = currentCheckPositions
          .flatMap((currentCheckPosition) => {
            return getNextMovablePositions(
              coordinateSystem,
              loopCoordinates,
              currentCheckPosition
            );
          })
          .filter((potentialNextCheckPosition) => {
            return !checkedPositions.has(potentialNextCheckPosition.join());
          });

        nextCheckPositions = [
          ...new Set(nextCheckPositions.map((p) => p.join())),
        ].map((sp): [number, number] => {
          const [a, b] = sp.split(",");
          if (a === undefined || b === undefined) throw new Error();
          return [parseFloat(a), parseFloat(b)];
        });

        // .filter((potentialNextCheckPosition) => {
        //   if (inLoopCache.has(potentialNextCheckPosition.join()))
        //     return false;
        //   if (notInLoopCache.has(potentialNextCheckPosition.join()))
        //     return false;
        //   return true;
        //   // return (
        //   //   !inLoopCache.has(potentialNextCheckPosition.join()) &&
        //   //   !notInLoopCache.has(potentialNextCheckPosition.join())
        //   // );
        // });

        if (nextCheckPositions.some((pos) => inLoopCache.has(pos.join()))) {
          nextCheckPositions.forEach((pos) => {
            inLoopCache.add(pos.join());
          });
          // [...checkedPositions].forEach((pos) => {
          //   inLoopCache.add(pos);
          // });
          break;
        }

        if (nextCheckPositions.some((pos) => notInLoopCache.has(pos.join()))) {
          // nextCheckPositions.forEach((pos) => {
          //   inLoopCache.add(pos.join());
          // });
          // [...checkedPositions].forEach((pos) => {
          //   inLoopCache.add(pos);
          // });
          break;
        }

        console.log(nextCheckPositions.length);
        console.log(checkedPositions.size);

        if (nextCheckPositions.length === 0) {
          [...checkedPositions].forEach((checkedPosition) => {
            inLoopCache.add(checkedPosition);
          });
          break;
        }

        if (
          nextCheckPositions.some(([x, y]) => {
            return (
              x === 0 || x === maxXCoordinate || y === 0 || y === maxYCoordinate
            );
          })
        ) {
          nextCheckPositions.forEach((position) => {
            notInLoopCache.add(position.join());
          });
          [...checkedPositions].forEach((position) => {
            notInLoopCache.add(position);
          });
          break;
        }

        currentCheckPositions = nextCheckPositions;
        currentCheckPositions.forEach((position) => {
          checkedPositions.add(position.join());
        });
      }
    }
  }

  return inLoopCache;
};

const lines = readLines("src/10/inputs/input.txt");
const coordinateSystem = parseToCoordinateSystem(lines);

// const part1 = solvePart1(coordinateSystem, "|");
// console.log("Part 1:", part1);

const part2 = solvePart2(coordinateSystem, "|");
// console.log("Part 2:", part2);

console.log([...inLoopCache].filter((inLoop) => !inLoop.includes(".")).length);
