use std::fs;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum SeatStatus {
    Empty,
    Occupied,
    Floor,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct Seat {
    x: i32,
    y: i32,
    status: SeatStatus,
}

fn read_seat_map(filename: &str) -> Vec<Vec<Seat>> {
    let content = fs::read_to_string(filename).unwrap();
    let mut seat_map = Vec::new();
    let mut i = 0;
    for _row in content.split_whitespace() {
        let mut row = Vec::new();
        for j in 0.._row.len() {
            let seat_type = match _row.chars().nth(j) {
                Some('L') => SeatStatus::Empty,
                Some('.') => SeatStatus::Floor,
                _ => SeatStatus::Floor,
            };
            let seat = Seat {
                x: i,
                y: j as i32,
                status: seat_type,
            };
            row.push(seat);
        }
        i += 1;
        seat_map.push(row);
    }
    seat_map
}

fn print_seat_map(seat_map: &Vec<Vec<Seat>>) {
    for i in 0..seat_map.len() {
        for j in 0..seat_map[i].len() {
            let symbol = match seat_map[i][j].status {
                SeatStatus::Floor => ".",
                SeatStatus::Empty => "L",
                SeatStatus::Occupied => "#",
            };
            print!("{}", symbol);
        }
        println!();
    }
}

fn get_directions() -> Vec<(i32, i32)> {
    vec![
        (-1, -1),
        (-1, 0),
        (-1, 1),
        (0, -1),
        (0, 1),
        (1, -1),
        (1, 0),
        (1, 1),
    ]
}

fn get_neighbours(seat_map: &Vec<Vec<Seat>>, x: usize, y: usize) -> Vec<Seat> {
    let width = seat_map[0].len() as usize;
    let height = seat_map.len() as usize;

    // REFACTOR: this function can be refactor similar to get_visible_neigbours

    let points = match (x, y) {
        // four corners
        (_x, _y) if _x == 0 && _y == 0 => vec![(x + 1, y), (x, y + 1), (x + 1, y + 1)],
        (_x, _y) if _x == width - 1 && _y == height - 1 => {
            vec![(x - 1, y), (x, y - 1), (x - 1, y - 1)]
        }
        (_x, _y) if _x == 0 && _y == height - 1 => vec![(x + 1, y), (x, y - 1), (x + 1, y - 1)],
        (_x, _y) if _x == width - 1 && _y == 0 => vec![(x - 1, y), (x, y + 1), (x - 1, y + 1)],
        // for side
        (_x, _) if _x == 0 => vec![
            (x + 1, y),
            (x + 1, y + 1),
            (x + 1, y - 1),
            (x, y + 1),
            (x, y - 1),
        ],
        (_x, _) if _x == width - 1 => vec![
            (x - 1, y),
            (x - 1, y + 1),
            (x - 1, y - 1),
            (x, y + 1),
            (x, y - 1),
        ],
        (_, _y) if _y == 0 => vec![
            (x - 1, y),
            (x - 1, y + 1),
            (x + 1, y),
            (x + 1, y + 1),
            (x, y + 1),
        ],
        (_, _y) if _y == height - 1 => vec![
            (x - 1, y),
            (x - 1, y - 1),
            (x + 1, y),
            (x + 1, y - 1),
            (x, y - 1),
        ],
        // others inside
        (_, _) => vec![
            (x - 1, y),
            (x - 1, y + 1),
            (x - 1, y - 1),
            (x, y + 1),
            (x, y - 1),
            (x + 1, y),
            (x + 1, y + 1),
            (x + 1, y - 1),
        ],
    };
    let mut neighbours = Vec::new();
    for point in points {
        neighbours.push(seat_map[point.1][point.0]);
    }
    neighbours
}

fn get_visible_neighbours(seat_map: &Vec<Vec<Seat>>, x: usize, y: usize) -> Vec<Seat> {
    let width = seat_map[0].len() as i32;
    let height = seat_map.len() as i32;
    let mut visible_neighbours = Vec::new();
    for direction in get_directions() {
        let mut _x = x as i32;
        let mut _y = y as i32;
        loop {
            _x += direction.0;
            _y += direction.1;
            if _x < 0 || _y < 0 || _x >= width || _y >= height {
                break;
            }
            let j = _x as usize;
            let i = _y as usize;
            if seat_map[i][j].status != SeatStatus::Floor {
                visible_neighbours.push(seat_map[i][j]);
                break;
            }
        }
    }
    visible_neighbours
}

fn count_occupied_seats(seats: &Vec<Seat>) -> usize {
    seats
        .iter()
        .filter(|seat| matches!(seat.status, SeatStatus::Occupied))
        .count()
}

fn count_occupied_seat_map(seat_map: &Vec<Vec<Seat>>) -> usize {
    let mut occupied = 0;
    for row in seat_map {
        occupied += count_occupied_seats(row);
    }
    occupied
}

fn evolute(seat_map: &Vec<Vec<Seat>>, extended: bool) -> Vec<Vec<Seat>> {
    let mut copy = seat_map.to_vec();

    for i in 0..seat_map.len() {
        for j in 0..seat_map[i].len() {
            let seat = &seat_map[i][j];
            if matches!(seat.status, SeatStatus::Floor) {
                continue;
            }
            let mut neighbours = Vec::new();
            let mut threshold = 4;
            if extended {
                neighbours = get_visible_neighbours(seat_map, j, i);
                threshold = 5;
            } else {
                neighbours = get_neighbours(seat_map, j, i);
            }
            let count_occupied = count_occupied_seats(&neighbours);
            match seat.status {
                SeatStatus::Empty => {
                    if count_occupied == 0 {
                        copy[i][j].status = SeatStatus::Occupied
                    }
                }
                SeatStatus::Occupied => {
                    if count_occupied >= threshold {
                        copy[i][j].status = SeatStatus::Empty
                    }
                }
                _ => {}
            };
        }
    }
    copy
}

fn minimize(seat_map: &Vec<Vec<Seat>>, should_print: bool, extended: bool) -> Vec<Vec<Seat>> {
    let mut copy = seat_map.to_vec();
    loop {
        if should_print {
            print_seat_map(&copy);
            println!("------------");
        }
        let evolved = evolute(&copy, extended);
        if evolved == copy {
            break;
        }
        copy = evolved;
    }
    copy
}

fn main() {
    println!("PART ONE");
    let test_seat_map = read_seat_map("input_test.txt");
    let minimized_test_seat_map = minimize(&test_seat_map, false, false);
    println!(
        "Test: Occupied: {}",
        count_occupied_seat_map(&minimized_test_seat_map)
    );
    let seat_map = read_seat_map("input.txt");
    //let minimized_seat_map = minimize(&seat_map, false, false);
    //println!("Occupied: {}", count_occupied_seat_map(&minimized_seat_map));

    println!("PART TWO");
    let minimized_test_seat_map = minimize(&test_seat_map, true, true);
    println!(
        "Test: Occupied: {}",
        count_occupied_seat_map(&minimized_test_seat_map)
    );
    let minimized_seat_map = minimize(&seat_map, true, true);
    println!("Occupied: {}", count_occupied_seat_map(&minimized_seat_map));
}
