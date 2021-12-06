import {flow, pipe} from "fp-ts/function"
import * as RONEA from "fp-ts/ReadonlyNonEmptyArray"
import * as S from "fp-ts/string"
import {readFile} from "../utils/file-reading"

type LanternfishLifetimeLookup = Record<number, number>

const getEmptyLanternfishLifetimeLookup = () => {
  const lanternfishLifetimeLookup: LanternfishLifetimeLookup = {}
  for (let i = 0; i <= 8; i++) {
    lanternfishLifetimeLookup[i] = 0
  }
  return lanternfishLifetimeLookup
}

const lanternfishLifetimeLookup: LanternfishLifetimeLookup = pipe(
  readFile("src/6-lanternfish/input.txt"),
  S.split(","),
  RONEA.map(Number),
  RONEA.reduce<number, LanternfishLifetimeLookup>(
    getEmptyLanternfishLifetimeLookup(),
    (lanternfishLifetimeLookup, lanternfishLifetime) => {
      lanternfishLifetimeLookup[lanternfishLifetime]++
      return lanternfishLifetimeLookup
    },
  ),
)

const getNextGeneration = (
  lanternfishLifetimeLookup: LanternfishLifetimeLookup,
): LanternfishLifetimeLookup => {
  const nextLanternfishLifetimeLookup = getEmptyLanternfishLifetimeLookup()

  for (let i = 8; i > 0; i--) {
    nextLanternfishLifetimeLookup[i - 1] = lanternfishLifetimeLookup[i]
  }
  nextLanternfishLifetimeLookup[6] += lanternfishLifetimeLookup[0]
  nextLanternfishLifetimeLookup[8] = lanternfishLifetimeLookup[0]

  return nextLanternfishLifetimeLookup
}

const getGeneration = (
  lanternfishLifetimeLookup: LanternfishLifetimeLookup,
  generation: number,
) => {
  let currentGeneration = lanternfishLifetimeLookup
  for (let i = 0; i < generation; i++) {
    currentGeneration = getNextGeneration(currentGeneration)
  }
  return currentGeneration
}

const getTotal = (
  lanternfishLifetimeLookup: LanternfishLifetimeLookup,
): number => Object.values(lanternfishLifetimeLookup).reduce((a, b) => a + b, 0)

const getTotalAfter = flow(getGeneration, getTotal)

console.log(`Part 1: ${getTotalAfter(lanternfishLifetimeLookup, 80)}`)
console.log(`Part 2: ${getTotalAfter(lanternfishLifetimeLookup, 256)}`)
