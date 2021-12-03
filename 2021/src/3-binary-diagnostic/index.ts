import { readLines } from "../utils/file-reading";

const diagnosticReport = readLines("src/3-binary-diagnostic/input.txt");
const lineLength = diagnosticReport[0].length;

const getBitCount = (
  diagnosticReport: Array<string>,
  column: number,
  bit: string
): number => diagnosticReport.filter((line) => line[column] == bit).length;

const getMostCommonBit = (
  diagnosticReport: Array<string>,
  column: number
): string => {
  const ones = getBitCount(diagnosticReport, column, "1");
  const zeros = getBitCount(diagnosticReport, column, "0");

  return ones >= zeros ? "1" : "0";
};

const getLeastCommonBit = (
  diagnosticReport: Array<string>,
  column: number
): string => {
  const ones = getBitCount(diagnosticReport, column, "1");
  const zeros = getBitCount(diagnosticReport, column, "0");

  return zeros <= ones ? "0" : "1";
};

const getGammaRate = (diagnosticReport: Array<string>): number => {
  let gammaRate = "";

  for (let i = 0; i < lineLength; i++) {
    gammaRate += getMostCommonBit(diagnosticReport, i);
  }

  return parseInt(gammaRate, 2);
};

const getEpsilonRate = (diagnosticReport: Array<string>): number => {
  let gammaRate = "";

  for (let i = 0; i < lineLength; i++) {
    gammaRate += getLeastCommonBit(diagnosticReport, i);
  }

  return parseInt(gammaRate, 2);
};

console.log(
  `Part 1: ${getGammaRate(diagnosticReport) * getEpsilonRate(diagnosticReport)}`
);

const getNextOxygenGeneratorLines = (
  lines: Array<string>,
  column: number
): Array<string> => {
  const mostCommonBit = getMostCommonBit(lines, column);
  return lines.filter((line) => line[column] == mostCommonBit);
};

const getOxygenGeneratorRating = (diagnosticReport: Array<string>): number => {
  let column = 0;
  while (diagnosticReport.length != 1) {
    diagnosticReport = getNextOxygenGeneratorLines(diagnosticReport, column);
    column++;
  }

  return parseInt(diagnosticReport[0], 2);
};

const getNextCO2ScrubberLines = (
  lines: Array<string>,
  column: number
): Array<string> => {
  const mostCommonBit = getLeastCommonBit(lines, column);
  return lines.filter((line) => line[column] == mostCommonBit);
};

const getCO2ScrubberRating = (diagnosticReport: Array<string>): number => {
  let column = 0;
  while (diagnosticReport.length != 1) {
    diagnosticReport = getNextCO2ScrubberLines(diagnosticReport, column);
    column++;
  }

  return parseInt(diagnosticReport[0], 2);
};

console.log(
  `Part 2: ${
    getOxygenGeneratorRating(diagnosticReport) *
    getCO2ScrubberRating(diagnosticReport)
  }`
);
