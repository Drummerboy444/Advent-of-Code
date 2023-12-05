import { readFile } from "../utils/file-reading";

type AlmanacMapEntry = {
  sourceRangeStart: number;
  destinationRangeStart: number;
  rangeLength: number;
};

type AlmanacMap = AlmanacMapEntry[];

type ParsedInput = {
  seeds: number[];
  almanacMaps: AlmanacMap[];
};

const DIGITS_REGEX = /(\d+)/g;

const parseSeedString = (seedString: string) =>
  [...seedString.matchAll(DIGITS_REGEX)].map(([seed]) => parseInt(seed));

const parseMapString = (mapString: string): AlmanacMap => {
  const [_, ...rows] = mapString.split("\n");

  return rows.map((row) => {
    const [destinationRangeStart, sourceRangeStart, rangeLength] = row
      .split(" ")
      .map((x) => parseInt(x));

    if (
      destinationRangeStart === undefined ||
      sourceRangeStart === undefined ||
      rangeLength === undefined
    )
      throw new Error("Invalid map row");

    return { destinationRangeStart, sourceRangeStart, rangeLength };
  });
};

const parseFile = (file: string): ParsedInput => {
  const [seedsString, ...mapStrings] = file.split("\n\n");

  if (seedsString === undefined) throw new Error("No seed block found");

  return {
    seeds: parseSeedString(seedsString),
    almanacMaps: mapStrings.map(parseMapString),
  };
};

const getDestinationNumber = (
  sourceNumber: number,
  map: AlmanacMap
): number => {
  const almanacMapEntry = map.find(
    ({ sourceRangeStart, rangeLength }) =>
      sourceRangeStart <= sourceNumber &&
      sourceRangeStart + rangeLength > sourceNumber
  );

  return almanacMapEntry === undefined
    ? sourceNumber
    : almanacMapEntry.destinationRangeStart +
        sourceNumber -
        almanacMapEntry.sourceRangeStart;
};

const getLocationNumber = (seedNumber: number, maps: AlmanacMap[]) => {
  return maps.reduce(getDestinationNumber, seedNumber);
};

const solvePart1 = (input: ParsedInput) => {
  const locationNumbers = input.seeds.map((seed) =>
    getLocationNumber(seed, input.almanacMaps)
  );
  return Math.min(...locationNumbers);
};

const file = readFile("src/05/inputs/input.txt");
const parsedInput = parseFile(file);
console.log("Part 1:", solvePart1(parsedInput));
