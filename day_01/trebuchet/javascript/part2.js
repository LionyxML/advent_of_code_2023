const fs = require("fs");

// A more "general" solution for overlapping
// would be one -> one1one, etc.
//
// This is good enough, since AOC simply "forgot" to mention
// there could be overlapping and what they wanted as a result
// of something like "eightwo" or "twone" (spoiler: 82 and 21).
const digits = {
  one: "1e",
  two: "t2o",
  three: "t3e",
  four: "f4r",
  five: "f5e",
  six: "6",
  seven: "s7n",
  eight: "e8t",
  nine: "n9e",
};

const fileContent = (fileName) => {
  try {
    let fileContent = fs.readFileSync(fileName, "utf-8");

    for (const [key, value] of Object.entries(digits)) {
      fileContent = fileContent.replace(new RegExp(key, "g"), value);
    }

    return fileContent.split("\n").map((line) => line.trim());
  } catch {
    console.error(`Error importing: ${fileName}\n`);
    return [];
  }
};

const fileName = process.argv.at(2);

if (fileName) {
  const lines = fileContent(fileName);

  const result = lines
    .map((line) => String(line.replace(/[A-Za-z]/g, "")))
    .map((line) => `${line.charAt(0)}${line.charAt(line.length - 1)}`)
    .reduce((acc, cur) => +acc + +cur, 0);

  console.log(result);
} else {
  console.error("Usage: node index.ts <filename>");
}
