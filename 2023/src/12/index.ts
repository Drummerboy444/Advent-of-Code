import { readLines } from "../utils/file-reading";

const items = [".", "#", "?"] as const;
type Item = (typeof items)[number];
const isItem = (maybeItem: unknown): maybeItem is Item =>
  items.includes(maybeItem as Item);
type RowData = {
  springs: Item[];
  contiguousGroups: number[];
};

const parseLine = (line: string): RowData => {
  const [springsString, contiguousGroupsString] = line.split(" ");

  if (springsString === undefined || contiguousGroupsString === undefined)
    throw new Error();

  const maybeItems = springsString.split("");

  if (!maybeItems.every(isItem)) throw new Error();

  return {
    springs: maybeItems,
    contiguousGroups: contiguousGroupsString
      .split(",")
      .map((value) => parseInt(value)),
  };
};

const getUnknownPositions = ({ springs }: RowData) =>
  springs.reduce<number[]>((unknownPositions, item, i) => {
    if (item === "?") unknownPositions.push(i);
    return unknownPositions;
  }, []);

const countUnknownBrokenSprings = ({ springs, contiguousGroups }: RowData) => {
  const knownBrokenSpringsCount = springs.filter((a) => a === "#").length;
  const totalBrokenSpringsCount = contiguousGroups.reduce((a, b) => a + b, 0);
  return totalBrokenSpringsCount - knownBrokenSpringsCount;
};

const getPermutations = <T>(ts: T[], size: number): T[][] => {
  if (size === 0) {
    return [];
  }

  if (size === 1) {
    return ts.map((t) => [t]);
  }

  if (size === ts.length) return [[...ts]];

  if (size > ts.length) return [];

  const [first, ...rest] = ts;
  if (first === undefined) throw new Error();

  const withFirst = getPermutations(rest, size - 1).map((perm) => [
    first as T,
    ...perm,
  ]);
  const withoutFirst = getPermutations(rest, size);
  return [...withFirst, ...withoutFirst];
};

const arrayEquals = (as: number[], bs: number[]) => {
  if (as.length !== bs.length) return false;
  return as.every((a, i) => a === bs[i]);
};

const springsMatchContiguousGroups = (
  springs: Item[],
  contiguousGroups: number[]
): boolean => {
  const actualContiguousGroups: number[] = [0];

  springs.forEach((item) => {
    if (item === "#") {
      actualContiguousGroups[actualContiguousGroups.length - 1]++;
    } else {
      actualContiguousGroups.push(0);
    }
  });

  return arrayEquals(
    contiguousGroups,
    actualContiguousGroups.filter((x) => x !== 0)
  );
};

const solveRowPart1 = (row: RowData): number => {
  const unknownPositions = getUnknownPositions(row);

  const unknownBrokenSpringsCount = countUnknownBrokenSprings(row);

  const potentialPermutations = getPermutations(
    unknownPositions,
    unknownBrokenSpringsCount
  );

  if (potentialPermutations.length === 0) {
    return 1;
  }

  const validPermutations = potentialPermutations
    .map((potentialPermutation) => {
      return row.springs.map((item, i) =>
        potentialPermutation.includes(i) ? "#" : item === "?" ? "." : item
      );
    })
    .filter((potentialPermutation) => {
      return springsMatchContiguousGroups(
        potentialPermutation,
        row.contiguousGroups
      );
    });

  return validPermutations.length;
};

const solvePart1 = (rows: RowData[]) =>
  rows
    .map((row, i) => {
      console.log(`Solving row ${i + 1} / ${rows.length}`);
      return solveRowPart1(row);
    })
    .reduce((a, b) => a + b, 0);

const lines = readLines("src/12/inputs/input.txt");
const rows = lines.map(parseLine);

const part1 = solvePart1(rows);
console.log("Part 1:", part1);

const rowsPart2: RowData[] = rows.map((row) => ({
  contiguousGroups: Array.from({ length: 5 }).flatMap(
    () => row.contiguousGroups
  ),
  springs: Array.from({ length: 5 }).flatMap(() => row.springs),
}));
const part2 = solvePart1(rowsPart2);
console.log("Part 2:", part2);
