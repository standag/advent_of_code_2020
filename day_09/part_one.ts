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

function find_error(numbers: Array<number>, preamble: number): number {
  let pointer = preamble;
  // Array.slice to select a part of array
  for (let i = preamble; i < numbers.length; i++) {
    let number = numbers[i];
    if (!find_sum(number, numbers.slice(i-preamble, i))) {
      console.log(number);
      return number;
    }
  } 
  return -1;
}

let numbers = read_numbers("input_test.txt");
console.log("TEST: ", find_error(numbers, 5) == 127 ? "OK" : "error");

numbers = read_numbers("input.txt");
console.log("Result: ", find_error(numbers, 50));

