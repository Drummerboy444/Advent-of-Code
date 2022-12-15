import { sumArray } from "./arrays";
import { sortNumbers } from "./sorting";

export type CoordinateSystem<T> = Record<number, Record<number, T>>;
export type Point = [number, number];

const isPoint = (p: unknown): p is Point =>
  p instanceof Array &&
  p.length === 2 &&
  typeof p[0] === "number" &&
  typeof p[1] === "number";

type Contains = {
  <T>(c: CoordinateSystem<T>, x: number): boolean;
  <T>(c: CoordinateSystem<T>, p: Point): boolean;
  <T>(
    c: CoordinateSystem<T>,
    p: [Point, T],
    equals?: (t1: T, t2: T) => boolean
  ): boolean;
};

export const contains: Contains = <T>(
  c: CoordinateSystem<T>,
  other: number | Point | [Point, T],
  equals: (t1: T, t2: T) => boolean = (t1, t2) => t1 === t2
) => {
  if (typeof other === "number") return other in c;

  if (isPoint(other)) {
    const [x, y] = other;
    return x in c && y in c[x];
  }

  const [[x, y], t] = other;
  return x in c && y in c[x] && equals(c[x][y], t);
};

export const tryGet = <T>(c: CoordinateSystem<T>, [x, y]: Point) =>
  contains(c, [x, y]) ? c[x][y] : undefined;

export const minX = <T>(c: CoordinateSystem<T>) =>
  sortNumbers(Object.keys(c).map(Number), "asc")[0];

export const maxX = <T>(c: CoordinateSystem<T>) =>
  sortNumbers(Object.keys(c).map(Number), "desc")[0];

export const minY = <T>(c: CoordinateSystem<T>) =>
  sortNumbers(
    Object.values(c)
      .flatMap((ys) => Object.keys(ys))
      .map(Number),
    "asc"
  )[0];

export const maxY = <T>(c: CoordinateSystem<T>) =>
  sortNumbers(
    Object.values(c)
      .flatMap((ys) => Object.keys(ys))
      .map(Number),
    "desc"
  )[0];

export const count = <T>(c: CoordinateSystem<T>) =>
  sumArray(Object.values(c).map((ys) => Object.keys(ys).length));

export const foreach = <T>(
  c: CoordinateSystem<T>,
  callback: (point: Point, t: T) => void
) => {
  Object.entries(c).forEach(([x, ys]) => {
    Object.entries(ys).forEach(([y, t]) => {
      callback([Number(x), Number(y)], t);
    });
  });
};

const copy = <T>(c: CoordinateSystem<T>) => {
  const copy: CoordinateSystem<T> = {};
  foreach(c, ([x, y], t) => {
    if (!contains(copy, x)) copy[x] = {};
    copy[x][y] = t;
  });
  return copy;
};

type Add = {
  <T, U>(c: CoordinateSystem<T>, p: [Point, U]): CoordinateSystem<T | U>;
  <T, U>(c1: CoordinateSystem<T>, c2: CoordinateSystem<U>): CoordinateSystem<
    T | U
  >;
};

export const add: Add = <T, U>(
  c: CoordinateSystem<T>,
  other: [Point, U] | CoordinateSystem<U>
) => {
  const newC: CoordinateSystem<T | U> = copy(c);

  if (other instanceof Array) {
    const [[x, y], u] = other;
    if (!contains(newC, x)) newC[x] = {};
    newC[x][y] = u;
  } else {
    foreach(other, ([x, y], u) => {
      if (!contains(newC, x)) newC[x] = {};
      newC[x][y] = u;
    });
  }

  return newC;
};

export const render = <T>(
  c: CoordinateSystem<T>,
  renderItem: (t: T) => string,
  boundary: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  }
) => {
  const { x1, x2, y1, y2 } = boundary;

  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      const value = tryGet(c, [x, y]);
      process.stdout.write(value === undefined ? "." : renderItem(value));
    }
    process.stdout.write("\n");
  }
};
