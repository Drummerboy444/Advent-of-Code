from typing import NamedTuple


# equation of the form t = n % m
class ModuloEquation(NamedTuple):
    n: int
    m: int


def get_modulo_inverse(n, modulus):
    for i in range(modulus):
        if (i * n) % modulus == 1:
            return i


def simplify(equation1, equation2):
    k = ((equation2.n - equation1.n) * get_modulo_inverse(equation1.m, equation2.m)) % equation2.m
    return ModuloEquation((k * equation1.m) + equation1.n, equation1.m * equation2.m)


with open("input.txt") as file:
    instructions = file.readlines()[1].strip().split(",")
    equations = []
    for i in range(len(instructions)):
        if instructions[i] != "x":
            equations.append(ModuloEquation(-i % int(instructions[i]), int(instructions[i])))


while len(equations) > 1:
    e0 = equations[0]
    e1 = equations[1]
    equations[0] = simplify(e0, e1)
    del equations[1]

print(equations)
print(f"answer: {equations[0].n}")

# 0,1, 4, 6, 7
# 7,13,59,31,19


# e1 = ModuloEquation(0, 7)
# e2 = ModuloEquation(1, 13)
#
# e3 = ModuloEquation(4, 59)
# e4 = ModuloEquation(6, 31)
#
# e5 = ModuloEquation(7, 19)
#
# e6 = simplify(e1, e2)
# e7 = simplify(e3, e4)
# e8 = simplify(e6, e7)
#
# print(simplify(e5, e8))
# e9 = simplify(e5, e8)
# ans = e9.m - e9.n
# print(ans)
# # t = 2093560 mod 3162341
#
# # 17,x,13,19
#
# e1 = ModuloEquation(0, 17)
# e2 = ModuloEquation(2, 13)
# e3 = ModuloEquation(3, 19)
#
# print(simplify(simplify(e1, e2), e3))







# print(simplify(ModuloEquation(0, 7), ModuloEquation(1, 13)))











def solve(n1, m1, n2, m2):
    # t = n1 % m1
    # t = n2 % m2

    # t = (m1 * k) + n1
    # (m1 * k) + n1 = n2 % m2
    # m1 * k = (n2 - n1) % m2
    # k = (n2 - n1)(m1 ^ -1) % m2

    # k = (m2 * N) + ((n2 - n1)(m1 ^ -1) % m2)   for all N
    # t = (m1 * ((m2 * N) + ((n2 - n1)(m1 ^ -1) % m2))) + n1   for all N
    # t = (m1 * ((m2 * N) + ((n2 - n1)m1_inverse % m2))) + n1   for all N
    # t = (m1 * ((m2 * N) + inner_modulo_equation)) + n1   for all N
    # t = bracketed_equation + n1   for all N

    # t =

    n = 0
    m1_inverse = get_modulo_inverse(m1, m2)
    inner_modulo_equation = ((n2 - n1) * m1_inverse) % m2
    bracketed_equation = m1 * ((m2 * n) + inner_modulo_equation)
    return bracketed_equation + n1


# print(solve(0, 7, 1, 13))












# t = (m1 * ((m2 * N) + ((n2 - n1)(m1 ^ -1) % m2))) + n1   for all N
