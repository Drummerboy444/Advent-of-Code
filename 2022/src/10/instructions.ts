type Noop = {
  type: "noop";
};

type AddX = {
  type: "addx";
  value: number;
};

export type Instruction = Noop | AddX;

export const parseLineToInstruction = (line: string): Instruction => {
  const split = line.split(" ");
  const type = split[0] as "noop" | "addx";

  return type === "addx"
    ? { type: "addx", value: Number(split[1]) }
    : { type: "noop" };
};
