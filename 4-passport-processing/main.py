with open("input.txt") as file:
    lines = file.readlines()


def has_key(passport, key):
    has_key = False
    for passport_component in passport:
        if f"{key}:" in passport_component:
            has_key = True
    return has_key


required_keys = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]

passports = [[]]

for line in lines:
    if line is "\n":
        passports.append([])

    passports[len(passports) - 1].append(line)

valid_passports = 0

for passport in passports:
    is_valid = True
    for required_key in required_keys:
        if not has_key(passport, required_key):
            is_valid = False
    if is_valid:
        valid_passports += 1

print(valid_passports)
