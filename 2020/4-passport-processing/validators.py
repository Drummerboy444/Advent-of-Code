import re


def is_valid_byr(value):
    return value.isnumeric() and 1920 <= int(value) <= 2002


def is_valid_iyr(value):
    return value.isnumeric() and 2010 <= int(value) <= 2020


def is_valid_eyr(value):
    return value.isnumeric() and 2020 <= int(value) <= 2030


def is_valid_hgt(value):
    if len(value) < 3:
        return False

    prefix = value[:len(value) - 2]
    unit = value[len(value) - 2:]
    if unit == "cm" and prefix.isnumeric() and 150 <= int(prefix) <= 193:
        return True
    elif unit == "in" and prefix.isnumeric() and 59 <= int(prefix) <= 76:
        return True
    return False


hair_colour_pattern = re.compile("#[0-9a-f]{6}")


def is_valid_hcl(value):
    return bool(hair_colour_pattern.match(value))


valid_eye_colours = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]


def is_valid_ecl(value):
    return value in valid_eye_colours


def is_valid_pid(value):
    return len(value) is 9 and value.isnumeric()
