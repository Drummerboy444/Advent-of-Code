import {pipe} from "fp-ts/function"
import * as A from "fp-ts/Array"
import {readLines} from "../utils/file-reading"

const lines = readLines("src/10-syntax-scoring/input.txt")

const isOpenBracket = (bracket: string) =>
  bracket == "(" || bracket == "[" || bracket == "{" || bracket == "<"

const isCorrupted = (line: string) => {
  const stack: Array<string> = []

  for (let i = 0; i < line.length; i++) {
    const bracket = line[i]

    if (isOpenBracket(bracket)) {
      stack.push(bracket)
      continue
    } else if (isValidPair(stack[stack.length - 1], bracket)) {
      stack.pop()
      continue
    }

    return true
  }

  return false
}

const isValidPair = (a: string, b: string) => {
  return (
    (a == "(" && b == ")") ||
    (a == "[" && b == "]") ||
    (a == "{" && b == "}") ||
    (a == "<" && b == ">")
  )
}

const corruptedLines = pipe(lines, A.filter(isCorrupted))

const bracketScores: Record<string, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
}

const getScore = (line: string) => {
  const stack: Array<string> = []

  for (let i = 0; i < line.length; i++) {
    const bracket = line[i]

    if (isOpenBracket(bracket)) {
      stack.push(bracket)
      continue
    } else if (isValidPair(stack[stack.length - 1], bracket)) {
      stack.pop()
      continue
    }

    return bracketScores[bracket]
  }

  return 0
}

console.log(
  `Part 1: ${corruptedLines.reduce((previous, current) => {
    return previous + getScore(current)
  }, 0)}`,
)
