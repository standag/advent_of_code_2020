import { read_numbers } from "./common";

function find_sum(sum: number, numbers: Array<number>):boolean {
  console.log(sum, numbers);
  let size = numbers.length
  for (let i=0; i < size; i++) {
    for (let j=i; j < size; j++) {
      if (numbers[i]+numbers[j] == sum) {
        return true;
      }
    }
  }
  return false; 
}

function find_contiguous_list(target: number, numbers: Array<number>): Array<number> {
  let size = numbers.length
  for (let i=0; i < size; i++) {
    let selection = new Array();
    for (let j=i; j < size; j++) {
      selection.push(numbers[j]);
      let sum = selection.reduce((a, b) => a + b, 0);
      if (target == sum) {
        return selection;
      }
      else if (target < sum) {
        break;
      }
    }
  }
  return [];
}

function find_weakness(numbers: Array<number>, preamble: number): number {
  let pointer = preamble;
  // Array.slice to select a part of array
  for (let i = preamble; i < numbers.length; i++) {
    let number = numbers[i];
    if (!find_sum(number, numbers.slice(i-preamble, i))) {
      let sequence = find_contiguous_list(number, numbers.slice(0,i));
      let min = Math.min(...sequence);
      let max = Math.max(...sequence);
      return min+max;
    }
  } 
  return -1;
}

let numbers = read_numbers("input_test.txt");
console.log("TEST: ", find_weakness(numbers, 5) == 62 ? "OK" : "error");

numbers = read_numbers("input.txt");
console.log("Result: ", find_weakness(numbers, 50));

