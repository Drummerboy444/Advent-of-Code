import {flow, pipe} from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as RONEA from "fp-ts/ReadonlyNonEmptyArray"
import * as S from "fp-ts/String"
import {readLines} from "../utils/file-reading"

const lines = pipe(
  readLines("src/9-smoke-basin/input.txt"),
  A.map(flow(S.split(""), RONEA.map(Number))),
)

const getLowPoints = (lines: Array<RONEA.ReadonlyNonEmptyArray<number>>) => {
  const lowPoints = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (let j = 0; j < line.length; j++) {
      const point = line[j]
      if (i > 0 && lines[i - 1][j] <= point) {
        continue
      }
      if (i < lines.length - 1 && lines[i + 1][j] <= point) {
        continue
      }
      if (j > 0 && line[j - 1] <= point) {
        continue
      }
      if (j < line.length - 1 && line[j + 1] <= point) {
        continue
      }
      lowPoints.push(point)
    }
  }
  return lowPoints
}

const getRiskLevel = (point: number) => 1 + point

const getTotalRiskLevel = flow(
  getLowPoints,
  A.map(getRiskLevel),
  A.reduce(0, (a, b) => a + b),
)

console.log(`Part 1: ${getTotalRiskLevel(lines)}`)
