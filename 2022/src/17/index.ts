import { readFile } from "../utils/file-reading";
import * as C from "../utils/coordinate-system";
import * as P from "../utils/point";

type Instruction = "left" | "right";
type Rock = P.Point[];

const rocks: Rock[] = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [0, 1],
    [1, 0],
    [1, 1],
    [2, 1],
    [1, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
];

const isAngleBracket = (s: string): s is "<" | ">" =>
  s.length === 1 && (s === "<" || s === ">");

const toInstruction = (angleBracket: "<" | ">") =>
  angleBracket === "<" ? "left" : "right";

const getCyclically = <T>(as: T[], i: number) => as[i % as.length];

const pushRock = (rock: Rock, instruction: Instruction) =>
  P.addToMany(rock, instruction === "left" ? [-1, 0] : [1, 0]);

const dropRock = (
  chamber: C.CoordinateSystem<"#">,
  rock: Rock,
  instructions: Instruction[],
  instructionIndex: number
) => {
  const maxY = C.getMaxY(chamber);
  const startY = maxY === undefined ? 3 : maxY + 4;
  let currentRockPosition = P.addToMany(rock, [2, startY]);
  let i = instructionIndex;

  while (true) {
    const rockAfterJet = pushRock(
      currentRockPosition,
      getCyclically(instructions, i)
    );
    i++;
    const canBePushed = rockAfterJet.every(
      ([x, y]) => !C.contains(chamber, [x, y]) && x >= 0 && x <= 6
    );
    if (canBePushed) currentRockPosition = rockAfterJet;

    const rockAfterFalling = P.addToMany(currentRockPosition, [0, -1]);
    const canFall = rockAfterFalling.every(
      ([x, y]) => !C.contains(chamber, [x, y]) && y >= 0
    );
    if (canFall) currentRockPosition = rockAfterFalling;
    else break;
  }

  const newChamber = C.add(
    chamber,
    C.from(currentRockPosition, () => "#" as const)
  );
  return { newChamber, newInstructionIndex: i };
};

const dropRocks = (instructions: Instruction[], count: number) => {
  let chamber: C.CoordinateSystem<"#"> = {};
  let instructionIndex = 0;

  for (let i = 0; i < count; i++) {
    if (i % 1000 === 0) console.log(`Dropping rock ${i}/${count}`);

    const rock = getCyclically(rocks, i);
    const { newChamber, newInstructionIndex } = dropRock(
      chamber,
      rock,
      instructions,
      instructionIndex
    );
    chamber = newChamber;
    instructionIndex = newInstructionIndex;
  }

  return chamber;
};

const instructions = readFile("src/17/inputs/input.txt")
  .split("")
  .filter(isAngleBracket)
  .map(toInstruction);

export const part1 = C.getMaxY(dropRocks(instructions, 2022)) + 1;
console.log("Part 1:", part1);

export const part2 = 456;
console.log("Part 2:", part2);
