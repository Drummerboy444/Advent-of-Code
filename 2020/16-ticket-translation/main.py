import re
from typing import NamedTuple


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
for ticket in nearby_tickets:
    for value in ticket:
        if is_invalid(value):
            ticket_scanning_error_rate += value

print(ticket_scanning_error_rate)
