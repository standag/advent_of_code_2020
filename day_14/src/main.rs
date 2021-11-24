use regex::Regex;
use std::fs;

#[derive(Debug)]
struct MemOperation {
    mem_position: i32,
    value: i32,
}

#[derive(Debug)]
struct Instruction {
    mask: String,
    mem_operations: Vec<MemOperation>,
}

fn read_instructions(filename: &str) -> Vec<Instruction> {
    let mut instructions = vec![];
    let mut raw_mask: String = "".to_string();
    let mut raw_operations: Vec<MemOperation> = vec![];
    for line in fs::read_to_string(filename).unwrap().split_terminator("\n") {
        let mask_re = Regex::new(r"^mask = ([X10]*)$").unwrap();
        let ope_re = Regex::new(r"mem\[([0-9]*)\] = ([0-9]*)").unwrap();
        let mask_caps = mask_re.captures(line);
        let ope_caps = ope_re.captures(line);
        println!("{:?} {:?}", mask_caps, ope_caps);
        if !mask_caps.is_none() {
            raw_mask = mask_caps.unwrap()[1].to_string();
            raw_operations = vec![];
        } else if !ope_caps.is_none() {
            raw_operations.push(MemOperation {
                mem_position: ope_caps.as_ref().unwrap()[1].parse::<i32>().unwrap(),
                value: ope_caps.as_ref().unwrap()[2].parse::<i32>().unwrap(),
            });
        } else {
            panic!();
        }
    }
    instructions.push(Instruction {
        mask: raw_mask,
        mem_operations: raw_operations,
    });
    instructions
}

fn main() {
    println!("PART ONE");
    let test_instructions = read_instructions("input_test.txt");
    println!("{:?}", test_instructions);
    println!("{}", 101>>1);
}
