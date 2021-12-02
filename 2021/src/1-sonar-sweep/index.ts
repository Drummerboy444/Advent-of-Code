import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/function";
import { readNumbers } from "../utils/file-reading";

const depths = readNumbers("src/1-sonar-sweep/input.txt");

const countIncreases = (as: Array<number>, bs: Array<number>) =>
  pipe(
    as,
    A.zip(bs),
    A.filter(([a, b]) => b > a),
    A.size
  );

const [_, ...offsetDepths] = depths;
console.log(`Part 1: ${countIncreases(depths, offsetDepths)}`);

const [__, ___, ____, ...tripleOffsetDepths] = depths;
console.log(`Part 2: ${countIncreases(depths, tripleOffsetDepths)}`);
