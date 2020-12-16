import re
from typing import NamedTuple

from math import prod


class Rule(NamedTuple):
    field: str
    min1: int
    max1: int
    min2: int
    max2: int


with open("input.txt") as file:
    sections = file.read().split("\n\n")


rule_pattern = re.compile(r"([a-z ]+): (\d+)-(\d+) or (\d+)-(\d+)")

rules = []
for line in sections[0].split("\n"):
    match = rule_pattern.match(line)
    rules.append(Rule(
        match.group(1),
        int(match.group(2)),
        int(match.group(3)),
        int(match.group(4)),
        int(match.group(5))
    ))


def parse_ticket(raw_ticket):
    return [int(i) for i in raw_ticket.split(",")]


my_ticket = parse_ticket(sections[1].split("\n")[-1])

nearby_tickets = [
    parse_ticket(raw_ticket)
    for raw_ticket
    in sections[2].split("\n")[1:-1]
]


def is_valid_value(value, rule):
    return rule.min1 <= value <= rule.max1 or rule.min2 <= value <= rule.max2


def is_invalid(value):
    return not any(is_valid_value(value, rule) for rule in rules)


ticket_scanning_error_rate = 0
valid_tickets = []
for ticket in nearby_tickets:
    valid = True
    for value in ticket:
        if is_invalid(value):
            ticket_scanning_error_rate += value
            valid = False
    if valid:
        valid_tickets.append(ticket)

print(f"Part 1: {ticket_scanning_error_rate}")


ticket_index_to_rule_index = {}
for i in range(len(rules)):
    ticket_index_to_rule_index[i] = [i for i in range(len(rules))]


for i in range(len(valid_tickets)):
    ticket = valid_tickets[i]
    for j in range(len(ticket)):
        value = ticket[j]
        for k in range(len(rules)):
            rule = rules[k]
            if not is_valid_value(value, rule) and k in ticket_index_to_rule_index[j]:
                ticket_index_to_rule_index[j].remove(k)


rule_to_ticket_index = {}


def can_reduce(dictionary):
    return any(len(value) == 1 for value in dictionary.values())


def reduce(dictionary):
    to_remove = None
    for key in dictionary:
        value = dictionary[key]
        if len(value) == 1:
            to_remove = [key, value[0]]
            rule_to_ticket_index[value[0]] = key

    del dictionary[to_remove[0]]
    for key in dictionary:
        value = dictionary[key]
        if to_remove[1] in value:
            value.remove(to_remove[1])


while can_reduce(ticket_index_to_rule_index):
    reduce(ticket_index_to_rule_index)

print(f"Part 2: {prod(my_ticket[rule_to_ticket_index[i]] for i in range(6))}")
