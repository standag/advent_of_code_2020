import * as fs from 'fs';

export class Instruction {

  command: string;
  value: number;

  constructor(command: string, value: number) {
    this.command = command;
    this.value = value;
  }

}

export function read_program(filename: string): Array<Instruction> {

  let instructions = new Array();
  const lines = fs.readFileSync(filename).toString().split('\n');
  for (let i in lines) {
    let [command, value] = lines[i].split(" ");
    instructions.push(new Instruction(command, Number(value)));
  }
  return instructions;
}
