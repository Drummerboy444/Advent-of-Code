import { readFile } from "../utils/file-reading";

const dataStream = readFile("src/06/input.txt");

const containsUniqueCharacters = (s: string) => {
  for (let i = 0; i < s.length - 1; i++) {
    if (s.substring(i + 1, s.length).includes(s[i])) {
      return false;
    }
  }
  return true;
};

const getMarker = (distinctCharacterCount: number) => (dataStream: string) => {
  for (let i = distinctCharacterCount; i <= dataStream.length; i++) {
    const lastN = dataStream.substring(i - distinctCharacterCount, i);
    if (containsUniqueCharacters(lastN)) {
      return i;
    }
  }

  throw new Error("No marker found");
};

const getPacketMarker = getMarker(4);
export const part1 = getPacketMarker(dataStream);
console.log("Part 1:", part1);

const getMessageMarker = getMarker(14);
export const part2 = getMessageMarker(dataStream);
console.log("Part 2:", part2);
