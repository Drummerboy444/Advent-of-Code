import { readLines } from "../utils/file-reading";

const parseLine = (line: string) => line.split(" ").map((s) => parseInt(s));

const getNextRow = (row: number[]) => {
  const nextRow = [];

  for (let i = 1; i < row.length; i++) {
    const r1 = row[i - 1];
    const r2 = row[i];
    if (r1 === undefined || r2 === undefined) throw new Error();

    nextRow.push(r2 - r1);
  }

  return nextRow;
};

const getAllRows = (history: number[]) => {
  const rows: number[][] = [[...history]];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const lastRow = rows[rows.length - 1];
    if (lastRow === undefined) throw new Error();
    if (lastRow.every((value) => value === 0)) break;
    rows.push(getNextRow(lastRow));
  }

  return rows;
};

const predictNextValue = (history: number[]) => {
  const rows = getAllRows(history);

  for (let i = rows.length - 2; i >= 0; i--) {
    const row = rows[i];
    const previousRow = rows[i + 1];
    if (row === undefined || previousRow === undefined) throw new Error();

    const rowLastValue = row[row.length - 1];
    const previousRowLastValue = previousRow[previousRow.length - 1];
    if (rowLastValue === undefined || previousRowLastValue === undefined)
      throw new Error();

    row.push(rowLastValue + previousRowLastValue);
  }

  const firstRow = rows[0];
  if (firstRow === undefined) throw new Error();

  const nextValue = firstRow[firstRow.length - 1];
  if (nextValue === undefined) throw new Error();

  return nextValue;
};

const predictPreviousValue = (history: number[]) => {
  const rows = getAllRows(history);

  for (let i = rows.length - 2; i >= 0; i--) {
    const row = rows[i];
    const previousRow = rows[i + 1];
    if (row === undefined || previousRow === undefined) throw new Error();

    const rowFirstValue = row[0];
    const previousRowFirstValue = previousRow[0];
    if (rowFirstValue === undefined || previousRowFirstValue === undefined)
      throw new Error();

    row.unshift(rowFirstValue - previousRowFirstValue);
  }

  const firstRow = rows[0];
  if (firstRow === undefined) throw new Error();

  const previousValue = firstRow[0];
  if (previousValue === undefined) throw new Error();

  return previousValue;
};

const lines = readLines("src/09/inputs/input.txt");
const histories = lines.map(parseLine);

const part1 = histories.map(predictNextValue).reduce((a, b) => a + b, 0);
console.log("Part 1:", part1);

const part2 = histories.map(predictPreviousValue).reduce((a, b) => a + b, 0);
console.log("Part 2:", part2);
