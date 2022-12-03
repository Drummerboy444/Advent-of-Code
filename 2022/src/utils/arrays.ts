export const sumArray = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const chunksOf = <T>(arr: T[], size: number) => {
  const chunks: T[][] = [];

  for (let i = 0; i < arr.length / size; i++) {
    const startIndex = i * size;
    chunks.push(arr.slice(startIndex, startIndex + size));
  }

  return chunks;
};