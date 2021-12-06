import {flow} from "fp-ts/function"
import * as A from "fp-ts/Array"
import {readFileSync} from "fs"

export const readFile = (filePath: string) => readFileSync(filePath, "utf-8")

export const readLines = (filePath: string): Array<string> =>
  readFile(filePath).split("\r\n")

export const getLineReader = <T>(mapper: (line: string) => T) =>
  flow(readLines, A.map(mapper))

export const readNumbers = getLineReader((line) => Number(line))
