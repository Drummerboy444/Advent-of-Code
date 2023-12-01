import { readLines } from "../utils/file-reading";

const lines = readLines("src/01/inputs/input.txt");

const solvePartOne = (lines: string[]) => {
  const numbersOnly = lines
    .map((line) => line.split(""))
    .map((line) =>
      line
        .map((character) => parseInt(character))
        .filter((number) => !isNaN(number))
    );

  return numbersOnly
    .map((numbersOnlyLine) =>
      parseInt(
        `${numbersOnlyLine[0]}${numbersOnlyLine[numbersOnlyLine.length - 1]}`
      )
    )
    .reduce((a, b) => a + b, 0);
};

console.log("Part 1:", solvePartOne(lines));

const STRING_NUMBER_LOOKUP: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const replaceStringsWithDigits = (line: string) => {
  let replacedLine = "";

  for (let i = 0; i < line.length; i++) {
    const threeLetters = `${line[i]}${line[i + 1]}${line[i + 2]}`;
    const fourLetters = `${line[i]}${line[i + 1]}${line[i + 2]}${line[i + 3]}`;
    const fiveLetters = `${line[i]}${line[i + 1]}${line[i + 2]}${line[i + 3]}${
      line[i + 4]
    }`;

    if (threeLetters in STRING_NUMBER_LOOKUP) {
      replacedLine += STRING_NUMBER_LOOKUP[threeLetters];
    } else if (fourLetters in STRING_NUMBER_LOOKUP) {
      replacedLine += STRING_NUMBER_LOOKUP[fourLetters];
    } else if (fiveLetters in STRING_NUMBER_LOOKUP) {
      replacedLine += STRING_NUMBER_LOOKUP[fiveLetters];
    } else {
      replacedLine += line[i];
    }
  }

  return replacedLine;
};

const linesWithWordsReplaced = lines.map(replaceStringsWithDigits);

console.log("Part 2:", solvePartOne(linesWithWordsReplaced));
