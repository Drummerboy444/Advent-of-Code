const day = Deno.args[0];

if (day === undefined) {
  console.log("No day specified");
  Deno.exit();
}

const runDayFileName = `./days/${day}/run.ts`;

try {
  await Deno.lstat(runDayFileName);
} catch {
  console.log("Day does not exist");
  Deno.exit();
}

await import(runDayFileName);
