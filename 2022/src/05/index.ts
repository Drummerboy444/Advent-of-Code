import { readFile } from "../utils/file-reading";

const file = readFile("src/05/input.txt");
const rawBoxes = file.split("\n\n")[0].split("\n");
rawBoxes.pop();

const boxes = Array.from({ length: 9 }, () => [] as string[]);
for (let i = rawBoxes.length - 1; i >= 0; i--) {
  const line = rawBoxes[i];
  for (let j = 0; j < 9; j++) {
    const letter = line[j * 4 + 1];
    if (letter !== " ") {
      boxes[j].push(letter);
    }
  }
}

const rawInstructions = file.split("\n\n")[1].split("\n");
const instructions: number[][] = [];
rawInstructions.forEach((rawInstruction) => {
  instructions.push(rawInstruction.match(/[0-9]+/g)!.map(Number));
});

const applyInstructionPart1 = (boxes: string[][], instruction: number[]) => {
  const stack = boxes[instruction[1] - 1];
  const movingBoxes = stack.splice(stack.length - instruction[0]);
  boxes[instruction[2] - 1].push(...movingBoxes.reverse());
};

const boxesCopyPart1 = boxes.map((stack) => stack.slice());
instructions.forEach((instruction) =>
  applyInstructionPart1(boxesCopyPart1, instruction)
);

export const part1 = boxesCopyPart1
  .map((stack) => stack[stack.length - 1])
  .join("");
console.log("Part 1:", part1);

const applyInstructionPart2 = (boxes: string[][], instruction: number[]) => {
  const stack = boxes[instruction[1] - 1];
  const movingBoxes = stack.splice(stack.length - instruction[0]);
  boxes[instruction[2] - 1].push(...movingBoxes);
};

const boxesCopyPart2 = boxes.map((stack) => stack.slice());
instructions.forEach((instruction) =>
  applyInstructionPart2(boxesCopyPart2, instruction)
);

export const part2 = boxesCopyPart2
  .map((stack) => stack[stack.length - 1])
  .join("");
console.log("Part 2:", part2);
