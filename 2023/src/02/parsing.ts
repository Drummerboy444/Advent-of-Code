// E.g. "3 blue, 4 red"
const parseIndividualResult = (stringIndividualResult: string) => {
  const result = {
    red: 0,
    green: 0,
    blue: 0,
  };

  stringIndividualResult.split(", ").forEach((numberWithColour) => {
    const [stringNumber, colour] = numberWithColour.split(" ");

    if (colour === undefined || stringNumber === undefined) {
      throw new Error("Invalid colour with number");
    }

    const parsedNumber = parseInt(stringNumber);

    if (isNaN(parsedNumber)) {
      throw new Error("Invalid number");
    }

    if (colour !== "red" && colour !== "green" && colour !== "blue") {
      throw new Error("Invalid colour");
    }

    result[colour] = parsedNumber;
  });

  return result;
};

// E.g. "3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
const parseResults = (stringResults: string) => {
  return stringResults.split("; ").map(parseIndividualResult);
};

// E.g. "Game 10"
const parseId = (gameWithId: string) => {
  const stringId = gameWithId.substring(5);
  const parsedId = parseInt(stringId);

  if (isNaN(parsedId)) {
    throw new Error("Invalid ID");
  }

  return parsedId;
};

export type ParsedResult = {
  red: number;
  green: number;
  blue: number;
};

export type ParsedLine = {
  id: number;
  results: ParsedResult[];
};

// E.g. Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
export const parseLine = (line: string): ParsedLine => {
  const splitOnColon = line.split(": ");
  const [gameWithId, stringResults] = splitOnColon;

  if (gameWithId === undefined || stringResults === undefined) {
    throw new Error("Invalid input");
  }

  return { id: parseId(gameWithId), results: parseResults(stringResults) };
};
