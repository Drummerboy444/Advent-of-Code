with open("input.txt") as file:
    boarding_passes = file.read().split()


binary_digit_lookup = {
    "F": 0,
    "B": 1,
    "L": 0,
    "R": 1
}


def number_from_characters(characters):
    total = 0
    exponent = 0

    for character in reversed(characters):
        binary_digit = binary_digit_lookup[character]
        total += binary_digit * (2 ** exponent)
        exponent += 1

    return total


def get_seat_id(boarding_pass):
    row = number_from_characters(boarding_pass[:7])
    col = number_from_characters(boarding_pass[7:10])
    return (row * 8) + col


seat_ids = [get_seat_id(boarding_pass) for boarding_pass in boarding_passes]
seat_ids.sort()

expected_seat_id = seat_ids[0]
missing_seat_id = None
for seat_id in seat_ids:
    if seat_id == expected_seat_id:
        expected_seat_id += 1
        continue
    missing_seat_id = expected_seat_id
    break

print(missing_seat_id)
