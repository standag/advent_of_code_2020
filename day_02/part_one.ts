const input = await Deno.readTextFile("input.txt");

let result = 0;

let parse_line = function(line: string) {
 if(!line) {return null;}
 let [_range, _rule, password] = line.split(" ");
 let rule = _rule[0];
 let [_min, _max]  = _range?.split("-") || [0, 0];
 let count = password?.match(new RegExp(rule, "g"))?.length || 0;
 console.log(count, _min, _max);
 if(parseInt(_min) <= count && count <= parseInt(_max)) {
	result++;
}
}

input.split("\n").forEach(parse_line);
console.log(result)

