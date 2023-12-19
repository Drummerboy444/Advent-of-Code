import { readFile } from "../utils/file-reading";

const RATING_TYPES = ["x", "m", "a", "s"] as const;
type RatingType = (typeof RATING_TYPES)[number];
const isRatingType = (
  maybeRatingType: unknown
): maybeRatingType is RatingType =>
  RATING_TYPES.includes(maybeRatingType as RatingType);
type WorkflowRule =
  | { type: "CONSTANT"; destination: string }
  | {
      type: "CONDITION";
      ratingType: RatingType;
      operand: ">" | "<";
      value: number;
      destination: string;
    };
type Workflow = { id: string; rules: WorkflowRule[] };
type PartRating = Record<RatingType, number>;

const parseWorkflowRule = (stringWorkflowRule: string): WorkflowRule => {
  if (!stringWorkflowRule.includes(":"))
    return { type: "CONSTANT", destination: stringWorkflowRule };

  const [stringCondition, destination] = stringWorkflowRule.split(":");

  if (stringCondition === undefined || destination === undefined)
    throw new Error();

  const isLessThan = stringCondition.includes("<");

  const [ratingType, stringValue] = stringCondition.split(
    isLessThan ? "<" : ">"
  );

  if (ratingType === undefined || stringValue === undefined) throw new Error();

  if (!isRatingType(ratingType)) throw new Error();

  return {
    type: "CONDITION",
    ratingType,
    operand: isLessThan ? "<" : ">",
    value: parseInt(stringValue),
    destination,
  };
};

const parseWorkflow = (stringWorkflow: string): Workflow => {
  const commaSeparatedStringWorkflow = stringWorkflow
    .replace("{", ",")
    .replace("}", "");

  const [id, ...stringWorkflowRules] = commaSeparatedStringWorkflow.split(",");

  if (id === undefined) throw new Error();

  return { id, rules: stringWorkflowRules.map(parseWorkflowRule) };
};

const parsePartRating = (stringPartRating: string): PartRating => {
  const individualPartRatings = stringPartRating
    .replace("{", "")
    .replace("}", "")
    .split(",");

  const partRating: PartRating = { x: 0, m: 0, a: 0, s: 0 };

  individualPartRatings.forEach((individualPartRating) => {
    const [key, value] = individualPartRating.split("=");
    if (key === undefined || value === undefined || !isRatingType(key))
      throw new Error();
    partRating[key] = parseInt(value);
  });

  return partRating;
};

const parseFile = (
  file: string
): {
  workflowLookup: Record<string, Workflow>;
  partRatings: PartRating[];
} => {
  const [stringWorkflows, stringPartRatings] = file.split("\n\n");

  if (stringWorkflows === undefined || stringPartRatings === undefined)
    throw new Error();

  const workflows = stringWorkflows.split("\n").map(parseWorkflow);
  const workflowLookup = workflows.reduce<Record<string, Workflow>>(
    (lookup, workflow) => {
      lookup[workflow.id] = workflow;
      return lookup;
    },
    {}
  );

  const partRatings = stringPartRatings.split("\n").map(parsePartRating);

  return {
    workflowLookup,
    partRatings,
  };
};

const doesRuleApply =
  (partRating: PartRating) =>
  (rule: WorkflowRule): boolean => {
    if (rule.type === "CONSTANT") return true;

    const { ratingType, operand, value } = rule;

    return operand === "<"
      ? partRating[ratingType] < value
      : partRating[ratingType] > value;
  };

const processPartRating = (
  workflowLookup: Record<string, Workflow>,
  partRating: PartRating
): "A" | "R" => {
  const inWorkflow = workflowLookup.in;
  if (inWorkflow === undefined) throw new Error();
  let currentWorkflow = inWorkflow;

  while (true) {
    const applicableRule = currentWorkflow.rules.find(
      doesRuleApply(partRating)
    );

    if (applicableRule === undefined) throw new Error();

    const destination = applicableRule.destination;

    if (destination === "A" || destination === "R") return destination;

    const nextWorkflow = workflowLookup[destination];

    if (nextWorkflow === undefined) throw new Error();

    currentWorkflow = nextWorkflow;
  }
};

const file = readFile("src/19/inputs/input.txt");
const { workflowLookup, partRatings } = parseFile(file);
const partRatingsWithOutput = partRatings.map((partRating) => ({
  ...partRating,
  output: processPartRating(workflowLookup, partRating),
}));

const part1 = partRatingsWithOutput
  .filter(({ output }) => output === "A")
  .map(({ x, m, a, s }) => x + m + a + s)
  .reduce((a, b) => a + b, 0);

console.log("Part 1:", part1);
