import { readFile } from "../utils/file-reading";

const hash = (string: string) =>
  string
    .split("")
    .reduce(
      (currentValue, character) =>
        ((currentValue + character.charCodeAt(0)) * 17) % 256,
      0
    );

const file = readFile("src/15/inputs/input.txt");
const initialisationSequence = file.split(",");

const part1 = initialisationSequence.map(hash).reduce((a, b) => a + b, 0);
console.log("Part 1:", part1);
