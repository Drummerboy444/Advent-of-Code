import { readLines } from "../utils/file-reading";

const trees = readLines("src/08/input.txt", (line) =>
  line.split("").map(Number)
);

const isVisible = (size: number, otherSizes: number[]) =>
  otherSizes.every((otherSize) => otherSize < size);

let visibleTrees = trees.length * 2 + trees[0].length * 2 - 4;

for (let i = 1; i < trees.length - 1; i++) {
  const row = trees[i];
  for (let j = 1; j < row.length - 1; j++) {
    const tree = row[j];

    const treesBefore = row.slice(0, j);
    const treesAfter = row.slice(j + 1, row.length);
    const treesAbove = trees.slice(0, i).map((row) => row[j]);
    const treesBelow = trees.slice(i + 1, trees.length).map((row) => row[j]);

    if (
      isVisible(tree, treesBefore) ||
      isVisible(tree, treesAfter) ||
      isVisible(tree, treesAbove) ||
      isVisible(tree, treesBelow)
    )
      visibleTrees++;
  }
}

export const part1 = visibleTrees;
console.log("Part 1:", part1);

const countVisibleTrees = (size: number, otherSizes: number[]) => {
  let visibleTrees = 0;

  for (let i = 0; i < otherSizes.length; i++) {
    visibleTrees++;
    if (otherSizes[i] >= size) break;
  }

  return visibleTrees;
};

let highestScenicScore = 0;

for (let i = 0; i < trees.length; i++) {
  const row = trees[i];
  for (let j = 0; j < row.length; j++) {
    const tree = row[j];

    const treesBefore = row.slice(0, j).reverse();
    const treesAfter = row.slice(j + 1, row.length);
    const treesAbove = trees
      .slice(0, i)
      .map((row) => row[j])
      .reverse();
    const treesBelow = trees.slice(i + 1, trees.length).map((row) => row[j]);

    const visibleBefore = countVisibleTrees(tree, treesBefore);
    const visibleAfter = countVisibleTrees(tree, treesAfter);
    const visibleAbove = countVisibleTrees(tree, treesAbove);
    const visibleBelow = countVisibleTrees(tree, treesBelow);

    const scenicScore =
      visibleBefore * visibleAfter * visibleAbove * visibleBelow;

    if (scenicScore > highestScenicScore) highestScenicScore = scenicScore;
  }
}

export const part2 = highestScenicScore;
console.log("Part 2:", part2);
