import {flow, pipe} from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as P from "fp-ts/Predicate"
import * as RONEA from "fp-ts/ReadonlyNonEmptyArray"
import * as S from "fp-ts/string"
import {readLines} from "../utils/file-reading"

type Point = RONEA.ReadonlyNonEmptyArray<number>
type Line = RONEA.ReadonlyNonEmptyArray<RONEA.ReadonlyNonEmptyArray<number>>
type Board = Array<Array<number>>

const getX1 = (line: Line) => line[0][0]
const getY1 = (line: Line) => line[0][1]
const getX2 = (line: Line) => line[1][0]
const getY2 = (line: Line) => line[1][1]

const parseLine: (line: string) => Line = flow(
  S.split(" -> "),
  RONEA.map(flow(S.split(","), RONEA.map(Number))),
)

const lines = pipe(
  readLines("src/5-hydrothermal-venture/input.txt"),
  A.map(parseLine),
)

const isHorizontal = (line: Line) => getY1(line) == getY2(line)
const isVertical = (line: Line) => getX1(line) == getX2(line)
const isSimple = pipe(isHorizontal, P.or(isVertical))

const simpleLines = pipe(lines, A.filter(isSimple))

const getMaxX = (lines: Array<Line>) =>
  lines.reduce(
    (previous, current) =>
      getX1(current) > previous
        ? getX1(current)
        : getX2(current) > previous
        ? getX2(current)
        : previous,
    0,
  )

const getMaxY = (lines: Array<Line>) =>
  lines.reduce(
    (previous, current) =>
      getY1(current) > previous
        ? getY1(current)
        : getY2(current) > previous
        ? getY2(current)
        : previous,
    0,
  )

const getBoard = (lines: Array<Line>): Board => {
  const maxX = getMaxX(lines)
  const maxY = getMaxY(lines)

  const board: Board = []

  for (let i = 0; i < maxX + 1; i++) {
    const row = []
    for (let j = 0; j < maxY + 1; j++) {
      row.push(0)
    }
    board.push(row)
  }

  return board
}

const toPoints: (line: Line) => Array<Point> = (line) => {
  const x1 = getX1(line)
  const y1 = getY1(line)
  const x2 = getX2(line)
  const y2 = getY2(line)

  let x = x1
  let y = y1

  const points: Array<Point> = [[x2, y2]]

  const xIncrement = x1 == x2 ? 0 : x1 < x2 ? 1 : -1
  const yIncrement = y1 == y2 ? 0 : y1 < y2 ? 1 : -1

  while (x != x2 || y != y2) {
    points.push([x, y])
    x += xIncrement
    y += yIncrement
  }

  return points
}

const drawLine: (board: Board, line: Line) => void = (board, line) => {
  const points = toPoints(line)
  points.forEach((point) => {
    board[point[1]][point[0]]++
  })
}

const countOverlaps = (lines: Array<Line>) => {
  const board = getBoard(lines)

  lines.forEach((line) => drawLine(board, line))

  let count = 0
  board.forEach((line) => {
    line.forEach((point) => {
      if (point > 1) {
        count++
      }
    })
  })

  return count
}

console.log(`Part 1: ${countOverlaps(simpleLines)}`)
console.log(`Part 2: ${countOverlaps(lines)}`)
