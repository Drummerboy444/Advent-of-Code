import { readLines } from "../utils/file-reading";

const lines = readLines(1);
const mappedLines = readLines(1, (line) => Number(line));

console.log("Input:", lines);
console.log("Mapped input:", mappedLines);
