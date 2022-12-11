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

const getNextWorryLevel = (worryLevel: number, operation: Operation) => {
  const modifier = operation[2] === "old" ? worryLevel : operation[2];
  const modifiedWorryLevel =
    operation[1] === "*" ? worryLevel * modifier : worryLevel + modifier;
  return Math.floor(modifiedWorryLevel / 3);
};

const getItemPasses = (monkey: Monkey) => {
  const itemPasses: Record<number, number[]> = {};

  monkey.worryLevels.forEach((worryLevel) => {
    const nextWorryLevel = getNextWorryLevel(worryLevel, monkey.operation);
    const nextMonkey =
      nextWorryLevel % monkey.divisibilityTest === 0
        ? monkey.ifTrue
        : monkey.ifFalse;
    if (!(nextMonkey in itemPasses)) itemPasses[nextMonkey] = [];
    itemPasses[nextMonkey].push(nextWorryLevel);
  });

  return itemPasses;
};

const takeRound = (monkeys: Monkey[]) => {
  const inspections: Record<number, number> = {};
  monkeys.forEach((_, i) => (inspections[i] = 0));

  monkeys.forEach((monkey, i) => {
    inspections[i] += monkey.worryLevels.length;
    const itemPasses = getItemPasses(monkey);

    Object.entries(itemPasses).forEach(([k, v]) => {
      monkeys[Number(k)].worryLevels.push(...v);
    });

    monkey.worryLevels = [];
  });

  return inspections;
};

const monkeys = readFile("src/11/input.txt").split("\n\n").map(parseToMonkey);

const inspections: Record<number, number> = {};
monkeys.forEach((_, i) => (inspections[i] = 0));

for (let i = 0; i < 20; i++) {
  const roundInspections = takeRound(monkeys);
  Object.entries(roundInspections).forEach(([k, v]) => {
    inspections[Number(k)] += v;
  });
}

const sortedInspectionValues = sortNumbers(Object.values(inspections), "desc");

export const part1 = sortedInspectionValues[0] * sortedInspectionValues[1];
console.log("Part 1:", part1);

export const part2 = 456;
console.log("Part 2:", part2);
