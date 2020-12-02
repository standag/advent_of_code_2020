const input = await Deno.readTextFile("input.txt");

let result = 0;

let parse_line = function(line: string) {
if(!line) {return null;}
let [positions, _rule, password] = line.split(" ");
let rule = _rule[0];
let [first, second]  = positions?.split("-") || [0, 0];


 if(password[parseInt(first)-1] == rule && password[parseInt(second)-1] != rule)
{
	console.log("first", rule, first, second, password[parseInt(first)-1], password[parseInt(second)-1], password);
	result++;

}


 if(password[parseInt(first)-1] != rule && password[parseInt(second)-1] == rule)
{
	console.log("second", rule, first, second, password[parseInt(first)-1], password[parseInt(second)-1], password);
	result++;
}
}

input.split("\n").forEach(parse_line);
console.log(result)

