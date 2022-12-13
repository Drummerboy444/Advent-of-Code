import { sumArray } from "../utils/arrays";
import { readFile } from "../utils/file-reading";

type NestedArray<T> = Array<T | NestedArray<T>>;
type Packet = NestedArray<number>;
type PacketPair = [Packet, Packet];

const parseToPacketPairs = (file: string) =>
  file
    .split("\n\n")
    .map(
      (a) =>
        [
          eval(a.split("\n")[0]) as Packet,
          eval(a.split("\n")[1]) as Packet,
        ] as PacketPair
    );

const compare = (
  left: number | Packet,
  right: number | Packet
): boolean | null => {
  if (typeof left === "number" && typeof right === "number") {
    return left === right ? null : left < right;
  }

  const arrayLeft = typeof left === "number" ? [left] : left;
  const arrayRight = typeof right === "number" ? [right] : right;

  for (let i = 0; i < arrayLeft.length; i++) {
    const nextLeft = arrayLeft[i];
    const nextRight = arrayRight[i];

    if (nextRight == null) {
      return false;
    }

    const result = compare(nextLeft, nextRight);

    if (result !== null) {
      return result;
    }
  }

  return arrayLeft.length === arrayRight.length ? null : true;
};

const packetPairs = parseToPacketPairs(readFile("src/13/inputs/input.txt"));

export const part1 = sumArray(
  packetPairs.map((packetPair, i) =>
    compare(packetPair[0], packetPair[1]) ? i + 1 : 0
  )
);
console.log("Part 1:", part1);

export const part2 = 456;
console.log("Part 2:", part2);
