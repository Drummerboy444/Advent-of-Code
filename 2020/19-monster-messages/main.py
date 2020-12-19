import re


with open("input.txt") as file:
    sections = file.read().split("\n\n")
    rules_with_ids = sections[0].split("\n")
    messages = sections[1].split("\n")[:-1]


rule_id_pattern = re.compile("(\\d+): (.+)")
rule_lookup = {}
for rule_with_id in rules_with_ids:
    rule_id_match = rule_id_pattern.match(rule_with_id)
    rule_id = rule_id_match[1]
    rule = rule_id_match[2]
    rule_lookup[rule_id] = rule


def get_regex(rule):
    if rule == "\"a\"":
        return "a"
    if rule == "\"b\"":
        return "b"
    if rule.isnumeric():
        return get_regex(rule_lookup[rule])

    if "|" in rule:
        split = rule.split(" | ")
        left_regex = get_regex(split[0])
        right_regex = get_regex(split[1])
        return f"({left_regex}|{right_regex})"
    else:
        return f"{''.join([get_regex(sub_rule) for sub_rule in rule.split()])}"


rule_0_pattern = re.compile(f"^{get_regex('0')}$")
total = 0
for message in messages:
    if rule_0_pattern.match(message):
        total += 1
print(f"Part 1: {total}")
