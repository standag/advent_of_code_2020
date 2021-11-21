use std::fs;

fn read_notes(filename: &str) -> (i32, Vec<i32>) {
    let mut buses = Vec::new();
    let content: Vec<String> = fs::read_to_string(filename)
        .unwrap()
        .split_whitespace()
        .map(|x| x.to_string())
        .collect::<Vec<String>>();
    for bus in content[1].split_terminator(",") {
        if bus == "x" {
            continue;
        }
        buses.push(bus.parse::<i32>().unwrap());
    }
    (content[0].parse::<i32>().unwrap(), buses)
}
fn find_closest_bus(time: i32, bus_numbers: &Vec<i32>) -> (i32, i32) {
    let mut closest_time = i32::MAX;
    let mut bus_with_closest_time = 0;
    for bus_number in bus_numbers {
        let diff = bus_number - time % bus_number;
        if diff < closest_time {
            closest_time = diff;
            bus_with_closest_time = *bus_number;
        }
        println!("{} {}", bus_number, time % bus_number);
    }
    (bus_with_closest_time, closest_time)
}
fn main() {
    println!("PART ONE");
    let test_notes = read_notes("input_test.txt");
    let test_result = find_closest_bus(test_notes.0, &test_notes.1);
    println!("Test result: {}", test_result.0 * test_result.1);
    let notes = read_notes("input.txt");
    let result = find_closest_bus(notes.0, &notes.1);
    println!("Result: {}", result.0 * result.1);
}
