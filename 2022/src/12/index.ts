import { readFile, readLines } from "../utils/file-reading";

const parseFile = (file: string) => {
  const grid: number[][] = [];
  let startPosition: [number, number] = [0, 0];
  let targetPosition: [number, number] = [0, 0];

  const rows = file.split("\n");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const gridRow: number[] = [];

    for (let j = 0; j < row.length; j++) {
      const cell = row[j];

      if (cell === "S") {
        startPosition = [i, j];
        gridRow.push(0);
      } else if (cell === "E") {
        targetPosition = [i, j];
        gridRow.push(25);
      } else {
        gridRow.push(cell.charCodeAt(0) - 97);
      }
    }

    grid.push(gridRow);
  }

  grid.forEach((row) => {
    row.push(999);
    row.unshift(999);
  });

  grid.push(grid[0].map(() => 999));
  grid.unshift(grid[0].map(() => 999));

  startPosition[0]++;
  startPosition[1]++;
  targetPosition[0]++;
  targetPosition[1]++;

  return { startPosition, targetPosition, grid };
};

const canGoUp = (grid: number[][], position: [number, number]) =>
  grid[position[0]][position[1]] + 1 >= grid[position[0] - 1][position[1]];

const canGoDown = (grid: number[][], position: [number, number]) =>
  grid[position[0]][position[1]] + 1 >= grid[position[0] + 1][position[1]];

const canGoLeft = (grid: number[][], position: [number, number]) =>
  grid[position[0]][position[1]] + 1 >= grid[position[0]][position[1] - 1];

const canGoRight = (grid: number[][], position: [number, number]) =>
  grid[position[0]][position[1]] + 1 >= grid[position[0]][position[1] + 1];

const containsPosition = (
  path: [number, number][],
  position: [number, number]
) => path.filter(([a, b]) => position[0] === a && position[1] === b).length > 0;

const findShortestPathLength = (
  grid: number[][],
  startPosition: [number, number],
  targetPositions: [number, number][]
) => {
  const visitedPositions: [number, number][] = [startPosition];
  let currentPositions: [number, number][] = [startPosition];
  let shortestPathLength = 0;

  while (true) {
    const nextPositions: [number, number][] = [];

    for (const position of currentPositions) {
      const up: [number, number] = [position[0] - 1, position[1]];
      const down: [number, number] = [position[0] + 1, position[1]];
      const left: [number, number] = [position[0], position[1] - 1];
      const right: [number, number] = [position[0], position[1] + 1];

      if (!containsPosition(visitedPositions, up) && canGoUp(grid, position)) {
        visitedPositions.push(up);
        nextPositions.push(up);
      }

      if (
        !containsPosition(visitedPositions, down) &&
        canGoDown(grid, position)
      ) {
        visitedPositions.push(down);
        nextPositions.push(down);
      }

      if (
        !containsPosition(visitedPositions, left) &&
        canGoLeft(grid, position)
      ) {
        visitedPositions.push(left);
        nextPositions.push(left);
      }

      if (
        !containsPosition(visitedPositions, right) &&
        canGoRight(grid, position)
      ) {
        visitedPositions.push(right);
        nextPositions.push(right);
      }
    }

    currentPositions = nextPositions;
    shortestPathLength++;

    if (
      currentPositions.some((potentialEnd) =>
        containsPosition(targetPositions, potentialEnd)
      )
    ) {
      return shortestPathLength;
    }
  }
};

const file = readFile("src/12/inputs/input.txt");
const { grid, startPosition, targetPosition } = parseFile(file);

export const part1 = findShortestPathLength(grid, startPosition, [
  targetPosition,
]);
console.log("Part 1:", part1);

const invertedGrid = grid.map((row) =>
  row.map((cell) => (cell === 999 ? 999 : 25 - cell))
);

const targetPositionsDown: [number, number][] = [];
grid.forEach((row, i) =>
  row.forEach((cell, j) => {
    if (cell === 0) targetPositionsDown.push([i, j]);
  })
);

export const part2 = findShortestPathLength(
  invertedGrid,
  targetPosition,
  targetPositionsDown
);
console.log("Part 2:", part2);
