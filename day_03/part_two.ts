import {
	assertEquals,
} from "https://deno.land/std@0.79.0/testing/asserts.ts";

let calculate_way = function(map: string[], right: number, down: number): number {
	let modus = map[0].length;
	let size = map.length;

	let number_of_tree = 0;
	let number_of_free = 0;
	
	for(let i = 0; i < size; i++) {
		let vert_position = i*down;
		if(map[vert_position]==null){break;}
		let horz_position = i*right % modus
		let spot = map[vert_position][horz_position];
		if(spot == "#") {number_of_tree++;}
		else if (spot == ".") {number_of_free++;} 
	}

	return number_of_tree
}

let get_map = async function(filename: string): Promise<string[]> {
	return (await Deno.readTextFile(filename)).split("\n")
}

let solve_puzzle = async function(filename: string): Promise<number> {
	let map = await get_map(filename);
	let trees: number[] = [];
	trees.push(calculate_way(map, 1, 1));
	trees.push(calculate_way(map, 3, 1));
	trees.push(calculate_way(map, 5, 1));
	trees.push(calculate_way(map, 7, 1));
	trees.push(calculate_way(map, 1, 2));

	return trees[0]	* trees[1] * trees[2] * trees[3] * trees[4]
}

Deno.test("test way right=3 down=1", async() => {
	let map = await get_map("input_test.txt");
	assertEquals(calculate_way(map, 3, 1), 7);
})

Deno.test("test way right=1 down=1", async() => {
	let map = await get_map("input_test.txt");
	assertEquals(calculate_way(map, 1, 1), 2);
})

Deno.test("test way right=5 down=1", async() => {
	let map = await get_map("input_test.txt");
	assertEquals(calculate_way(map, 5, 1), 3);
})

Deno.test("test way right=7 down=1", async() => {
	let map = await get_map("input_test.txt");
	assertEquals(calculate_way(map, 7, 1), 4);
})

Deno.test("test way right=1 down=2", async() => {
	let map = await get_map("input_test.txt");
	assertEquals(calculate_way(map, 1, 2), 2);
})

Deno.test("test on example data", async () => {
	let result = await solve_puzzle("input_test.txt");
	assertEquals(result, 336);
});

let result = await solve_puzzle("input.txt");
console.log("Result", result);

let map = await get_map("input_test.txt");
calculate_way(map, 1, 2);
