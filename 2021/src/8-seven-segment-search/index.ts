import {flow} from "fp-ts/function"
import * as RONEA from "fp-ts/ReadonlyNonEmptyArray"
import * as S from "fp-ts/string"
import {getLineReader} from "../utils/file-reading"

type Line = RONEA.ReadonlyNonEmptyArray<RONEA.ReadonlyNonEmptyArray<string>>

const readLines: (file: string) => Array<Line> = getLineReader(
  flow(S.split(" | "), RONEA.map(S.split(" "))),
)

const lines = readLines("src/8-seven-segment-search/input.txt")

const countUniqueOutputs = (lines: Array<Line>) => {
  let count = 0
  lines.forEach((line) => {
    const output = line[1]
    output.forEach((o) => {
      if (o.length == 2 || o.length == 4 || o.length == 3 || o.length == 7) {
        count++
      }
    })
  })

  return count
}

console.log(`Part 1: ${countUniqueOutputs(lines)}`)

const sort = (string: string) => string.split("").sort().join()

//cg fadegbc ecfadb acdbeg abgfe dcegfb gcad bceag debca bgc | ceafbd gfedcb cabedf dbace
//  aaaa
// b    c
// b    c
//  dddd
// e    f
// e    f
//  gggg

// [9] - 0, size: 6, know all segments
//#[0] - 1, size: 2, know all segments
// [4] - 2, size: 5, max(2 - 4, 3 - 4, 5 - 4)
// [9] - 3, size: 5, know all segments
//#[0] - 4, size: 4, know all segments
// [9] - 5, size: 5, know all segments
// [9] - 6, size: 6, know all segments
//#[0] - 7, size: 3, know all segments
//#[0] - 8, size: 7, know all segments
// [9] - 9, size: 6, know all segments

//#[1] - a, 7 - 1
// [8] - b, final one so can deduce from all the ones that we know already
// [6] - c, 2 - adeg
// [3] - d, min(2 - (1 + ag), 3 - (1 + ag), 5 - (1 + ag))
// [5] - e, 2 - (1 + adg)
// [7] - f, 1 - 2
// [2] - g, min(0 - (4 + 7), 6 - (4 + 7), 9 - (4 + 7))

// d & g = 3 - 7
// 0 & 6 & 9 all have 6 segments,
//   one of them minus (4 + 7) is one segment, which tells us g
// 2 & 3 & 5 all have 5 segments,
//   one of them minus (agcf) is one segment, which tells us d (cf is 1)
// 2 & 3 & 5 all have 5 segments,
//   2 - 4 has 3 segments
//   3 - 4 has 2 segments
//   5 - 4 has 2 segments
//     so max is 2

const subtract = (a: string, b: string): string => {
  let x = ""

  a.split("").forEach((char) => {
    if (b.includes(char)) {
      return
    }
    x += char
  })

  return x
}

const getNumberLookup: (line: Line) => Record<string, number> = (line) => {
  const numberLookup: Record<string, number> = {}
  const reverseNumberLookup: Record<number, string> = {}
  const segmentLookup: Record<string, string> = {}

  const inputs = line[0]

  inputs.forEach((input) => {
    if (input.length == 2) {
      numberLookup[sort(input)] = 1
      reverseNumberLookup[1] = sort(input)
    } else if (input.length == 3) {
      numberLookup[sort(input)] = 7
      reverseNumberLookup[7] = sort(input)
    } else if (input.length == 4) {
      numberLookup[sort(input)] = 4
      reverseNumberLookup[4] = sort(input)
    } else if (input.length == 7) {
      numberLookup[sort(input)] = 8
      reverseNumberLookup[8] = sort(input)
    }
  })

  segmentLookup["a"] = subtract(reverseNumberLookup[1], reverseNumberLookup[7])

  return numberLookup
}

let total = 0

lines.forEach((line) => {
  const outputs = line[1]
  const segmentLookup = getNumberLookup(line)

  const digits = outputs.map((o) => segmentLookup[sort(o)]).join()
  total += Number(digits)
})

console.log(`Part 2: ${total}`)
