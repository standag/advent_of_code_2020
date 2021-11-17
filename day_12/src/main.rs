use std::fs;

#[derive(Debug, PartialEq, Clone, Copy)]
enum Direction {
    North,
    South,
    East,
    West,
}

#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

#[derive(Debug)]
struct Ship {
    direction: Direction,
    position: Point,
    waypoint: Point,
}

impl Ship {
    fn new() -> Ship {
        Ship {
            direction: Direction::East,
            position: Point { x: 0, y: 0 },
            waypoint: Point { x: 10, y: 1 },
        }
    }
}

fn rotate(direction: &Direction, angle: i32) -> Direction {
    let directions = vec![
        Direction::East,
        Direction::North,
        Direction::West,
        Direction::South,
    ];
    let mut index = directions.iter().position(|d| d == direction).unwrap() as i32;
    index = (4 + index + (angle / 90)) % 4;
    println!("{:?} {} {}", direction, angle, index);
    directions[index as usize]
}

impl Ship {
    fn follow_instructions(&mut self, instructions: &Vec<Instruction>) -> &mut Self {
        for instruction in instructions {
            match instruction.action {
                Action::Forward => match self.direction {
                    Direction::East => self.position.x += instruction.value,
                    Direction::North => self.position.y += instruction.value,
                    Direction::South => self.position.y -= instruction.value,
                    Direction::West => self.position.x -= instruction.value,
                },
                Action::East => self.position.x += instruction.value,
                Action::North => self.position.y += instruction.value,
                Action::South => self.position.y -= instruction.value,
                Action::West => self.position.x -= instruction.value,
                Action::Right => self.direction = rotate(&self.direction, -instruction.value),
                Action::Left => self.direction = rotate(&self.direction, instruction.value),
                _ => (),
            };
            println!("{:?}", instruction);
        }
        self
    }
}

fn rotate_waypoint(waypoint: &Point, rotate: i32) -> Point {
    let mut new_waypoint = Point {
        x: waypoint.x,
        y: waypoint.y,
    };
    let vector = match rotate {
        x if x < 0 => Point { x: 1, y: -1 },
        _ => Point { x: -1, y: 1 },
    };
    for _ in 0..rotate.abs() / 90 % 4 {
        let tmp = new_waypoint.x;
        new_waypoint.x = new_waypoint.y * vector.x;
        new_waypoint.y = tmp * vector.y;
    }
    println!(
        "old waypoint: {:?}, new waypoint: {:?} rotate: {}",
        waypoint, new_waypoint, rotate
    );
    new_waypoint
}

impl Ship {
    fn follow_instructions_v2(&mut self, instructions: &Vec<Instruction>) -> &mut Self {
        for instruction in instructions {
            match instruction.action {
                Action::Forward => {
                    self.position.x += self.waypoint.x * instruction.value;
                    self.position.y += self.waypoint.y * instruction.value
                }
                Action::East => self.waypoint.x += instruction.value,
                Action::North => self.waypoint.y += instruction.value,
                Action::South => self.waypoint.y -= instruction.value,
                Action::West => self.waypoint.x -= instruction.value,
                Action::Right => {
                    self.waypoint = rotate_waypoint(&self.waypoint, -instruction.value)
                }
                Action::Left => self.waypoint = rotate_waypoint(&self.waypoint, instruction.value),
                _ => (),
            };
            //println!("{:?}", instruction);
        }
        self
    }
}

impl Ship {
    fn manhattan_distance(&self) -> i32 {
        self.position.x.abs() + self.position.y.abs()
    }
}

#[derive(Debug)]
enum Action {
    North,
    South,
    East,
    West,
    Left,
    Right,
    Forward,
    Unknown,
}

#[derive(Debug)]
struct Instruction {
    action: Action,
    value: i32,
}

fn read_instruction(filename: &str) -> Vec<Instruction> {
    let mut instructions = Vec::new();
    let content = fs::read_to_string(filename).unwrap();
    for instruction_row in content.split_whitespace() {
        //let mut row = Vec::new();
        let _action = instruction_row.chars().nth(0);
        let _value = &instruction_row[1..].parse::<i32>().unwrap();
        instructions.push(Instruction {
            action: match _action {
                Some('N') => Action::North,
                Some('S') => Action::South,
                Some('E') => Action::East,
                Some('W') => Action::West,
                Some('L') => Action::Left,
                Some('R') => Action::Right,
                Some('F') => Action::Forward,
                _ => Action::Unknown,
            },
            value: *_value,
        });
    }
    instructions
}

fn main() {
    println!("PART ONE");
    let test_instruction = read_instruction("input_test.txt");
    //println!("{:?}", test_instruction);
    let mut test_ship = Ship::new();
    let test_distance = test_ship
        .follow_instructions(&test_instruction)
        .manhattan_distance();
    println!("Test: Manhattan distance: {}", test_distance);

    let instruction = read_instruction("input.txt");
    let mut ship = Ship::new();
    let distance = ship.follow_instructions(&instruction).manhattan_distance();
    println!("Manhattan distance: {}", distance);

    println!("PART TWO");
    test_ship = Ship::new();
    let test_distance_v2 = test_ship
        .follow_instructions_v2(&test_instruction)
        .manhattan_distance();
    println!("Test: Manhattan distance: {}", test_distance_v2);
    println!("Ship position: {:?}", test_ship.position);
    ship = Ship::new();
    let distance_v2 = ship
        .follow_instructions_v2(&instruction)
        .manhattan_distance();
    println!("Manhattan distance: {}", distance_v2);
}
