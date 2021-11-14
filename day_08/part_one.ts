import { read_program, Instruction } from "./common";

function eval_acc(program: Array<Instruction>): Array<any> {
  let acc = 0;
  let pointer = 0;
  let visited = new Array();
  while (! visited.includes(pointer) || pointer > program.length) {
    let instruction = program[pointer];
    visited.push(pointer);
    if (instruction.command == "acc") {
      acc += instruction.value;
      pointer += 1;
    }
    if (instruction.command == "jmp") {
      pointer += instruction.value;
    }
    if (instruction.command == "nop") {
      pointer += 1;
    }

    
  }
  return [acc, visited];
}

let test_program = read_program("input_test.txt")
console.log("TEST: ", eval_acc(test_program)[0] == 5 ? "OK" : "error");

let program = read_program("input.txt");
console.log("Result: ", eval_acc(program));
