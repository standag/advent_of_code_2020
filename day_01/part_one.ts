
const input = await Deno.readTextFile("input.txt");
let input_array = input.split("\n");

let numbers: number[] = [];
input_array.forEach(function (value){
  let number = parseInt(value)
  if(number > 0) {
    numbers.push(parseInt(value))
  }
})

let result: number = 0;

for(let i = 0; i < numbers.length; i++) {
  for(let j = i; j < numbers.length; j++) {
    console.log(numbers[i], numbers[j]);
    if(numbers[i]+numbers[j] == 2020) {
      result = numbers[i] * numbers[j]
    }
  }
}

console.log(numbers);
console.log(result)

