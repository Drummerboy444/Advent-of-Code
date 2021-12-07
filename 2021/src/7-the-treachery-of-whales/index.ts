import {flow, pipe} from "fp-ts/function"
import * as RONEA from "fp-ts/ReadonlyNonEmptyArray"
import * as S from "fp-ts/string"
import {readFile} from "../utils/file-reading"

const positions = pipe(
  readFile("src/7-the-treachery-of-whales/input.txt"),
  S.split(","),
  RONEA.map(Number),
)

const getFuelCost: (to: number) => (from: number) => number = (to) => (from) =>
  Math.abs(from - to)

const getFuelCosts: (
  to: number,
) => (froms: RONEA.ReadonlyNonEmptyArray<number>) => number = (to) =>
  flow(
    RONEA.reduce(0, (previous, current) => previous + getFuelCost(to)(current)),
  )

const getMinFuelCost = (positions: RONEA.ReadonlyNonEmptyArray<number>) => {
  const minPosition = Math.min(...positions)
  const maxPosition = Math.max(...positions)

  let minFuelCost = Infinity
  for (let i = minPosition; i <= maxPosition; i++) {
    minFuelCost = Math.min(minFuelCost, getFuelCosts(i)(positions))
  }

  return minFuelCost
}

console.log(`Part 1: ${getMinFuelCost(positions)}`)
