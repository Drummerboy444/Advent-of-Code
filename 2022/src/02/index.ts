import { readLines } from "../utils/file-reading";

type Move = "A" | "B" | "C";
type Code = "X" | "Y" | "Z";

const parseLines = (line: string) => {
  const parts = line.split(" ");
  return {
    elfMove: parts[0] as Move,
    code: parts[1] as Code,
  };
};

const CODE_TO_MOVE_LOOKUP_PART_1 = {
  X: "A" as const,
  Y: "B" as const,
  Z: "C" as const,
};

const mapCodesToMovesPart1 = ({
  elfMove,
  code,
}: {
  elfMove: Move;
  code: Code;
}) => ({
  elfMove,
  yourMove: CODE_TO_MOVE_LOOKUP_PART_1[code],
});

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

const mapCodesToMovesPart2 = ({
  elfMove,
  code,
}: {
  elfMove: Move;
  code: Code;
}) => ({
  elfMove,
  yourMove: CODE_TO_MOVE_LOOKUP_PART_2[elfMove][code],
});

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

const lines = readLines("src/02/input.txt", parseLines);

const totalScorePart1 = lines
  .map(mapCodesToMovesPart1)
  .map(calculateScore)
  .reduce((a, b) => a + b, 0);

console.log("Part 1:", totalScorePart1);

const totalScorePart2 = lines
  .map(mapCodesToMovesPart2)
  .map(calculateScore)
  .reduce((a, b) => a + b, 0);

console.log("Part 2:", totalScorePart2);
