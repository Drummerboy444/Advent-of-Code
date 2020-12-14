from typing import NamedTuple


# equation of the form t = n % m
class ModuloEquation(NamedTuple):
    n: int
    m: int


def get_modulo_inverse(n, modulus):
    for i in range(modulus):
        if (i * n) % modulus == 1:
            return i


# For 2 equations say t = n1 % m1 and t = n2 % m2, simplifies to an equation t = n % m which
# describes all answers to the equations given.
# General method is to say t = Nm1 + n1 and substitute this into the second equation. Eventually
# it boils down and you get the answer.
# I think this makes some assumptions about things like m1 and m2 being coprime etc, but all
# of the numbers in the examples and in the input are prime, which I think was probably done
# to guarantee a solution exists, so these assumptions all seem to work
def simplify(equation1, equation2):
    k = ((equation2.n - equation1.n) * get_modulo_inverse(equation1.m, equation2.m)) % equation2.m
    return ModuloEquation((k * equation1.m) + equation1.n, equation1.m * equation2.m)


# Each item in the input (say k) can be expressed as t = -i mod k where i is the index of that item
# e.g. for 7,13,x,x,31 we get the equations:
# t = 0 mod 7
# t = 12 mod 13
# t = 27 mod 31
with open("input.txt") as file:
    instructions = file.readlines()[1].strip().split(",")
    equations = []
    for i in range(len(instructions)):
        if instructions[i] != "x":
            equations.append(ModuloEquation(-i % int(instructions[i]), int(instructions[i])))


# Simplifies all of the equations down to one equation of the form t = n mod m.
# We can then just read of the solution as all solutions are then described by:
#   {n + m | m is a natural number}
# so the answer we want is for m = 0, so just n.
while len(equations) > 1:
    e0 = equations[0]
    e1 = equations[1]
    equations[0] = simplify(e0, e1)
    del equations[1]

print(equations)
print(f"answer: {equations[0].n}")
