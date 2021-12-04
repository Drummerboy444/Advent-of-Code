import {flow, pipe} from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as P from "fp-ts/Predicate"
import * as RONEA from "fp-ts/ReadonlyNonEmptyArray"
import * as S from "fp-ts/string"
import * as T from "fp-ts/Tuple"
import {readLines} from "../utils/file-reading"
import {Card, Row} from "./types"

const lines = readLines("src/4-giant-squid/input.txt")

const instructions = pipe(lines[0], S.split(","), RONEA.map(Number))

const cards: Array<Card> = pipe(
  lines,
  A.splitAt(2),
  T.snd,
  A.filter(P.not(S.isEmpty)),
  A.map(flow(S.trim, S.split(/\s+/), RONEA.map(Number))),
  A.chunksOf(5),
)

const containsWinningRow = (card: Card) =>
  card.some((row) => row.every((item) => item == "X"))

const containsWinningColumn = (card: Card): boolean =>
  containsWinningRow([
    [card[0][0], card[1][0], card[2][0], card[3][0], card[4][0]],
    [card[0][1], card[1][1], card[2][1], card[3][1], card[4][1]],
    [card[0][2], card[1][2], card[2][2], card[3][2], card[4][2]],
    [card[0][3], card[1][3], card[2][3], card[3][3], card[4][3]],
    [card[0][4], card[1][4], card[2][4], card[3][4], card[4][4]],
  ])

const isWinner = (card: Card) =>
  containsWinningRow(card) || containsWinningColumn(card)

const tryGetWinner: (cards: Array<Card>) => Card | null = (cards) =>
  pipe(cards, A.filter(isWinner), (winners) =>
    winners.length == 1 ? winners[0] : null,
  )

const getNextRow: (instruction: number) => (row: Row) => Row = (instruction) =>
  RONEA.map((number) => {
    if (number == "X") {
      return "X"
    }
    return number == instruction ? "X" : number
  })

const getNextCard: (instruction: number) => (card: Card) => Card = (
  instruction,
) => RONEA.map(getNextRow(instruction))

const getNextCards: (
  instruction: number,
) => (cards: Array<Card>) => Array<Card> = (instruction) =>
  A.map(getNextCard(instruction))

const getScore = (card: Card) => {
  let score = 0
  card.forEach((row) =>
    row.forEach((i) => {
      if (i != "X") score += i
    }),
  )
  return score
}

let scoredCards = cards
for (let i = 0; i < instructions.length; i++) {
  const instruction = instructions[i]
  scoredCards = getNextCards(instruction)(scoredCards)
  const winningCard = tryGetWinner(scoredCards)
  if (winningCard) {
    console.log(`Part 1: ${getScore(winningCard) * instruction}`)
    break
  }
}
