import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";

export async function get_bps(filename: string): Promise<string[]> {
  return (await Deno.readTextFile(filename)).split("\n");
}

export function decode_bp(bp_code: string): number {
  let row_min = 0;
  let row_max = 127;
  for (let i = 0; i < 7; i++) {
    const letter = bp_code[i];
    const half = (row_max - row_min) / 2 >> 0;
    if (letter == "F") {
      row_max = row_max - 1 - half;
    } else if (letter == "B") {
      row_min = row_min + 1 + half;
    } else {
      throw (`Uknown row letter ${letter}`);
    }
    //console.log(row_min, row_max)
  }
  let row = -1;
  if (row_max == row_min) {
    row = row_max;
  } else {
    throw ("row not found");
  }

  let column_min = 0;
  let column_max = 7;
  for (let i = 7; i < 10; i++) {
    const letter = bp_code[i];
    const half = (column_max - column_min) / 2 >> 0;
    if (letter == "L") {
      column_max = column_max - 1 - half;
    } else if (letter == "R") {
      column_min = column_min + 1 + half;
    } else {
      throw (`Uknown column letter ${letter}`);
    }
    //console.log(column_min, column_max)
  }
  let column = -1;
  if (column_max == column_min) {
    column = column_max;
  } else {
    throw ("column not found");
  }

  return row * 8 + column;
}

let solve_puzzle = async function (filename: string): Promise<number> {
  const bps = await get_bps(filename);
  let max = -1;
  for (const i in bps) {
    const bp = bps[i];
    if (!bp) continue;
    const bp_id = decode_bp(bp);
    if (bp_id > max) max = bp_id;
  }
  return max;
};

console.log("Result", await solve_puzzle("input.txt"));

Deno.test("bp decode", () => {
  assertEquals(decode_bp("FBFBBFFRLR"), 357);
});

Deno.test("bp decode", () => {
  assertEquals(decode_bp("BFFFBBFRRR"), 567);
});

Deno.test("bp decode", () => {
  assertEquals(decode_bp("FFFBBBFRRR"), 119);
});

Deno.test("bp decode", () => {
  assertEquals(decode_bp("BBFFBBFRLL"), 820);
});
