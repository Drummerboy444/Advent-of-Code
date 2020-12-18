with open("input.txt") as file:
    expressions = [line.replace(" ", "") for line in file.read().strip().split("\n")]


def get_closing_bracket_index(expression, open_bracket_index):
    bracket_level = 1
    i = open_bracket_index + 1
    while bracket_level > 0:
        character = expression[i]
        if character == "(":
            bracket_level += 1
        elif character == ")":
            bracket_level -= 1
        i += 1
    return i - 1


def parse(expression):
    simple_expression = []
    i = 0
    while i < len(expression):
        value = expression[i]
        if value == "(":
            closing_bracket_index = get_closing_bracket_index(expression, i)
            simple_expression.append(parse(expression[i+1:closing_bracket_index]))
            i = closing_bracket_index + 1
        else:
            simple_expression.append(value)
            i += 1
    return simple_expression


def evaluate(simple_expression):
    if isinstance(simple_expression, str):
        return int(simple_expression)

    value = evaluate(simple_expression[0])
    i = 1
    while i < len(simple_expression):
        operation = simple_expression[i]
        if operation == "+":
            value += evaluate(simple_expression[i + 1])
        elif operation == "*":
            value *= evaluate(simple_expression[i + 1])
        i += 2
    return value


total = 0
for expression in expressions:
    value = evaluate(parse(expression))
    total += value
print(f"Part 1: {total}")


def insert_precedence(simple_expression):
    if isinstance(simple_expression, str):
        return simple_expression

    with_precedence = []
    i = 0
    while i < len(simple_expression):
        value = simple_expression[i]
        if value == "+":
            with_precedence[-1] = [
                with_precedence[-1],
                "+",
                insert_precedence(simple_expression[i + 1])
            ]
            i += 2
        else:
            with_precedence.append(insert_precedence(value))
            i += 1
    return with_precedence


total = 0
for expression in expressions:
    value = evaluate(insert_precedence(parse(expression)))
    total += value
print(f"Part 2: {total}")
