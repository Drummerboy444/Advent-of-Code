import * as RONEA from "fp-ts/ReadonlyNonEmptyArray"

export type Row = RONEA.ReadonlyNonEmptyArray<number | "X">

export type Card = RONEA.ReadonlyNonEmptyArray<Row>
