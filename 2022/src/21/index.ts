import { readLines } from "../utils/file-reading";

type Operation = "+" | "-" | "*" | "/";

type Monkey = OperationMonkey | ConstantMonkey;

type OperationMonkey = {
  type: "operation";
  name: string;
  operation: Operation;
  children: [Monkey, Monkey];
};

type ConstantMonkey = {
  type: "constant";
  name: string;
  value: number;
};

const toMonkey = <T extends string>(
  name: T,
  flatMonkeyLookup: Record<
    string,
    | number
    | {
        operation: Operation;
        childrenNames: [string, string];
      }
  >
): Monkey & { name: T } => {
  const value = flatMonkeyLookup[name];

  if (typeof value === "number") {
    return {
      type: "constant",
      name,
      value,
    };
  }

  return {
    type: "operation",
    name,
    operation: value.operation,
    children: [
      toMonkey(value.childrenNames[0], flatMonkeyLookup),
      toMonkey(value.childrenNames[1], flatMonkeyLookup),
    ],
  };
};

const toMonkeys = (lines: string[]): Monkey & { name: "root" } => {
  const flatMonkeyLookup: Record<
    string,
    | number
    | {
        operation: Operation;
        childrenNames: [string, string];
      }
  > = {};

  lines.forEach((line) => {
    const split = line.split(": ");
    const name = split[0];
    const right = split[1];
    if (!isNaN(Number(right))) {
      flatMonkeyLookup[name] = Number(right);
      return;
    }
    if (right.includes("+")) {
      const childrenNames = right.split(" + ") as [string, string];
      flatMonkeyLookup[name] = { operation: "+", childrenNames };
      return;
    }
    if (right.includes("-")) {
      const childrenNames = right.split(" - ") as [string, string];
      flatMonkeyLookup[name] = { operation: "-", childrenNames };
      return;
    }
    if (right.includes("*")) {
      const childrenNames = right.split(" * ") as [string, string];
      flatMonkeyLookup[name] = { operation: "*", childrenNames };
      return;
    }
    const childrenNames = right.split(" / ") as [string, string];
    flatMonkeyLookup[name] = { operation: "/", childrenNames };
  });

  return toMonkey("root", flatMonkeyLookup);
};

const evaluate = (monkey: Monkey): number => {
  if (monkey.type === "constant") return monkey.value;

  const childValue1 = evaluate(monkey.children[0]);
  const childValue2 = evaluate(monkey.children[1]);

  if (monkey.operation === "+") return childValue1 + childValue2;
  if (monkey.operation === "-") return childValue1 - childValue2;
  if (monkey.operation === "*") return childValue1 * childValue2;
  return childValue1 / childValue2;
};

const lines = readLines("src/21/inputs/input.txt");
const root = toMonkeys(lines);

export const part1 = evaluate(root);
console.log("Part 1:", part1);

export const part2 = 456;
console.log("Part 2:", part2);
