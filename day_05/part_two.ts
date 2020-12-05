import { decode_bp, get_bps } from "./part_one.ts";

let solve_puzzle = async function (filename: string): Promise<number> {
  const bps = await get_bps(filename);
  let bp_ids = [];
  for (const i in bps) {
    const bp = bps[i];
    if (!bp) continue;
    bp_ids.push(decode_bp(bp));
  }
  bp_ids = bp_ids.sort();
  for (let i = 0; i < bp_ids.length; i++) {
    const id = bp_ids[i];
    if (bp_ids[i + 1] == id + 2) {
      return id + 1;
    }
  }
  return -1;
};

console.log("Result", await solve_puzzle("input.txt"));
