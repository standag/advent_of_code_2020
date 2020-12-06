import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";

export async function read_answers(filename: string): Promise<Array<string[]>> {
  let answers = [];
  let group = [];
  const data = (await Deno.readTextFile(filename)).split("\n");
  for (let i in data) {
    const line = data[i];
    if (!line) {
      answers.push(group);
      group = [];
      continue;
    }
    group.push(line);
  }
  return answers;
}

function calculate(answers: Array<string[]>): number {
  let number_of_yes = 0;
  for (let i in answers) {
    const group_answers = answers[i].join("");
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    for (let j in letters) {
      const letter = letters[j];
      if (group_answers.includes(letter)) {
        number_of_yes++;
      }
    }
  }
  return number_of_yes;
}

async function solve_puzzle(filename: string): Promise<number> {
  const answers = await read_answers(filename);
  return calculate(answers);
}

Deno.test("solve puzzle", async () => {
  assertEquals(await solve_puzzle("input_test.txt"), 11);
});

console.log(await solve_puzzle("input.txt"));
