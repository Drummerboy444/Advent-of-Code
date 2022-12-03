import { chunksOf, sumArray } from "../utils/arrays";
import { readLines } from "../utils/file-reading";

const lines = readLines("src/03/input.txt");

const getCommonLetter = ([string, ...rest]: string[]) => {
  for (const character of string) {
    if (rest.every((otherString) => otherString.includes(character))) {
      return character;
    }
  }

  throw new Error("No common letter found");
};

const getLetterPriority = (character: string) => {
  const characterCode = character.charCodeAt(0);
  return characterCode >= 97 ? characterCode - 96 : characterCode - 38;
};

const rucksacks = lines.map((line) => [
  line.slice(0, line.length / 2),
  line.slice(line.length / 2),
]);

const rucksackPriorities = rucksacks
  .map(getCommonLetter)
  .map(getLetterPriority);

export const part1 = sumArray(rucksackPriorities);
console.log("Part 1:", part1);

const groupPriorities = chunksOf(lines, 3)
  .map(getCommonLetter)
  .map(getLetterPriority);

export const part2 = sumArray(groupPriorities);
console.log("Part 2:", part2);
