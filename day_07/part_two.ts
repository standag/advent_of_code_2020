import { read_bags_rules, BagRule } from "./part_one";

function count_included_bags(bagType: string, rules: Array<BagRule>): number {
  let count = 0;
  let rule = rules.find(x => x.bagType == bagType);
  if (rule == null || rule.contains == null) {return 0;}
  for (let i in rule.contains) {
    let contains = rule.contains[i];
    count += contains.quantity;
    count += contains.quantity * count_included_bags(contains.bagType, rules)
  }
  console.log(rule, count);

  return count;
}

let test_rules = read_bags_rules("input_test.txt");
console.log("Test: ", count_included_bags("shiny gold", test_rules) == 32 ? "OK" : "error");

let rules = read_bags_rules("input.txt")
console.log("Result: ", count_included_bags("shiny gold", rules));

