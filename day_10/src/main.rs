use std::fs;

fn get_sorted_adapters(filename: &str) -> Vec<i32> {
    let content = fs::read_to_string(filename).unwrap();
    let mut numbers = Vec::new();
    for x in content.split_whitespace() {
        numbers.push(x.to_string().parse::<i32>().unwrap());
    }
    numbers.sort();
    numbers
}

fn connect_adapters(adapters: &Vec<i32>) -> (i32, i32) {
    let mut one_diff = 0;
    let mut three_diff = 0;
    let mut last = 0;
    for adapter in adapters {
        let diff = adapter - last;
        if diff == 1 {
            one_diff += 1;
        }
        if diff == 3 {
            three_diff += 1;
            //println!("3 diff: last:{} current:{}", last, *adapter)
        }
        if diff > 3 {
            break;
        }
        last = *adapter;
    }
    three_diff += 1;
    (one_diff, three_diff)
}

fn combine_adapters(adapters: &Vec<i32>) -> i32 {
    let mut one_diff = 0;
    let mut three_diff = 0;
    let mut last = 0;
    let mut group = 0;
    let mut comb = 1;
    for adapter in adapters {
        let diff = adapter - last;
        if diff == 1 {
            one_diff += 1;
            group += 1;
        }
        if diff == 3 {
            three_diff += 1;
            //println!("3 diff: last:{} current:{}", last, *adapter)
            println!("group {}", group);
            if group == 2 {
                comb *= 2
            };
            if group == 3 {
                comb *= 4
            };
            if group == 4 {
                comb *= 7
            };
            group = 0;
        }
        if diff > 3 {
            break;
        }
        last = *adapter;
    }
    three_diff += 1;
    comb
}

fn main() {
    let mut small_test = vec![16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4];
    small_test.sort();
    println!("Part ONE:");
    let test_adapters = get_sorted_adapters("input_test.txt");
    let (one_diff, three_diff) = connect_adapters(&test_adapters);
    println!("1-diff: {}, 3-diff: {}", one_diff, three_diff);
    let adapters = get_sorted_adapters("input.txt");
    let (od, td) = connect_adapters(&adapters);
    println!("1-diff: {}, 3-diff: {}, result: {}", od, td, od * td);
    println!("{:?}", test_adapters);
    println!("Part TWO:");
    let small_test_comb = combine_adapters(&small_test);
    println!("{}", small_test_comb);
    let test_comb = combine_adapters(&test_adapters);
    println!("{}", test_comb);
}
