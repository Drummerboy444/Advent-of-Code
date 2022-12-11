import { readFile } from "../utils/file-reading";
import { sortNumbers } from "../utils/sorting";

type Operation = ["old", "*" | "+", "old" | number];

type Monkey = {
  worryLevels: number[];
  operation: Operation;
  divisibilityTest: number;
  ifTrue: number;
  ifFalse: number;
};

const getLastAsNumber = (s: string) => {
  const split = s.split(" ");
  return Number(split[split.length - 1]);
};

const parseToMonkey = (rawMonkey: string): Monkey => {
  const lines = rawMonkey.split("\n").map((s) => s.trim());

  const worryLevels = lines[1].split(": ")[1].split(", ").map(Number);
  const operation = lines[2]
    .split(" = ")[1]
    .split(" ")
    .map((s) => (isNaN(Number(s)) ? s : Number(s))) as Operation;
  const divisibilityTest = getLastAsNumber(lines[3]);
  const ifTrue = getLastAsNumber(lines[4]);
  const ifFalse = getLastAsNumber(lines[5]);

  return { worryLevels, operation, divisibilityTest, ifTrue, ifFalse };
};

const getNextWorryLevel = (
  worryLevel: number,
  operation: Operation,
  withDivide: boolean
) => {
  const modifier = operation[2] === "old" ? worryLevel : operation[2];
  const modifiedWorryLevel =
    operation[1] === "*" ? worryLevel * modifier : worryLevel + modifier;
  return withDivide ? Math.floor(modifiedWorryLevel / 3) : modifiedWorryLevel;
};

const getItemPasses = (monkey: Monkey, withDivide: boolean) => {
  const itemPasses: Record<number, number[]> = {};

  monkey.worryLevels.forEach((worryLevel) => {
    const nextWorryLevel = getNextWorryLevel(
      worryLevel,
      monkey.operation,
      withDivide
    );
    const nextMonkey =
      nextWorryLevel % monkey.divisibilityTest === 0
        ? monkey.ifTrue
        : monkey.ifFalse;
    if (!(nextMonkey in itemPasses)) itemPasses[nextMonkey] = [];
    itemPasses[nextMonkey].push(nextWorryLevel);
  });

  return itemPasses;
};

const takeRound = (monkeys: Monkey[], withDivide: boolean) => {
  const inspections: Record<number, number> = {};

  monkeys.forEach((monkey, i) => {
    inspections[i] = monkey.worryLevels.length;
    const itemPasses = getItemPasses(monkey, withDivide);

    Object.entries(itemPasses).forEach(([k, v]) => {
      monkeys[Number(k)].worryLevels.push(...v);
    });

    monkey.worryLevels = [];
  });

  return inspections;
};

const getInspectionsAfter = (
  monkeys: Monkey[],
  rounds: number,
  withDivide: boolean
) => {
  const inspections: Record<number, number> = {};
  monkeys.forEach((_, i) => (inspections[i] = 0));

  const divisibilityTestProduct = monkeys
    .map(({ divisibilityTest }) => divisibilityTest)
    .reduce((a, b) => a * b, 1);

  for (let i = 0; i < rounds; i++) {
    const roundInspections = takeRound(monkeys, withDivide);
    Object.entries(roundInspections).forEach(([k, v]) => {
      inspections[Number(k)] += v;
    });

    monkeys.forEach((monkey) => {
      monkey.worryLevels = monkey.worryLevels.map(
        (worryLevel) => worryLevel % divisibilityTestProduct
      );
    });
  }

  return inspections;
};

const monkeys = readFile("src/11/input.txt").split("\n\n").map(parseToMonkey);
const inspections = getInspectionsAfter(monkeys, 20, true);
const sortedInspectionValues = sortNumbers(Object.values(inspections), "desc");

export const part1 = sortedInspectionValues[0] * sortedInspectionValues[1];
console.log("Part 1:", part1);

const monkeys2 = readFile("src/11/input.txt").split("\n\n").map(parseToMonkey);
const inspections2 = getInspectionsAfter(monkeys2, 10_000, false);
const sortedInspectionValues2 = sortNumbers(
  Object.values(inspections2),
  "desc"
);

export const part2 = sortedInspectionValues2[0] * sortedInspectionValues2[1];
console.log("Part 2:", part2);
