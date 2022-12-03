import { readLines } from "../utils/file-reading";

const lines = readLines("src/03/input.txt");
const rucksacks = lines.map(
  (line) =>
    [line.slice(0, line.length / 2), line.slice(line.length / 2)] as const
);

const getCommonLetter = ([s1, ...rest]: readonly string[]) => {
  for (const c of s1) {
    if (rest.every((s2) => s2.includes(c))) {
      return c;
    }
  }

  throw new Error("No common letter found");
};

const commonLetters = rucksacks.map(getCommonLetter);

const getLetterPriority = (c: string) => {
  const charCode = c.charCodeAt(0);
  return charCode >= 97 ? charCode - 96 : charCode - 38;
};

const priorities = commonLetters.map(getLetterPriority);
console.log(
  "Part 1:",
  priorities.reduce((a, b) => a + b, 0)
);

const groups = [];
for (let i = 0; i < lines.length / 3; i++) {
  groups.push([lines[i * 3], lines[i * 3 + 1], lines[i * 3 + 2]]);
}

const commonLettersInGroups = groups.map(getCommonLetter);
const groupPriorities = commonLettersInGroups.map(getLetterPriority);
console.log(
  "Part 2:",
  groupPriorities.reduce((a, b) => a + b, 0)
);
