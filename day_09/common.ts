import * as fs from 'fs';

export function read_numbers(filename: string): Array<number> {
  let numbers = new Array();
  const lines = fs.readFileSync(filename).toString().split('\n');
  for (let i in lines) {
    let value = lines[i];
    numbers.push(Number(value));
  }
  return numbers;
}
