const fs = require("fs");

const fileContent = (fileName) => {
  try {
    return fs
      .readFileSync(fileName, "utf-8")
      .split("\n")
      .map((line) => line.trim());
  } catch {
    console.error(`Error importing: ${fileName}\n`);
    return [];
  }
};

const fileName = process.argv.at(2);

if (fileName) {
  const lines = fileContent(fileName);
  const result = lines
    .map((line) => line.replace(/[^0-9]/g, ""))
    .map((line) => Number(`${line.at(0) ?? ""}${line.at(-1) ?? ""}`))
    .reduce((acc, cur) => acc + cur, 0);

  console.log(Number(result));
} else {
  console.error("Usage: node index.ts <filename>");
}
