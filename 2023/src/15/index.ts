import { readFile } from "../utils/file-reading";

const hash = (string: string) =>
  string
    .split("")
    .reduce(
      (currentValue, character) =>
        ((currentValue + character.charCodeAt(0)) * 17) % 256,
      0
    );

type InitialisationSequence = (
  | {
      type: "-";
      label: string;
    }
  | {
      type: "=";
      label: string;
      focalLength: number;
    }
)[];

const toInitialisationSequence = (strings: string[]): InitialisationSequence =>
  strings.map((string) => {
    const lastCharacter = string[string.length - 1];
    if (lastCharacter === "-")
      return { type: "-" as const, label: string.slice(0, string.length - 1) };

    const [label, stringFocalLength] = string.split("=");
    if (label === undefined || stringFocalLength === undefined)
      throw new Error();

    return {
      type: "=" as const,
      label,
      focalLength: parseInt(stringFocalLength),
    };
  });

const solvePart2 = (initialisationSequence: InitialisationSequence) => {
  const boxes: {
    label: string;
    focalLength: number;
  }[][] = Array.from({ length: 256 }).map(() => []);

  initialisationSequence.forEach((item) => {
    const boxIndex = hash(item.label);
    const box = boxes[boxIndex];
    if (box === undefined) throw new Error();

    const lensIndex = box.findIndex(({ label }) => label === item.label);

    if (item.type === "-") {
      if (lensIndex !== -1) box.splice(lensIndex, 1);
    } else {
      const lens = { label: item.label, focalLength: item.focalLength };
      if (lensIndex !== -1) {
        box[lensIndex] = lens;
      } else {
        box.push(lens);
      }
    }
  });

  return boxes
    .flatMap((box, i) =>
      box.map((item, j) => (i + 1) * (j + 1) * item.focalLength)
    )
    .reduce((a, b) => a + b, 0);
};

const file = readFile("src/15/inputs/input.txt");
const strings = file.split(",");

const part1 = strings.map(hash).reduce((a, b) => a + b, 0);
console.log("Part 1:", part1);

const part2 = solvePart2(toInitialisationSequence(strings));
console.log("Part 2:", part2);
