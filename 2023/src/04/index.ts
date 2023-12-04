import { readLines } from "../utils/file-reading";

const lines = readLines("src/04/inputs/input.txt");

const DIGIT_REGEX = /(\d+)/g;

const parseLine = (line: string) => {
  const [cardIdWithWinningNumbersString, resultNumbersString] = line.split("|");
  if (
    cardIdWithWinningNumbersString === undefined ||
    resultNumbersString === undefined
  ) {
    throw new Error();
  }

  const [cardIdString, winningNumbersString] =
    cardIdWithWinningNumbersString.split(":");
  if (cardIdString === undefined || winningNumbersString === undefined) {
    throw new Error();
  }

  const cardIdMatch = cardIdString.match(DIGIT_REGEX);
  if (cardIdMatch === null) {
    throw new Error();
  }

  const cardId = cardIdMatch[0];

  const winningNumbers = [...winningNumbersString.matchAll(DIGIT_REGEX)].map(
    ([value]) => value
  );

  const resultNumbers = [...resultNumbersString.matchAll(DIGIT_REGEX)].map(
    ([value]) => value
  );

  return {
    cardId: parseInt(cardId),
    winningNumbers: winningNumbers.map((x) => parseInt(x)),
    resultNumbers: resultNumbers.map((x) => parseInt(x)),
  };
};

const cards = lines.map(parseLine);

const getUnion = (s1: number[], s2: number[]) =>
  s1.filter((x) => s2.includes(x));

const getScore = (matches: number) => {
  return matches === 0 ? 0 : Math.pow(2, matches - 1);
};

const getMatches = ({
  resultNumbers,
  winningNumbers,
}: {
  resultNumbers: number[];
  winningNumbers: number[];
}) => getUnion(resultNumbers, winningNumbers).length;

const part1 = cards
  .map(getMatches)
  .map(getScore)
  .reduce((a, b) => a + b, 0);

console.log("Part 1:", part1);

const cardsById = cards.reduce(
  (cardsById, card) => {
    cardsById[card.cardId] = {
      cardId: card.cardId,
      winningNumbers: card.winningNumbers,
      resultNumbers: card.resultNumbers,
    };
    return cardsById;
  },
  {} as Record<
    number,
    {
      cardId: number;
      winningNumbers: number[];
      resultNumbers: number[];
    }
  >
);

const getScore2 = (card: {
  cardId: number;
  winningNumbers: number[];
  resultNumbers: number[];
}): number => {
  const matches = getMatches(card);

  const nextCards = [];

  for (let i = card.cardId + 1; i <= card.cardId + matches; i++) {
    const nextCard = cardsById[i];
    if (nextCard === undefined) throw new Error();
    nextCards.push(nextCard);
  }

  return matches + nextCards.map(getScore2).reduce((a, b) => a + b, 0);
};

const part2 = cards.map(getScore2).reduce((a, b) => a + b, 0) + cards.length;

console.log("Part 2:", part2);
