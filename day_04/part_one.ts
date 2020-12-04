import {
	assertEquals,
} from "https://deno.land/std@0.79.0/testing/asserts.ts";

let get_passports = async function(filename: string): Promise<{[index: string]: string}[]> {
  const data = (await Deno.readTextFile(filename)).split("\n")
  let passports: {[index: string]: string}[]  = []
  let passport: {[index: string]: string} = {}
  for(const i in data){
    const line = data[i]
    if(line == "") {
      passports.push(passport);
      passport = {}
      continue;
    }
    const line_data = line.split(" ")
    for(const j in line_data){
      let [key, value] = line_data[j].split(":");
      passport[key] = value;
    }
  } 
  return passports
}

let is_valid_passport = function(passport: {[index: string]: string}): boolean {
  return ("byr" in passport && "iyr" in passport && "eyr" in passport && "hgt" in passport && "hcl" in passport && "ecl" in passport && "pid" in passport)
}

let get_number_of_valid_passport = function (passports: {[index: string]: string}[]): number {
  let number_of_valid = 0;
  for(const i in passports){
    if(is_valid_passport(passports[i])){number_of_valid++}
  }
  return number_of_valid
}

Deno.test("test example data", async() => {
  let passports = await get_passports("input_test.txt")
  assertEquals(passports.length, 4)
  assertEquals(is_valid_passport(passports[0]), true)
  assertEquals(is_valid_passport(passports[1]), false)
  assertEquals(is_valid_passport(passports[2]), true)
  assertEquals(is_valid_passport(passports[3]), false)
  assertEquals(get_number_of_valid_passport(passports), 2)
})

let passports = await get_passports("input.txt");
console.log("Result", get_number_of_valid_passport(passports));
