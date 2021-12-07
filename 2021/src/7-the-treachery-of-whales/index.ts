import {pipe} from "fp-ts/function"
import * as RONEA from "fp-ts/ReadonlyNonEmptyArray"
import * as S from "fp-ts/string"
import {readFile} from "../utils/file-reading"

const positions = pipe(
  readFile("src/7-the-treachery-of-whales/input.txt"),
  S.split(","),
  RONEA.map(Number),
)

const getFuelCosts: (
  fuelCostCalculator: (to: number) => (from: number) => number,
) => (to: number) => (froms: RONEA.ReadonlyNonEmptyArray<number>) => number =
  (fuelCostCalculator) => (to) =>
    RONEA.reduce(
      0,
      (previous, current) => previous + fuelCostCalculator(to)(current),
    )

const getMinFuelCost = (
  positions: RONEA.ReadonlyNonEmptyArray<number>,
  fuelCostCalculator: (to: number) => (from: number) => number,
) => {
  const minPosition = Math.min(...positions)
  const maxPosition = Math.max(...positions)

  let minFuelCost = Infinity
  for (let i = minPosition; i <= maxPosition; i++) {
    minFuelCost = Math.min(
      minFuelCost,
      getFuelCosts(fuelCostCalculator)(i)(positions),
    )
  }

  return minFuelCost
}

const getLinearFuelCost: (to: number) => (from: number) => number =
  (to) => (from) =>
    Math.abs(from - to)

console.log(`Part 1: ${getMinFuelCost(positions, getLinearFuelCost)}`)

const getTriangleFuelCost: (to: number) => (from: number) => number =
  (to) => (from) => {
    const n = Math.abs(from - to)
    return (n * (n + 1)) / 2
  }

console.log(`Part 2: ${getMinFuelCost(positions, getTriangleFuelCost)}`)
