import { range } from "../utils/arrays";
import { readLines } from "../utils/file-reading";

type Vector = { x: number; y: number };

const instructions = readLines("src/09/input.txt", (line) => ({
  direction: line.split(" ")[0] as "U" | "D" | "L" | "R",
  magnitude: Number(line.split(" ")[1]),
}));

const directionToVectorLookup = {
  U: { x: 0, y: 1 },
  D: { x: 0, y: -1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

const addVectors = (v1: Vector, v2: Vector) => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
});

const multiplyVector = (vector: Vector, magnitude: number) => ({
  x: vector.x * magnitude,
  y: vector.y * magnitude,
});

const subtractVectors = (v1: Vector, v2: Vector) =>
  addVectors(v1, multiplyVector(v2, -1));

const getTailPosition = (headPosition: Vector, tailPosition: Vector) => {
  const difference = subtractVectors(headPosition, tailPosition);

  if (Math.abs(difference.x) <= 1 && Math.abs(difference.y) <= 1)
    return tailPosition;

  const requiredMovement = multiplyVector(difference, 0.5);

  if (requiredMovement.x === 0.5) requiredMovement.x = 1;
  if (requiredMovement.y === 0.5) requiredMovement.y = 1;
  if (requiredMovement.x === -0.5) requiredMovement.x = -1;
  if (requiredMovement.y === -0.5) requiredMovement.y = -1;

  return addVectors(tailPosition, requiredMovement);
};

const solvePart1 = () => {
  let headPosition = { x: 0, y: 0 };
  let tailPosition = { x: 0, y: 0 };

  const tailPositions = new Set<string>();
  tailPositions.add("0,0");

  instructions.forEach(({ direction, magnitude }) => {
    const directionVector = directionToVectorLookup[direction];

    for (let _ = 0; _ < magnitude; _++) {
      headPosition = addVectors(headPosition, directionVector);
      tailPosition = getTailPosition(headPosition, tailPosition);
      tailPositions.add(`${tailPosition.x},${tailPosition.y}`);
    }
  });

  return tailPositions.size;
};

export const part1 = solvePart1();
console.log("Part 1:", part1);

const solvePart2 = () => {
  const knotPositions = range(1, 10).map(() => ({ x: 0, y: 0 }));

  const tailPositions = new Set<string>();
  tailPositions.add("0,0");

  instructions.forEach(({ direction, magnitude }) => {
    const directionVector = directionToVectorLookup[direction];

    for (let _ = 0; _ < magnitude; _++) {
      knotPositions[0] = addVectors(knotPositions[0], directionVector);

      for (let i = 1; i < knotPositions.length; i++) {
        knotPositions[i] = getTailPosition(
          knotPositions[i - 1],
          knotPositions[i]
        );
      }

      tailPositions.add(`${knotPositions[9].x},${knotPositions[9].y}`);
    }
  });

  return tailPositions.size;
};

export const part2 = solvePart2();
console.log("Part 2:", part2);
