import { readNumbers } from "../utils/file-reading";

const depths = readNumbers("src/1-sonar-sweep/input.txt");

let increases = 0;

for (let i = 1; i < depths.length; i++) {
  if (depths[i] - depths[i - 1] > 0) {
    increases++;
  }
}

console.log(`Part 1: ${increases}`);

let windowIncreases = 0;

for (let i = 3; i < depths.length; i++) {
  if (depths[i] - depths[i - 3] > 0) {
    windowIncreases++;
  }
}

console.log(`Part 2: ${windowIncreases}`);
