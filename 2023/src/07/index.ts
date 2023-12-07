import { readLines } from "../utils/file-reading";

const cards = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
] as const;
type Card = (typeof cards)[number];
type Hand = [Card, Card, Card, Card, Card];
type Result = { hand: Hand; bid: number };
type HandType =
  | "FIVE_OF_A_KIND"
  | "FOUR_OF_A_KIND"
  | "FULL_HOUSE"
  | "THREE_OF_A_KIND"
  | "TWO_PAIR"
  | "ONE_PAIR"
  | "HIGH_CARD";
const handTypeRankLookup: Record<HandType, number> = {
  FIVE_OF_A_KIND: 6,
  FOUR_OF_A_KIND: 5,
  FULL_HOUSE: 4,
  THREE_OF_A_KIND: 3,
  TWO_PAIR: 2,
  ONE_PAIR: 1,
  HIGH_CARD: 0,
};

const parseLine = (line: string): Result => {
  const [handString, bidString] = line.split(" ");

  if (handString === undefined || bidString === undefined) throw new Error();

  return { hand: handString.split("") as Hand, bid: parseInt(bidString) };
};

const getHandType = (hand: Hand): HandType => {
  const cardCounts: Record<Card, number> = Object.fromEntries(
    cards.map((card) => [card, 0])
  ) as Record<Card, number>;

  hand.forEach((card) => {
    cardCounts[card]++;
  });

  if (Object.values(cardCounts).includes(5)) return "FIVE_OF_A_KIND";

  if (Object.values(cardCounts).includes(4)) return "FOUR_OF_A_KIND";

  if (
    Object.values(cardCounts).includes(3) &&
    Object.values(cardCounts).includes(2)
  )
    return "FULL_HOUSE";

  if (Object.values(cardCounts).includes(3)) return "THREE_OF_A_KIND";

  if (
    Object.values(cardCounts).filter((cardCount) => cardCount === 2).length ===
    2
  )
    return "TWO_PAIR";

  if (Object.values(cardCounts).includes(2)) return "ONE_PAIR";

  return "HIGH_CARD";
};

const compareIndividualCards = (
  hand1: Hand,
  hand2: Hand,
  cardRankLookup: Record<Card, number>
): number => {
  for (let i = 0; i < hand1.length; i++) {
    const card1 = hand1[i];
    const card2 = hand2[i];

    if (card1 === undefined || card2 === undefined) throw new Error();

    const cardRank1 = cardRankLookup[card1];
    const cardRank2 = cardRankLookup[card2];

    if (cardRank1 > cardRank2) return 1;
    if (cardRank1 < cardRank2) return -1;
  }

  throw new Error();
};

const compareHands = (
  hand1: Hand,
  hand2: Hand,
  getHandType: (hand: Hand) => HandType,
  cardRankLookup: Record<Card, number>
): number => {
  const handType1 = getHandType(hand1);
  const handType2 = getHandType(hand2);

  const handTypeRank1 = handTypeRankLookup[handType1];
  const handTypeRank2 = handTypeRankLookup[handType2];

  if (handTypeRank1 > handTypeRank2) return 1;

  if (handTypeRank1 < handTypeRank2) return -1;

  return compareIndividualCards(hand1, hand2, cardRankLookup);
};

const getHandTypeWithJokers = (hand: Hand): HandType => {
  if (hand.every((card) => card === "J")) return "FIVE_OF_A_KIND";

  const handTypeWithoutJokers = getHandType(
    hand.filter((card) => card !== "J") as Hand
  );

  const jokerCount = hand.filter((card) => card === "J").length;

  if (handTypeWithoutJokers === "FIVE_OF_A_KIND") return "FIVE_OF_A_KIND";

  if (handTypeWithoutJokers === "FOUR_OF_A_KIND") {
    if (jokerCount === 1) return "FIVE_OF_A_KIND";
  }

  if (handTypeWithoutJokers === "FULL_HOUSE") return "FULL_HOUSE";

  if (handTypeWithoutJokers === "THREE_OF_A_KIND") {
    if (jokerCount === 1) return "FOUR_OF_A_KIND";
    if (jokerCount === 2) return "FIVE_OF_A_KIND";
  }

  if (handTypeWithoutJokers === "TWO_PAIR") {
    if (jokerCount === 1) return "FULL_HOUSE";
  }

  if (handTypeWithoutJokers === "ONE_PAIR") {
    if (jokerCount === 1) return "THREE_OF_A_KIND";
    if (jokerCount === 2) return "FOUR_OF_A_KIND";
    if (jokerCount === 3) return "FIVE_OF_A_KIND";
  }

  if (handTypeWithoutJokers === "HIGH_CARD") {
    if (jokerCount === 1) return "ONE_PAIR";
    if (jokerCount === 2) return "THREE_OF_A_KIND";
    if (jokerCount === 3) return "FOUR_OF_A_KIND";
    if (jokerCount === 4) return "FIVE_OF_A_KIND";
  }

  return handTypeWithoutJokers;
};

const lines = readLines("src/07/inputs/input.txt");
const results = lines.map(parseLine);

const part1 = results
  .sort(({ hand: hand1 }, { hand: hand2 }) =>
    compareHands(hand1, hand2, getHandType, {
      A: 12,
      K: 11,
      Q: 10,
      J: 9,
      T: 8,
      9: 7,
      8: 6,
      7: 5,
      6: 4,
      5: 3,
      4: 2,
      3: 1,
      2: 0,
    })
  )
  .map((result, i) => ({ ...result, rank: i + 1 }))
  .map(({ bid, rank }) => bid * rank)
  .reduce((a, b) => a + b);

console.log("Part 1:", part1);

const part2 = results
  .sort(({ hand: hand1 }, { hand: hand2 }) =>
    compareHands(hand1, hand2, getHandTypeWithJokers, {
      A: 12,
      K: 11,
      Q: 10,
      J: -1,
      T: 8,
      9: 7,
      8: 6,
      7: 5,
      6: 4,
      5: 3,
      4: 2,
      3: 1,
      2: 0,
    })
  )
  .map((result, i) => ({ ...result, rank: i + 1 }))
  .map(({ bid, rank }) => bid * rank)
  .reduce((a, b) => a + b);

console.log("Part 2:", part2);
