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

let is_byr_valid = function(byr: string): boolean{
  const n = parseInt(byr)
  return (n >= 1920 && n <= 2002 && RegExp("^[0-9]{4}$").test(byr)) 
}

let is_iyr_valid = function(iyr: string): boolean{
  const n = parseInt(iyr)
  return (n >= 2010 && n <= 2020 && RegExp("^[0-9]{4}$").test(iyr)) 
}

let is_eyr_valid = function(eyr: string): boolean{
  const n = parseInt(eyr)
  return (n >= 2020 && n <= 2030 && RegExp("^[0-9]{4}$").test(eyr)) 
}

let is_hgt_valid = function(hgt: string): boolean{
  const n = parseInt(hgt)
  if(RegExp("^[0-9]{2,3}cm$").test(hgt) && n >= 150 && n <= 193) {return true;} 
  if(RegExp("^[0-9]{2,3}in$").test(hgt) && n >= 59 && n <= 76) {return true;}
  return false;
}

let is_hcl_valid = function(hcl: string): boolean {
  return RegExp("^#[0-9a-f]{6}$").test(hcl)
}

let is_ecl_valid = function(ecl: string): boolean {
  const valid_colors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
  return valid_colors.includes(ecl)
}

let is_pid_valid = function(pid: string): boolean {
  return RegExp("^[0-9]{9}$").test(pid)
}

let has_valid_values = function(passport: {[index: string]: string}): boolean {
  if(!is_byr_valid(passport["byr"])) {return false;}
  if(!is_iyr_valid(passport["iyr"])) {return false;}
  if(!is_eyr_valid(passport["eyr"])) {return false;}
  if(!is_hgt_valid(passport["hgt"])) {return false;}
  if(!is_hcl_valid(passport["hcl"])) {return false;}
  if(!is_ecl_valid(passport["ecl"])) {return false;}
  if(!is_pid_valid(passport["pid"])) {return false;}
  return true;
}

let get_number_of_valid_passport = function (passports: {[index: string]: string}[]): number {
  let number_of_valid = 0;
  for(const i in passports){
    if(is_valid_passport(passports[i])) {
      if(has_valid_values(passports[i])) {
        number_of_valid++;
      }
    }
  }
  return number_of_valid
}

Deno.test("byr validator", () => {
  assertEquals(is_byr_valid("2002"), true)
  assertEquals(is_byr_valid("2003"), false)
})

Deno.test("hgt validator", () => {
  assertEquals(is_hgt_valid("60in"), true)
  assertEquals(is_hgt_valid("190cm"), true)
  assertEquals(is_hgt_valid("190in"), false)
  assertEquals(is_hgt_valid("190"), false)
})

Deno.test("hcl validator", () => {
  assertEquals(is_hcl_valid("#123abc"), true)
  assertEquals(is_hcl_valid("#123abz"), false)
  assertEquals(is_hcl_valid("123abc"), false)
})

Deno.test("ecl validator", () => {
  assertEquals(is_ecl_valid("brn"), true)
  assertEquals(is_ecl_valid("wat"), false)
})

Deno.test("pid validator", () => {
  assertEquals(is_pid_valid("000000001"), true)
  assertEquals(is_pid_valid("0123456789"), false)
})

Deno.test("test example data", async() => {
  let passports = await get_passports("input_test2.txt")
  assertEquals(passports.length, 8)
  for(let i = 0; i < 4; i++) {
    console.log(i);
    assertEquals(has_valid_values(passports[i]), false);
  }
  for(let i = 4; i < 8; i++) {
    console.log(i);
    assertEquals(has_valid_values(passports[i]), true);
  }
})

let passports = await get_passports("input.txt");
console.log("Result", get_number_of_valid_passport(passports));
