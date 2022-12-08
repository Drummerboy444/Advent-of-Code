import { emptyArray, sumArray } from "../utils/arrays";
import { readLines } from "../utils/file-reading";
import { sortNumbers } from "../utils/sorting";

type ChangeDirectory = {
  type: "ChangeDirectory";
  directory: string;
};

type List = {
  type: "List";
};

type Directory = {
  type: "Directory";
  name: string;
};

type File = {
  type: "File";
  name: string;
  size: number;
};

type Line = ChangeDirectory | List | Directory | File;

const processChangeDirectory = (rawLine: string): ChangeDirectory => ({
  type: "ChangeDirectory",
  directory: rawLine.split(" ")[2],
});

const processList = (): List => ({
  type: "List",
});

const processDirectory = (rawLine: string): Directory => ({
  type: "Directory",
  name: rawLine.split(" ")[1],
});

const processFile = (rawLine: string): File => ({
  type: "File",
  name: rawLine.split(" ")[1],
  size: Number(rawLine.split(" ")[0]),
});

const toLine = (rawLine: string): Line => {
  const split = rawLine.split(" ");

  if (split[0] === "$" && split[1] === "cd")
    return processChangeDirectory(rawLine);

  if (split[0] === "$" && split[1] === "ls") return processList();

  if (split[0] === "dir") return processDirectory(rawLine);

  return processFile(rawLine);
};

type FileStructure = {
  [name: string]: FileStructure | number;
};

const getDirectory = (fileStructure: FileStructure, path: string[]) => {
  let directory = fileStructure;

  path.forEach((directoryName) => {
    const nextDirectory = directory[directoryName];

    if (typeof nextDirectory === "number") {
      throw new Error("Path to directory contained a file");
    }

    directory = nextDirectory;
  });

  return directory;
};

const buildFileStructure = (lines: Line[]): FileStructure => {
  const fileStructure = {};
  const currentPath: string[] = [];

  lines.forEach((line) => {
    if (line.type === "ChangeDirectory") {
      if (line.directory === "/") emptyArray(currentPath);
      else if (line.directory === "..") currentPath.pop();
      else currentPath.push(line.directory);
    }

    if (line.type === "Directory") {
      const currentDirectory = getDirectory(fileStructure, currentPath);
      if (!(line.name in currentDirectory)) {
        currentDirectory[line.name] = {};
      }
    }

    if (line.type === "File") {
      const currentDirectory = getDirectory(fileStructure, currentPath);
      currentDirectory[line.name] = line.size;
    }
  });

  return fileStructure;
};

const getSize = (fileStructure: FileStructure): number =>
  Object.values(fileStructure).reduce<number>(
    (previous, current) =>
      previous + (typeof current === "number" ? current : getSize(current)),
    0
  );

const getFileStructuresAtMost = (
  fileStructure: FileStructure,
  size: number
) => {
  const fileStructures = getSize(fileStructure) <= size ? [fileStructure] : [];

  Object.values(fileStructure).forEach((value) => {
    if (typeof value === "number") return;
    fileStructures.push(...getFileStructuresAtMost(value, size));
  });

  return fileStructures;
};

const lines = readLines("src/07/input.txt", toLine);
const fileStructure = buildFileStructure(lines);

export const part1 = sumArray(
  getFileStructuresAtMost(fileStructure, 100_000).map(getSize)
);
console.log("Part 1:", part1);

const usedSpace = getSize(fileStructure);
const unusedSpace = 70_000_000 - usedSpace;
const requiredSpace = 30_000_000 - unusedSpace;

const allFileStructureSizes = getFileStructuresAtMost(
  fileStructure,
  Number.POSITIVE_INFINITY
).map(getSize);

const geq = (b: number) => (a: number) => a >= b;
const isGeqRequiredSpace = geq(requiredSpace);

export const part2 = sortNumbers(
  allFileStructureSizes.filter(isGeqRequiredSpace),
  "asc"
)[0];
console.log("Part 2:", part2);
