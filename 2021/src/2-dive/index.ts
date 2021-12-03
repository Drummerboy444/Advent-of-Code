import {getLineReader} from "../utils/file-reading"

interface Instruction {
  type: string
  value: number
}

const readInstructions = getLineReader<Instruction>((line) => {
  const split = line.split(" ")
  return {
    type: split[0],
    value: Number(split[1]),
  }
})

const instructions = readInstructions("src/2-dive/input.txt")

interface Position {
  depth: number
  horizontal: number
}

const getFinalPosition = <T extends Position>(
  getNextPosition: (position: T, instruction: Instruction) => T,
  initialValue: T,
) => instructions.reduce<T>(getNextPosition, initialValue)

const finalPosition1 = getFinalPosition<Position>(
  (position, instruction) => ({
    depth:
      instruction.type == "up"
        ? position.depth - instruction.value
        : instruction.type == "down"
        ? position.depth + instruction.value
        : position.depth,
    horizontal:
      instruction.type == "forward"
        ? position.horizontal + instruction.value
        : position.horizontal,
  }),
  {depth: 0, horizontal: 0},
)

console.log(`Part 1: ${finalPosition1.depth * finalPosition1.horizontal}`)

interface PositionWithAim extends Position {
  aim: number
}

const finalPosition2 = getFinalPosition<PositionWithAim>(
  (position, instruction) => ({
    depth:
      instruction.type == "forward"
        ? position.depth + position.aim * instruction.value
        : position.depth,
    horizontal:
      instruction.type == "forward"
        ? position.horizontal + instruction.value
        : position.horizontal,
    aim:
      instruction.type == "up"
        ? position.aim - instruction.value
        : instruction.type == "down"
        ? position.aim + instruction.value
        : position.aim,
  }),
  {
    depth: 0,
    horizontal: 0,
    aim: 0,
  },
)

console.log(`Part 2: ${finalPosition2.depth * finalPosition2.horizontal}`)
