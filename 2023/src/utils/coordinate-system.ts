export type CoordinateSystem<T> = Record<number, Record<number, T>>;
export type Coordinate = { x: number; y: number };

export const tryGetValue = <T>(
  c: CoordinateSystem<T>,
  { x, y }: Coordinate
) => {
  const ys = c[x];
  if (ys === undefined) return undefined;
  return ys[y];
};

export const getValue = <T>(c: CoordinateSystem<T>, { x, y }: Coordinate) =>
  c[x]![y]!;

export const setValue = <T>(
  c: CoordinateSystem<T>,
  { x, y }: Coordinate,
  value: T
) => {
  if (!(x in c)) c[x] = {};
  c[x]![y] = value;
};

export const getMaxX = <T>(c: CoordinateSystem<T>) =>
  Math.max(...Object.keys(c).map((key) => parseInt(key)));

export const getMaxY = <T>(c: CoordinateSystem<T>) =>
  Math.max(
    ...Object.values(c).flatMap((value) =>
      Object.keys(value).map((key) => parseInt(key))
    )
  );

export const addCoordinates = (
  { x: x1, y: y1 }: Coordinate,
  { x: x2, y: y2 }: Coordinate
): Coordinate => ({ x: x1 + x2, y: y1 + y2 });

export const subtractCoordinates = (
  { x: x1, y: y1 }: Coordinate,
  { x: x2, y: y2 }: Coordinate
): Coordinate => ({ x: x1 - x2, y: y1 - y2 });

export const areEqualCoordinates = (
  { x: x1, y: y1 }: Coordinate,
  { x: x2, y: y2 }: Coordinate
) => x1 === x2 && y1 === y2;

export const toCoordinatesWithValues = <T>(c: CoordinateSystem<T>) => {
  const maxX = getMaxX(c);
  const maxY = getMaxY(c);
  const coordinatesWithValues: { coordinate: Coordinate; value: T }[] = [];

  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      coordinatesWithValues.push({
        coordinate: { x, y },
        value: getValue(c, { x, y }),
      });
    }
  }

  return coordinatesWithValues;
};

export const copy = <T>(c: CoordinateSystem<T>) => {
  const maxX = getMaxX(c);
  const maxY = getMaxY(c);
  const copy: CoordinateSystem<T> = {};

  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      setValue(copy, { x, y }, getValue(c, { x, y }));
    }
  }

  return copy;
};

export const stringify = <T>(
  c: CoordinateSystem<T>,
  toString: (t: T) => string
) =>
  toCoordinatesWithValues(c)
    .map(({ value }) => toString(value))
    .join("");

export const render = <T>(
  c: CoordinateSystem<T>,
  renderItem: (t: T) => string
) => {
  const maxX = getMaxX(c);
  const maxY = getMaxY(c);

  const lines: string[] = [];
  for (let y = 0; y <= maxY; y++) {
    let line = "";
    for (let x = 0; x <= maxX; x++) {
      line += renderItem(getValue(c, { x, y }));
    }
    lines.push(line);
  }
  lines.forEach((line) => console.log(line));
};
