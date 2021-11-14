import { read_program, Instruction } from "./common";

function eval_acc(program: Array<Instruction>): Array<any> {
  let acc = 0;
  let pointer = 0;
  let visited = new Array();
  let possible_interect = new Array();
  while (!visited.includes(pointer) || pointer > program.length) {
    let instruction = program[pointer];
    visited.push(pointer);
    if (instruction.command == "acc") {
      acc += instruction.value;
      pointer += 1;
    }
    if (instruction.command == "jmp") {
      possible_interect.push(pointer);
      pointer += instruction.value;
    }
    if (instruction.command == "nop") {
      possible_interect.push(pointer);
      pointer += 1;
    }
  }
  return [acc, visited, possible_interect];
}

function find_error(program: Array<Instruction>): number {
  let [acc, visited, possible_intersect] = eval_acc(program);
  for (let i in possible_intersect) {
    let intersect = possible_intersect[i];
    let new_program = Array.from(program);
    let new_command = new_program[intersect].command == "nop" ? "jmp" : "nop";
    new_program[intersect] = new Instruction(new_command, new_program[intersect].value);
    let _ = new Array();
    [acc, visited, _] = eval_acc(new_program);
    if (visited[visited.length - 1] + 1 == program.length) {break;}
  }
  return acc;
}

let test_program = read_program("input_test.txt")
console.log("TEST: ", find_error(test_program) == 8 ? "OK" : "error");

let program = read_program("input.txt");
console.log("Result: ", find_error(program));
