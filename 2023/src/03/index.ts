import { readLines } from "../utils/file-reading";

const lines = readLines("src/03/inputs/input.txt");

type EngineSchematicCell =
  | {
      type: "NUMBER";
      width: number;
      value: number;
    }
  | {
      type: "NUMBER_CHILD";
      value: number;
    }
  | {
      type: "SYMBOL";
      value: string;
    }
  | {
      type: "EMPTY_CELL";
    };

type EngineSchematicRow = EngineSchematicCell[];
type EngineSchematic = EngineSchematicRow[];

const DIGIT_REGEX = /\d/;

const parseLineToEngineSchematicRow = (line: string): EngineSchematicRow => {
  const engineSchematicRow: EngineSchematicRow = [];

  const addNumberCell = (value: string) => {
    engineSchematicRow.push(
      {
        type: "NUMBER",
        width: value.length,
        value: parseInt(value),
      },
      ...Array.from({ length: value.length - 1 }).map(() => ({
        type: "NUMBER_CHILD" as const,
        value: parseInt(value),
      }))
    );
  };

  let potentialNumber = "";

  for (let i = 0; i < line.length; i++) {
    const character = line[i];

    if (character === undefined) {
      throw new Error("Error iterating over list");
    }

    if (DIGIT_REGEX.test(character)) {
      potentialNumber += character;
      continue;
    }

    if (potentialNumber !== "") {
      addNumberCell(potentialNumber);
      potentialNumber = "";
    }

    if (character === ".") {
      engineSchematicRow.push({ type: "EMPTY_CELL" });
    } else {
      engineSchematicRow.push({ type: "SYMBOL", value: character });
    }

    potentialNumber = "";
  }

  if (potentialNumber !== "") {
    addNumberCell(potentialNumber);
  }

  return engineSchematicRow;
};

const parseLinesToEngineSchematic = (lines: string[]): EngineSchematic => {
  return lines.map(parseLineToEngineSchematicRow);
};

const tryGetCell = (
  engineSchematic: EngineSchematic,
  rowIndex: number,
  cellIndex: number
) => {
  const row = engineSchematic[rowIndex];
  if (row === undefined) return undefined;
  return row[cellIndex];
};

const isPartNumber = (
  engineSchematic: EngineSchematic,
  rowIndex: number,
  cellIndex: number,
  cellWidth: number
) => {
  for (
    let rowIndexToCheck = rowIndex - 1;
    rowIndexToCheck <= rowIndex + 1;
    rowIndexToCheck++
  ) {
    for (
      let cellIndexToCheck = cellIndex - 1;
      cellIndexToCheck <= cellIndex + cellWidth;
      cellIndexToCheck++
    ) {
      const cell = tryGetCell(
        engineSchematic,
        rowIndexToCheck,
        cellIndexToCheck
      );
      if (cell === undefined) {
        continue;
      }
      if (cell.type === "SYMBOL") {
        return true;
      }
    }
  }

  return false;
};

const solvePartOne = (engineSchematic: EngineSchematic) => {
  let sum = 0;

  engineSchematic.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell.type === "NUMBER") {
        const { value, width } = cell;

        if (isPartNumber(engineSchematic, rowIndex, cellIndex, width)) {
          sum += value;
        }
      }
    });
  });

  return sum;
};

const engineSchematic = parseLinesToEngineSchematic(lines);

console.log("Part 1:", solvePartOne(engineSchematic));

const tryGetGearRatio = (
  engineSchematic: EngineSchematic,
  rowIndex: number,
  cellIndex: number
) => {
  const partNumbers: number[] = [];

  const topLeftCell = tryGetCell(engineSchematic, rowIndex - 1, cellIndex - 1);
  const topMiddleCell = tryGetCell(engineSchematic, rowIndex - 1, cellIndex);
  const topRightCell = tryGetCell(engineSchematic, rowIndex - 1, cellIndex + 1);
  const middleLeftCell = tryGetCell(engineSchematic, rowIndex, cellIndex - 1);
  const middleRightCell = tryGetCell(engineSchematic, rowIndex, cellIndex + 1);
  const bottomLeftCell = tryGetCell(
    engineSchematic,
    rowIndex + 1,
    cellIndex - 1
  );
  const bottomMiddleCell = tryGetCell(engineSchematic, rowIndex + 1, cellIndex);
  const bottomRightCell = tryGetCell(
    engineSchematic,
    rowIndex + 1,
    cellIndex + 1
  );

  if (
    topLeftCell !== undefined &&
    (topLeftCell.type === "NUMBER" || topLeftCell.type === "NUMBER_CHILD")
  ) {
    partNumbers.push(topLeftCell.value);
  }

  if (topMiddleCell !== undefined && topMiddleCell.type === "NUMBER") {
    partNumbers.push(topMiddleCell.value);
  }

  if (topRightCell !== undefined && topRightCell.type === "NUMBER") {
    partNumbers.push(topRightCell.value);
  }

  if (
    middleLeftCell !== undefined &&
    (middleLeftCell.type === "NUMBER" || middleLeftCell.type === "NUMBER_CHILD")
  ) {
    partNumbers.push(middleLeftCell.value);
  }

  if (middleRightCell !== undefined && middleRightCell.type === "NUMBER") {
    partNumbers.push(middleRightCell.value);
  }

  if (
    bottomLeftCell !== undefined &&
    (bottomLeftCell.type === "NUMBER" || bottomLeftCell.type === "NUMBER_CHILD")
  ) {
    partNumbers.push(bottomLeftCell.value);
  }

  if (bottomMiddleCell !== undefined && bottomMiddleCell.type === "NUMBER") {
    partNumbers.push(bottomMiddleCell.value);
  }

  if (bottomRightCell !== undefined && bottomRightCell.type === "NUMBER") {
    partNumbers.push(bottomRightCell.value);
  }

  return partNumbers.length === 2 ? partNumbers.reduce((a, b) => a * b, 1) : 0;
};

const solvePartTwo = (engineSchematic: EngineSchematic) => {
  let sum = 0;

  engineSchematic.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell.type === "SYMBOL" && cell.value === "*") {
        const maybeGearRatio = tryGetGearRatio(
          engineSchematic,
          rowIndex,
          cellIndex
        );
        if (maybeGearRatio !== undefined) {
          sum += maybeGearRatio;
        }
      }
    });
  });

  return sum;
};

console.log("Part 2:", solvePartTwo(engineSchematic));
