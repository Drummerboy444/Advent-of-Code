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

const solvePart2 = (input: ParsedInput) => {
  const seedPairs: [number, number][] = [];

  for (let i = 0; i < input.seeds.length / 2; i += 2) {
    const start = input.seeds[i];
    const length = input.seeds[i + 1];
    if (start === undefined || length === undefined) throw new Error();
    seedPairs.push([start, length]);
  }

  let minLocationNumber = Infinity;
  let computationCount = 0;
  const totalRequiredComputationCount = seedPairs
    .map(([_, length]) => length)
    .reduce((a, b) => a + b, 0);

  seedPairs.forEach(([start, length]) => {
    let x = start;
    while (x < start + length) {
      if (computationCount % 1_000_000 === 0)
        console.log(
          `Computing: ${Math.round(
            (computationCount / totalRequiredComputationCount) * 100
          )}% complete`
        );

      const loc = getLocationNumber(x, input.almanacMaps);
      if (loc < minLocationNumber) minLocationNumber = loc;

      computationCount++;
      x++;
    }
  });

  return minLocationNumber;
};

const file = readFile("src/05/inputs/input.txt");
const parsedInput = parseFile(file);

console.log("Part 1:", solvePart1(parsedInput));
console.log("Part 2:", solvePart2(parsedInput));
