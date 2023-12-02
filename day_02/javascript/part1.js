const fs = require("fs");

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

/**
 * Reads the content of a file, splits it into lines, and returns an array.
 *
 * @param {string} fileName - The name of the file to read.
 * @returns {string[]} - An array containing each line of the file as a string.
 *   Returns an empty array if there is an error reading the file.
 */
const fileContentToArray = (fileName) => {
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

/**
 * Extracts the game number from a given line.
 *
 * @param {string[]} line - An array representing a line of game data.
 * @returns {number} - The extracted game number.
 */
const getGameNum = (line) => Number(line.at(0));

/**
 * Extracts the game number from a given line.
 *
 * @param {string[]} line - An array representing a line of game data.
 * @returns {number} - The extracted game number.
 */
const getDraws = (line) => line.toSpliced(0, 1);

/**
 * Formats the draws information for a game line, including game number and draw
 *  details.
 *
 * @param {string[]} line - An array representing a line of game data.
 * @returns {number[]} - An array containing the formatted game data.
 *   Format: [gameNum, [r, g, b], [r, g, b], ...]
 */
const formatDraws = (line) => {
  const gameNum = getGameNum(line);
  const gameDraws = getDraws(line).map((draws) => {
    let r = 0;
    let g = 0;
    let b = 0;

    for (let draw of draws) {
      if (draw.match("red")) r += Number(draw.replace("red", "").trim());
      if (draw.match("green")) g += Number(draw.replace("green", "").trim());
      if (draw.match("blue")) b += Number(draw.replace("blue", "").trim());
    }

    return [r, g, b];
  });

  const formatedDraws = gameDraws;

  return [gameNum, ...formatedDraws];
};

/**
 * Parses an array of lines representing game data.
 *
 * @param {string[]} lines - An array of lines in the format:
 *   Game 1: 10 green, 9 blue, 1 red; 1 red, 7 green; 11 green, 6 blue; 8 blue, 12 green
 *   Game 2: 11 red, 7 green, 3 blue; 1 blue, 8 green, 5 red; 2 red, 12 green, 1 blue; 10 green, 5 blue, 7 red
 *
 * @returns {number[][][]} - Parsed data in the format:
 *   [
 *     [1, [10, 9, 1], [1, 0, 7], [0, 11, 6], [0, 12, 8]],
 *     [2, [11, 7, 3], [5, 8, 1], [2, 12, 1], [7, 10, 5]],
 *     ...
 *   ]
 *   where each element represents a game, and each game has an array of draws.
 */
const parseLines = (lines = []) =>
  lines
    .map((line) => line.replace("Game ", "").replace(":", ";"))
    .map((line) => line.split(";"))
    .map((line) => line.map((col) => col.split(",")))
    .map((line) => [getGameNum(line), ...getDraws(line)])
    .map((line) => formatDraws(line));

/**
 * Checks the validity of games based on the parsed lines output style.
 *
 * @param {number[][][]} lines - Parsed game data in the format:
 *   [
 *     [1, [10, 9, 1], [1, 0, 7], [0, 11, 6], [0, 12, 8]],
 *     [2, [11, 7, 3], [5, 8, 1], [2, 12, 1], [7, 10, 5]],
 *     ...
 *   ]
 * @returns {number[]} - An array containing the numbers of valid games.
 */
const checkValidGames = (lines = []) =>
  lines
    .map((line) =>
      [...getDraws(line)].map((draw) => [
        getGameNum(line),
        draw[0] <= MAX_RED && draw[1] <= MAX_GREEN && draw[2] <= MAX_BLUE,
      ]),
    )
    .map(
      (game) =>
        game.map((draw) => draw.at(1)).reduce((acc, cur) => acc && cur, true) &&
        game[0],
    )
    .filter(Boolean)
    .map((game) => getGameNum(game));

/**
 * Sums the numbers of valid games.
 *
 * @param {number[]} games - An array containing the numbers of valid games.
 * @returns {number} - The sum of the numbers of valid games.
 */
const sumValidGames = (games = []) => games.reduce((acc, cur) => acc + cur, 0);

/**
 * Main function for processing game data from a file.
 * Reads the content of the specified file, parses the lines, and outputs the result.
 *
 * @returns {void} - Outputs the parsed result to the console.
 */
const main = () => {
  const fileName = process.argv.at(2);

  if (fileName) {
    const result = sumValidGames(
      checkValidGames(parseLines(fileContentToArray(fileName))),
    );

    console.log(result);
  } else {
    console.error("Usage: node index.ts <filename>");
  }
};

main();
