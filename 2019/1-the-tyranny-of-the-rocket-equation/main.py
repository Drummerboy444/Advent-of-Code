from math import floor


with open("input.txt") as file:
    lines = [int(line) for line in file.readlines()]


def get_fuel_required(mass):
    return floor(mass / 3) - 2


def get_fuel_required_recursively(mass):
    fuel_required = floor(mass / 3) - 2
    if fuel_required > 0:
        return fuel_required + get_fuel_required_recursively(fuel_required)
    else:
        return 0


print(f"Fuel required without mass of fuel: {sum(get_fuel_required(line) for line in lines)}")
print(f"Fuel required with mass of fuel: {sum(get_fuel_required_recursively(line) for line in lines)}")
