import { sortNumbers } from "./sorting";

export type Point = [number, number];

export const is = (p: unknown): p is Point =>
  p instanceof Array &&
  p.length === 2 &&
  typeof p[0] === "number" &&
  typeof p[1] === "number";

export const getMinX = (ps: Point[]) =>
  sortNumbers(
    ps.map(([x]) => x),
    "asc"
  )[0];

export const getMaxX = (ps: Point[]) =>
  sortNumbers(
    ps.map(([x]) => x),
    "desc"
  )[0];

export const getMinY = (ps: Point[]) =>
  sortNumbers(
    ps.map(([_, y]) => y),
    "asc"
  )[0];

export const getMaxY = (ps: Point[]) =>
  sortNumbers(
    ps.map(([_, y]) => y),
    "desc"
  )[0];

export const map = <T>(ps: Point[], toT: (p: Point) => T) => ps.map(toT);

export const add = ([x1, y1]: Point, [x2, y2]: Point): Point => [
  x1 + x2,
  y1 + y2,
];

export const addToMany = (ps: Point[], [x2, y2]: Point) =>
  map(ps, ([x1, y1]): Point => [x1 + x2, y1 + y2]);
