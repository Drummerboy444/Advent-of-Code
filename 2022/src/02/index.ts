import { readLines } from "../utils/file-reading";

type Move = "A" | "B" | "C";
type Code = "X" | "Y" | "Z";

const parseLineToMove = (line: string) => {
  const parts = line.split(" ");
  return {
    elfMove: parts[0] as Move,
    yourCode: parts[1] as Code,
  };
};

const SCORE_LOOKUP = {
  A: {
    A: 4,
    B: 8,
    C: 3,
  },
  B: {
    A: 1,
    B: 5,
    C: 9,
  },
  C: {
    A: 7,
    B: 2,
    C: 6,
  },
};

const calculateScore = ({
  elfMove,
  yourMove,
}: {
  elfMove: Move;
  yourMove: Move;
}) => SCORE_LOOKUP[elfMove][yourMove];

const CODE_TO_MOVE_LOOKUP_PART_1 = {
  X: "A" as const,
  Y: "B" as const,
  Z: "C" as const,
};

const mapCodesToMovesPart1 = (code: Code) => CODE_TO_MOVE_LOOKUP_PART_1[code];

const lines = readLines("src/02/input.txt", parseLineToMove);

const movesPart1 = lines.map(({ elfMove, yourCode }) => ({
  elfMove,
  yourMove: mapCodesToMovesPart1(yourCode),
}));
const scoresPart1 = movesPart1.map(calculateScore);
const totalScore = scoresPart1.reduce((a, b) => a + b, 0);

console.log("Part 1:", totalScore);

const CODE_TO_MOVE_LOOKUP_PART_2 = {
  A: {
    X: "C" as const,
    Y: "A" as const,
    Z: "B" as const,
  },
  B: {
    X: "A" as const,
    Y: "B" as const,
    Z: "C" as const,
  },
  C: {
    X: "B" as const,
    Y: "C" as const,
    Z: "A" as const,
  },
};

const mapCodesToMovesPart2 = (elfMove: Move, code: Code) =>
  CODE_TO_MOVE_LOOKUP_PART_2[elfMove][code];

const movesPart2 = lines.map(({ elfMove, yourCode }) => ({
  elfMove,
  yourMove: mapCodesToMovesPart2(elfMove, yourCode),
}));
const scoresPart2 = movesPart2.map(calculateScore);
const totalScore2 = scoresPart2.reduce((a, b) => a + b, 0);

console.log("Part 2:", totalScore2);
