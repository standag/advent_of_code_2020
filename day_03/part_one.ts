import {
	assertEquals,
} from "https://deno.land/std@0.79.0/testing/asserts.ts";

let solve_puzzle = function(map: string[]) {
	let modus = map[0].length;
	let size = map.length;
	console.log(map[0], modus, size);

	let number_of_tree = 0;
	let number_of_free = 0;
	
	for(let vert_position = 0; vert_position < size; vert_position++) {
		if(map[vert_position]==null){break;}
		let horz_position = vert_position*3 % modus
		let spot = map[vert_position][horz_position];
		if(spot == "#") {number_of_tree++;}
		else if (spot == ".") {number_of_free++;} 
	}

	console.log(number_of_tree, number_of_free);

	return number_of_tree
}


Deno.test("test on example data", async () => {
	let result = solve_puzzle((await Deno.readTextFile("input_test.txt")).split("\n"));
	assertEquals(result, 7)
});

solve_puzzle((await Deno.readTextFile("input.txt")).split("\n");
