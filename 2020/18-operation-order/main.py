with open("input.txt") as file:
    expressions = [line.replace(" ", "") for line in file.read().strip().split("\n")]


# def tokenize(line):
#     characters = line.replace(" ", "")
#     tokens = []
#     for character in characters:
#         if character.isnumeric():
#             tokens.append(int(character))
#         else:
#             tokens.append(character)
#     return tokens


# class Node:
#     def __init__(self, args):
#         self.args = args
#         self.arg_count = len(self.args)
#
#     def evaluate(self):
#         if self.arg_count == 1:
#             return self.args[0]
#         elif self.arg_count == 3:
#             left_node = self.args[0]
#             operation = self.args[1]
#             right_node = self.args[2]
#             if operation == "+":
#                 return left_node.evaluate() + right_node.evaluate()
#             elif operation == "*":
#                 return left_node.evaluate() * right_node.evaluate()
#
#
# def get_closing_bracket_index(tokens, open_bracket_index):
#     pass
#
#
# def parse(tokens):
#     nodes = []
#     i = 0
#     while i < len(tokens):
#         token = tokens[i]
#         if token.type == "int":
#             operation = tokens[i + 1]
#             next_token = tokens[i + 2]
#             if next_token.type == "int":
#                 nodes.append(Node([token.value, operation.type, next_token.value]))
#             value = token.value


# def evaluate(tokens):
#     value = tokens[0].value
#     current_operation = None
#     for token in tokens[1:]:
#         type = token.type
#         if type == "+" or type == "*":
#             current_operation = type
#         elif type == "int":
#             if current_operation == "+":
#                 value += token.value
#             elif current_operation == "*":
#                 value *= token.value
#         elif type == "("
#     return value


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
print(total)





# class TokenIterator:
#     def __init__(self, tokens):
#         self.tokens = tokens
#         self.length = len(self.tokens)
#         self.next_index = 0
#
#     def has_next(self):
#         return self.next_index < self.length
#
#     def next(self):
#         token = self.tokens[self.next_index]
#         self.next_index += 1
#         return token