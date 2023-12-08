import { readFile } from "../utils/file-reading";

const INSTRUCTIONS = ["R", "L"] as const;

type Instruction = (typeof INSTRUCTIONS)[number];

const isInstruction = (
  maybeInstruction: unknown
): maybeInstruction is Instruction =>
  typeof maybeInstruction === "string" &&
  INSTRUCTIONS.includes(maybeInstruction as Instruction);

type Network = Record<string, Record<Instruction, string>>;

type Input = {
  instructions: Instruction[];
  network: Network;
};

const parseFile = (file: string): Input => {
  const [instructionsString, networkString] = file.split("\n\n");

  if (instructionsString === undefined || networkString === undefined)
    throw new Error();

  return {
    instructions: parseInstructionsString(instructionsString),
    network: parseNetworkString(networkString),
  };
};

const parseInstructionsString = (instructionsString: string): Instruction[] => {
  const maybeInstructions = instructionsString.split("");

  if (maybeInstructions.every(isInstruction)) return maybeInstructions;

  throw new Error();
};

const parseNetworkString = (networkString: string): Network =>
  networkString
    .split("\n")
    .map(parseNetworkStringRow)
    .reduce<Network>(
      (network, { key, left, right }) => ({
        ...network,
        [key]: { L: left, R: right },
      }),
      {}
    );

const COORDINATE_REGEX = /([A-Z0-9]{3})/g;

const parseNetworkStringRow = (networkStringRow: string) => {
  const match = networkStringRow.match(COORDINATE_REGEX);

  if (match === null) throw new Error();

  const [key, left, right] = match;

  if (left === undefined || right === undefined) throw new Error();

  return { key, left, right };
};

const getNextPosition = (
  { instructions, network }: Input,
  instructionIndex: number,
  position: string
) => {
  const instruction = instructions[instructionIndex];

  if (instruction === undefined) throw new Error();

  const networkRow = network[position];

  if (networkRow === undefined) throw new Error();

  return networkRow[instruction];
};

const solvePart1 = ({ instructions, network }: Input) => {
  let position = "AAA";
  let instructionIndex = 0;
  let steps = 0;

  while (position !== "ZZZ") {
    const instruction = instructions[instructionIndex];

    if (instruction === undefined) throw new Error();

    const networkRow = network[position];

    if (networkRow === undefined) throw new Error();

    position = getNextPosition(
      { instructions, network },
      instructionIndex,
      position
    );

    instructionIndex++;

    if (instructionIndex >= instructions.length) instructionIndex = 0;

    steps++;
  }

  return steps;
};

// const getStartingPositions = (network: Network) =>
//   Object.keys(network).filter((key) => key[key.length - 1] === "A");

// const memo: Record<string, string> = {};

// const solvePart2 = ({ instructions, network }: Input) => {
//   let positions = getStartingPositions(network);
//   let instructionIndex = 0;
//   let steps = 0;

//   while (
//     !positions.every((position) => position[position.length - 1] === "Z")
//   ) {
//     if (steps % 1_000_000 === 0)
//       console.log("Steps:", `${steps / 1_000_000} mil`);

//     positions = positions.map((position) => {
//       const memoisedNextPosition = memo[`${position}${instructionIndex}`];

//       if (memoisedNextPosition !== undefined) return memoisedNextPosition;

//       const nextPosition = getNextPosition(
//         { instructions, network },
//         instructionIndex,
//         position
//       );

//       memo[`${position}${instructionIndex}`] = nextPosition;
//       return nextPosition;
//     });

//     instructionIndex++;

//     if (instructionIndex >= instructions.length) instructionIndex = 0;

//     steps++;
//   }

//   return steps;
// };

// const getCycle =
//   ({ instructions, network }: Input) =>
//   (startingPosition: string) => {
//     const cycle = [startingPosition];
//     let instructionIndex = 0;

//     while (
//       cycle.length === 1 ||
//       !cycle.some(
//         (previousPosition, i) =>
//           i !== cycle.length - 1 && previousPosition === cycle[cycle.length - 1]
//       )
//     ) {
//       const currentPosition = cycle[cycle.length - 1];

//       if (currentPosition === undefined) throw new Error();

//       const nextPosition = getNextPosition(
//         { instructions, network },
//         instructionIndex,
//         currentPosition
//       );

//       cycle.push(nextPosition);

//       instructionIndex++;

//       if (instructionIndex >= instructions.length) instructionIndex = 0;
//     }

//     return cycle;
//   };

// const solvePart2Fast = ({ instructions, network }: Input) => {
//   const startingPositions = getStartingPositions(network);
//   const cycles = startingPositions.map(getCycle({ instructions, network }));
//   return cycles;
// };

console.log(
  "Part 1:",
  solvePart1(parseFile(readFile("src/08/inputs/input.txt")))
);

// console.log(
//   "Part 2:",
//   solvePart2Fast(parseFile(readFile("src/08/inputs/input.test-2.txt")))
// );
