with open("input.txt") as file:
    boarding_passes = file.read().split()


binary_digit_lookup = {
    "F": 0,
    "B": 1,
    "L": 0,
    "R": 1
}


def number_from_characters(characters, base=2):
    total = 0
    exponent = 0

    for character in reversed(characters):
        binary_digit = binary_digit_lookup[character]
        total += binary_digit * (base ** exponent)
        exponent += 1

    return total


def get_seat_id(boarding_pass):
    raw_row = boarding_pass[:7]
    raw_col = boarding_pass[7:10]
    row = number_from_characters(raw_row)
    col = number_from_characters(raw_col)
    return (row * 8) + col


highest_seat_id = 0

for boarding_pass in boarding_passes:
    seat_id = get_seat_id(boarding_pass)
    if seat_id > highest_seat_id:
        highest_seat_id = seat_id

print(highest_seat_id)
