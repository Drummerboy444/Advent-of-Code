import { readFile } from "../utils/file-reading";

type Ash = ".";
type Rock = "#";
type CoordinateSystem<T> = Record<number, Record<number, T>>;
type Pattern = CoordinateSystem<Ash | Rock>;

const parseLinesToPattern = (lines: string[]): Pattern =>
  lines.reduce<Pattern>((pattern, line, y) => {
    line
      .split("")
      .map((character) => {
        if (character === "." || character === "#") return character;
        else throw new Error(`Invalid character found: ${character}`);
      })
      .forEach((character, x) => {
        if (!(x in pattern)) pattern[x] = {};
        pattern[x]![y] = character;
      });
    return pattern;
  }, {});

const getMaxX = <T>(c: CoordinateSystem<T>) =>
  Math.max(...Object.keys(c).map((key) => parseInt(key)));

const getMaxY = <T>(c: CoordinateSystem<T>) =>
  Math.max(
    ...Object.values(c).flatMap((value) =>
      Object.keys(value).map((key) => parseInt(key))
    )
  );

const getColumn = <T>(c: CoordinateSystem<T>, x: number) => {
  const maxY = getMaxY(c);
  const column: T[] = [];
  for (let y = 0; y <= maxY; y++) {
    column.push(c[x]![y]!);
  }
  return column;
};

const getRow = <T>(c: CoordinateSystem<T>, y: number) => {
  const maxX = getMaxX(c);
  const row: T[] = [];
  for (let x = 0; x <= maxX; x++) {
    row.push(c[x]![y]!);
  }
  return row;
};

const arraysEqual = <T>(a1: T[], a2: T[]) =>
  a1.length === a2.length && a1.every((value, i) => a2[i] === value);

const isVerticalReflection = (pattern: Pattern, x: number) => {
  const maxX = getMaxX(pattern);

  const numberOfColumnsToLeft = x + 1;
  const numberOfColumnsToRight = maxX - x;
  const numberOfColumnsToCheck = Math.min(
    numberOfColumnsToLeft,
    numberOfColumnsToRight
  );

  for (let i = 0; i < numberOfColumnsToCheck; i++) {
    const leftColumn = getColumn(pattern, x - i);
    const rightColumn = getColumn(pattern, x + i + 1);

    if (!arraysEqual(leftColumn, rightColumn)) return false;
  }

  return true;
};

const isHorizontalReflection = (pattern: Pattern, y: number) => {
  const maxY = getMaxY(pattern);

  const numberOfRowsAbove = y + 1;
  const numberOfRowsBelow = maxY - y;
  const numberOfRowsToCheck = Math.min(numberOfRowsAbove, numberOfRowsBelow);

  for (let i = 0; i < numberOfRowsToCheck; i++) {
    const aboveRow = getRow(pattern, y - i);
    const belowRow = getRow(pattern, y + i + 1);

    if (!arraysEqual(aboveRow, belowRow)) return false;
  }

  return true;
};

const tryGetVerticalLineOfReflection = (
  pattern: Pattern,
  answerToIgnore?: number
) => {
  const maxX = getMaxX(pattern);
  for (let x = 0; x < maxX; x++) {
    if (x === answerToIgnore) continue;
    if (isVerticalReflection(pattern, x)) return x;
  }
};

const tryGetHorizontalLineOfReflection = (
  pattern: Pattern,
  answerToIgnore?: number
) => {
  const maxY = getMaxY(pattern);
  for (let y = 0; y < maxY; y++) {
    if (y === answerToIgnore) continue;
    if (isHorizontalReflection(pattern, y)) return y;
  }
};

const tryGetLineOfReflection = (
  pattern: Pattern,
  answerToIgnore?: { type: "x" | "y"; value: number }
): { type: "x" | "y"; value: number } | { type: "unsolvable" } => {
  const maybeVerticalLineOfReflection = tryGetVerticalLineOfReflection(
    pattern,
    answerToIgnore !== undefined && answerToIgnore.type === "x"
      ? answerToIgnore.value
      : undefined
  );
  if (maybeVerticalLineOfReflection !== undefined)
    return { type: "x", value: maybeVerticalLineOfReflection };

  const maybeHorizontalLineOfReflection = tryGetHorizontalLineOfReflection(
    pattern,
    answerToIgnore !== undefined && answerToIgnore.type === "y"
      ? answerToIgnore.value
      : undefined
  );
  if (maybeHorizontalLineOfReflection !== undefined)
    return { type: "y", value: maybeHorizontalLineOfReflection };

  return { type: "unsolvable" };
};

const solvePart1Pattern = (
  pattern: Pattern
): { type: "x" | "y"; value: number } => {
  const maybeLineOfReflection = tryGetLineOfReflection(pattern);

  if (maybeLineOfReflection.type === "unsolvable")
    throw new Error("No vertical or horizontal lines of reflection found");

  return maybeLineOfReflection;
};

const solvePart1 = (patterns: Pattern[]) =>
  patterns
    .map(solvePart1Pattern)
    .map(({ type, value }) => (type === "x" ? value + 1 : (value + 1) * 100))
    .reduce((a, b) => a + b, 0);

const swapValue = (pattern: Pattern, x: number, y: number) => {
  const currentValue = pattern[x]![y]!;
  pattern[x]![y] = currentValue === "#" ? "." : "#";
};

const solvePart2Pattern = (
  pattern: Pattern
): { type: "x" | "y"; value: number } => {
  const smudgedAnswer = solvePart1Pattern(pattern);

  const maxX = getMaxX(pattern);
  const maxY = getMaxY(pattern);

  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      swapValue(pattern, x, y);

      const maybeFixedAnswer = tryGetLineOfReflection(pattern, smudgedAnswer);

      if (maybeFixedAnswer.type !== "unsolvable") {
        swapValue(pattern, x, y);
        return maybeFixedAnswer;
      }

      swapValue(pattern, x, y);
    }
  }

  throw new Error("No fixed answer found");
};

const solvePart2 = (patterns: Pattern[]) =>
  patterns
    .map(solvePart2Pattern)
    .map(({ type, value }) => (type === "x" ? value + 1 : (value + 1) * 100))
    .reduce((a, b) => a + b, 0);

const file = readFile("src/13/inputs/input.txt");
const patterns = file
  .split("\n\n")
  .map((block) => parseLinesToPattern(block.split("\n")));

const part1 = solvePart1(patterns);
console.log("Part 1:", part1);

const part2 = solvePart2(patterns);
console.log("Part 2:", part2);
