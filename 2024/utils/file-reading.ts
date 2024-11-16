type ReadLines = {
  (fileName: string): Promise<string[]>;
  <T>(fileName: string, mapper: (line: string) => T): Promise<T[]>;
};

export const readLines: ReadLines = async <T>(
  fileName: string,
  mapper?: (line: string) => T,
) => {
  const lines = (await Deno.readTextFile(fileName)).split("\n");
  return mapper ? lines.map(mapper) : lines;
};
