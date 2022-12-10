import { Instruction } from "./instructions";

export class CPU {
  private cycles = 0;
  private X = 1;

  private cyclesWithInstruction = 0;
  private currentInstructionIndex = 0;

  constructor(private instructions: Instruction[]) {}

  public getCycles = () => this.cycles;

  public getX = () => this.X;

  public runCycle = () => {
    const currentInstruction = this.instructions[this.currentInstructionIndex];

    if (currentInstruction == null) return;

    this.cycles++;
    this.cyclesWithInstruction++;

    if (
      currentInstruction.type === "noop" &&
      this.cyclesWithInstruction === 1
    ) {
      this.cyclesWithInstruction = 0;
      this.currentInstructionIndex++;
      return;
    }

    if (
      currentInstruction.type === "addx" &&
      this.cyclesWithInstruction === 2
    ) {
      this.cyclesWithInstruction = 0;
      this.currentInstructionIndex++;
      this.X += currentInstruction.value;
    }
  };
}
