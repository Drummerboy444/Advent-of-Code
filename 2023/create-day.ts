import { writeFileSync, mkdirSync, readFileSync } from "fs";

const dayName = process.argv[2];

if (dayName === undefined) {
  console.log("You must provide a day name as the first argument");
  process.exit(1);
}

const packageDotJson: unknown = JSON.parse(
  readFileSync("package.json", "utf-8")
);

if (
  typeof packageDotJson !== "object" ||
  packageDotJson === null ||
  !("scripts" in packageDotJson) ||
  typeof packageDotJson.scripts !== "object" ||
  packageDotJson.scripts === null
) {
  console.log("Cannot write new script to package.json");
  process.exit(1);
}

const INDEX_FILE_CONTENT = `import { readLines } from "../utils/file-reading";

const lines = readLines("src/${dayName}/inputs/input.txt");

console.log(lines);
`;

mkdirSync(`src/${dayName}`);
writeFileSync(`src/${dayName}/index.ts`, INDEX_FILE_CONTENT, "utf-8");

mkdirSync(`src/${dayName}/inputs`);
writeFileSync(`src/${dayName}/inputs/input.txt`, "", "utf-8");
writeFileSync(`src/${dayName}/inputs/input.test.txt`, "", "utf-8");

packageDotJson.scripts = {
  ...packageDotJson.scripts,
  [`${dayName}`]: `ts-node src/${dayName}/index.ts`,
};

writeFileSync(
  "package.json",
  `${JSON.stringify(packageDotJson, undefined, "  ")}\n`
);
