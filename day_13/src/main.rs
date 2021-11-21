use std::fs;

fn read_notes(filename: &str) -> (i32, Vec<Option<i32>>) {
    let mut buses = Vec::new();
    let content: Vec<String> = fs::read_to_string(filename)
        .unwrap()
        .split_whitespace()
        .map(|x| x.to_string())
        .collect::<Vec<String>>();
    for bus in content[1].split_terminator(",") {
        if bus == "x" {
            buses.push(None);
        } else {
            buses.push(Some(bus.parse::<i32>().unwrap()));
        }
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

fn _find_max_position(opt_seq: &Vec<Option<i32>>) -> (i64, i64) {
    let mut max = i64::MIN;
    let mut position: i64 = -1;
    for i in 0..opt_seq.len() {
        if opt_seq[i].is_none() {
            continue;
        }
        let number = opt_seq[i].unwrap() as i64;
        if number > max {
            max = number;
            position = i as i64;
        }
    }
    (max, position)
}

fn find_time_of_consecutive_buses_brute_force(buses: &Vec<Option<i32>>) -> i64 {
    let (max, position) = _find_max_position(&buses);
    let mut time: i64 = max - position;
    'outer: loop {
        time += max;
        print!("\r{} {:.2}%", time, time/100000000000000*100);
        for i in 0..buses.len() {
            let bus = buses[i];
            if bus.is_none() {
                continue;
            }
            if (time + i as i64) % bus.unwrap() as i64 != 0 {
                continue 'outer;
            }
        }
        break;
    }
    print!("\r");
    time
}

fn main() {
    println!("PART ONE");
    let test_notes = read_notes("input_test.txt");
    let test_result = find_closest_bus(
        test_notes.0,
        &test_notes
            .1
            .iter()
            .filter(|x| !x.is_none())
            .map(|x| x.unwrap())
            .collect(),
    );
    println!("Test result: {}", test_result.0 * test_result.1);
    let notes = read_notes("input.txt");
    let result = find_closest_bus(
        notes.0,
        &notes
            .1
            .iter()
            .filter(|x| !x.is_none())
            .map(|x| x.unwrap())
            .collect(),
    );
    println!("Result: {}", result.0 * result.1);
    println!("PART TWO");
    println!(
        "Test result {:?}",
        find_time_of_consecutive_buses_brute_force(&test_notes.1)
    );

    println!(
        "Result for 67,7 {:?}",
        find_time_of_consecutive_buses_brute_force(&vec![Some(67), Some(7)])
    );
    println!(
        "Result for 67,x,7 {:?}",
        find_time_of_consecutive_buses_brute_force(&vec![Some(67),None, Some(7)])
    );
    //println!(
    //    "Result {:?}",
    //    find_time_of_consecutive_buses_brute_force(&notes.1)
    //);
}
