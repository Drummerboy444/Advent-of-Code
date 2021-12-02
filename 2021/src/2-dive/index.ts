import { getLineReader } from "../utils/file-reading";

enum InstructionType {
  UP = "UP",
  DOWN = "DOWN",
  FORWARD = "FORWARD",
}

const instructionTypeLookup: Record<string, InstructionType> = {
  up: InstructionType.UP,
  down: InstructionType.DOWN,
  forward: InstructionType.FORWARD,
};

interface Instruction {
  type: InstructionType;
  value: number;
}

const readInstructions = getLineReader<Instruction>((line) => {
  const split = line.split(" ");
  return {
    type: instructionTypeLookup[split[0]],
    value: Number(split[1]),
  };
});

const instructions = readInstructions("src/2-dive/input.txt");

interface Position {
  depth: number;
  horizontal: number;
}

const getFinalPosition = <T extends Position>(
  getNextPosition: (position: T, instruction: Instruction) => T,
  initialValue: T
) => instructions.reduce<T>(getNextPosition, initialValue);

const finalPosition1 = getFinalPosition<Position>(
  (position, instruction) => ({
    depth:
      instruction.type == InstructionType.UP
        ? position.depth - instruction.value
        : instruction.type == InstructionType.DOWN
        ? position.depth + instruction.value
        : position.depth,
    horizontal:
      instruction.type == InstructionType.FORWARD
        ? position.horizontal + instruction.value
        : position.horizontal,
  }),
  { depth: 0, horizontal: 0 }
);

console.log(`Part 1: ${finalPosition1.depth * finalPosition1.horizontal}`);

interface PositionWithAim extends Position {
  aim: number;
}

const finalPosition2 = getFinalPosition<PositionWithAim>(
  (position, instruction) => ({
    depth:
      instruction.type == InstructionType.FORWARD
        ? position.depth + position.aim * instruction.value
        : position.depth,
    horizontal:
      instruction.type == InstructionType.FORWARD
        ? position.horizontal + instruction.value
        : position.horizontal,
    aim:
      instruction.type == InstructionType.UP
        ? position.aim - instruction.value
        : instruction.type == InstructionType.DOWN
        ? position.aim + instruction.value
        : position.aim,
  }),
  {
    depth: 0,
    horizontal: 0,
    aim: 0,
  }
);

console.log(`Part 2: ${finalPosition2.depth * finalPosition2.horizontal}`);
