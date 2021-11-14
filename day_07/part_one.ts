import * as fs from 'fs';

class BagContains {
  bagType: string;
  quantity: number;

  constructor(bagType: string, quantity: number) {
    this.bagType = bagType;
    this.quantity = quantity;
  }

}

export class BagRule {
  bagType: string;
  contains: Array<BagContains>;

  constructor(bagType: string, contains: Array<BagContains>) {
    this.bagType = bagType;
    this.contains = contains;
  }
}

export function read_bags_rules(filename: string):Array<BagRule> {
  let rules = new Array();
  const lines = fs.readFileSync(filename).toString().split('\n');
  for (let i in lines) {
    let line = lines[i];
    let regex = /([a-zA-Z ]*)bags contain([^]*)/
    let firstMatch = line.match(regex);
    if (firstMatch === null) {continue;}
    let bagType = firstMatch[1].trim();
    let contains = new Array();
    let _contains = firstMatch[2].split(",");
    for (let j in _contains) {
      let _rule = _contains[j];
      let containsRegex = /([0-9]*) ([a-z ]*) bag[s]?/;
      let containsMatch = _rule.match(containsRegex);
      if (containsMatch != null) {
        contains.push(new BagContains(containsMatch[2].trim(), Number(containsMatch[1])))
      }
    }
    rules.push(new BagRule(firstMatch[1].trim(), contains))
  }
  return rules;
}

function able_to_hold(bagType: string, rules: Array<BagRule>): Array<string> {
  let _able_to_hold = new Array();
  let direct = rules.filter(x => x.contains.filter(y => y.bagType == bagType).length > 0); 
  for (let i in direct) {
    _able_to_hold.push(direct[i].bagType);
    _able_to_hold.push(...able_to_hold(direct[i].bagType, rules));
  }
  return _able_to_hold;
}

let test_rules = read_bags_rules("input_test.txt");
console.log("Test:", (new Set(able_to_hold("shiny gold", test_rules))).size == 4 ? "OK" : "error")

let rules = read_bags_rules("input.txt")
console.log("Result: ", (new Set(able_to_hold("shiny gold", rules))).size);

