import { chunksOf, range } from "../utils/arrays";

export class CRT {
  private cycles = 0;
  private screen: ("." | "#")[];

  constructor() {
    this.screen = range(1, 240).map(() => ".");
  }

  public render = () => {
    console.log(
      chunksOf(this.screen, 40)
        .map((row) => row.join(""))
        .join("\n")
    );
  };

  public runCycle = (spritePosition: number) => {
    if (
      spritePosition - 1 === this.cycles % 40 ||
      spritePosition === this.cycles % 40 ||
      spritePosition + 1 === this.cycles % 40
    ) {
      this.screen[this.cycles] = "#";
    }

    this.cycles++;
  };
}
