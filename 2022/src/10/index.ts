import { sumArray } from "../utils/arrays";
import { readLines } from "../utils/file-reading";
import { CPU } from "./cpu";
import { CRT } from "./crt";
import { parseLineToInstruction } from "./instructions";

const instructions = readLines("src/10/input.txt", parseLineToInstruction);

const cpu = new CPU(instructions);
const crt = new CRT();

const signalStrengths: number[] = [];

for (let i = 1; i <= 240; i++) {
  if ((i - 20) % 40 === 0) {
    signalStrengths.push(i * cpu.getX());
  }

  crt.runCycle(cpu.getX());
  cpu.runCycle();
}

// BACEKLHF
crt.render();

export const part1 = sumArray(signalStrengths);
console.log("Part 1:", part1);

export const part2 = "BACEKLHF";
console.log("Part 2:", part2);
