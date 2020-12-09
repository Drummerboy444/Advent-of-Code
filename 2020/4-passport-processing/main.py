from passport import Passport
from validators import is_valid_byr, is_valid_iyr, is_valid_eyr, is_valid_hgt, is_valid_hcl, is_valid_ecl, is_valid_pid

with open("input.txt") as file:
    lines = file.readlines()

validators = {
    "byr": lambda value: is_valid_byr(value),
    "iyr": lambda value: is_valid_iyr(value),
    "eyr": lambda value: is_valid_eyr(value),
    "hgt": lambda value: is_valid_hgt(value),
    "hcl": lambda value: is_valid_hcl(value),
    "ecl": lambda value: is_valid_ecl(value),
    "pid": lambda value: is_valid_pid(value),
}

passports = []
current = []

for line in lines:
    if line is "\n":
        passports.append(Passport(current))
        current = []
    else:
        current.append(line)

valid_passports = len(passports)

for passport in passports:
    for key, is_valid in validators.items():
        if key not in passport:
            valid_passports -= 1
            break
        elif not is_valid(passport[key]):
            valid_passports -= 1
            break


print(valid_passports)
