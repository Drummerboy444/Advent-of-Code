import {
  CoordinateSystem,
  copy,
  getMaxX,
  getMaxY,
  getValue,
  setValue,
  stringify,
  toCoordinatesWithValues,
} from "../utils/coordinate-system";
import { readLines } from "../utils/file-reading";

type PlatformItem = "O" | "." | "#";
type Platform = CoordinateSystem<PlatformItem>;

const parseLinesToPlatform = (lines: string[]): Platform => {
  const platform: Platform = {};

  lines.forEach((line, y) => {
    line.split("").forEach((character, x) => {
      setValue(platform, { x, y }, character);
    });
  });

  return platform;
};

const tiltPlatformNorth = (platform: Platform) => {
  const maxX = getMaxX(platform);
  const maxY = getMaxY(platform);

  for (let x = 0; x <= maxX; x++) {
    let lastBlockingItemIndex = -1;
    for (let y = 0; y <= maxY; y++) {
      const value = getValue(platform, { x, y });
      if (value === ".") continue;
      if (value === "#") {
        lastBlockingItemIndex = y;
        continue;
      }

      setValue(platform, { x, y }, ".");
      setValue(platform, { x, y: lastBlockingItemIndex + 1 }, "O");
      lastBlockingItemIndex++;
    }
  }
};

const tiltPlatformSouth = (platform: Platform) => {
  const maxX = getMaxX(platform);
  const maxY = getMaxY(platform);

  for (let x = 0; x <= maxX; x++) {
    let lastBlockingItemIndex = maxY + 1;
    for (let y = maxY; y >= 0; y--) {
      const value = getValue(platform, { x, y });
      if (value === ".") continue;
      if (value === "#") {
        lastBlockingItemIndex = y;
        continue;
      }

      setValue(platform, { x, y }, ".");
      setValue(platform, { x, y: lastBlockingItemIndex - 1 }, "O");
      lastBlockingItemIndex--;
    }
  }
};

const tiltPlatformEast = (platform: Platform) => {
  const maxX = getMaxX(platform);
  const maxY = getMaxY(platform);

  for (let y = 0; y <= maxY; y++) {
    let lastBlockingItemIndex = maxX + 1;
    for (let x = maxX; x >= 0; x--) {
      const value = getValue(platform, { x, y });
      if (value === ".") continue;
      if (value === "#") {
        lastBlockingItemIndex = x;
        continue;
      }

      setValue(platform, { x, y }, ".");
      setValue(platform, { x: lastBlockingItemIndex - 1, y }, "O");
      lastBlockingItemIndex--;
    }
  }
};

const tiltPlatformWest = (platform: Platform) => {
  const maxX = getMaxX(platform);
  const maxY = getMaxY(platform);

  for (let y = 0; y <= maxY; y++) {
    let lastBlockingItemIndex = -1;
    for (let x = 0; x <= maxX; x++) {
      const value = getValue(platform, { x, y });
      if (value === ".") continue;
      if (value === "#") {
        lastBlockingItemIndex = x;
        continue;
      }

      setValue(platform, { x, y }, ".");
      setValue(platform, { x: lastBlockingItemIndex + 1, y }, "O");
      lastBlockingItemIndex++;
    }
  }
};

const getTotalLoad = (platform: Platform) => {
  const maxY = getMaxY(platform);

  return toCoordinatesWithValues(platform)
    .map(({ coordinate: { y }, value }) => (value === "O" ? maxY + 1 - y : 0))
    .reduce((a, b) => a + b, 0);
};

const runSpinCycle = (platform: Platform) => {
  tiltPlatformNorth(platform);
  tiltPlatformWest(platform);
  tiltPlatformSouth(platform);
  tiltPlatformEast(platform);
};

const solvePart2 = (platform: Platform) => {
  const seenPlatformIndexes: Record<string, number> = {
    [stringify(platform, (s) => s)]: 0,
  };
  const totalLoads: number[] = [getTotalLoad(platform)];

  for (let i = 1; i <= 1_000_000_000; i++) {
    runSpinCycle(platform);

    const stringifiedPlatform = stringify(platform, (s) => s);
    const cycleStartIndex = seenPlatformIndexes[stringifiedPlatform];

    if (cycleStartIndex !== undefined) {
      const cycleLength = i - cycleStartIndex;
      const startPosition = cycleStartIndex;
      const remainingAfterStart = 1_000_000_000 - startPosition;
      const cycleLoops = Math.floor(remainingAfterStart / cycleLength);
      const remainingAfterCycleLoops =
        1_000_000_000 - startPosition - cycleLoops * cycleLength;
      return totalLoads[startPosition + remainingAfterCycleLoops];
    }

    seenPlatformIndexes[stringifiedPlatform] = i;
    totalLoads.push(getTotalLoad(platform));
  }

  throw new Error();
};

const lines = readLines("src/14/inputs/input.txt");
const platform = parseLinesToPlatform(lines);

const part1PlatformCopy = copy(platform);
tiltPlatformNorth(part1PlatformCopy);
const part1 = getTotalLoad(part1PlatformCopy);
console.log("Part 1:", part1);

const part2PlatformCopy = copy(platform);
const part2 = solvePart2(part2PlatformCopy);
console.log("Part 2:", part2);
