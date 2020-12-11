def is_valid_coordinate(row, col, rows, cols):
    return 0 <= row < rows and 0 <= col < cols


def get_visible_seat(seats, row, col, directions):
    rows = len(seats)
    cols = len(seats[0])
    x_coordinate_change = 0
    y_coordinate_change = 0

    if "up" in directions:
        y_coordinate_change -= 1
    if "down" in directions:
        y_coordinate_change += 1
    if "left" in directions:
        x_coordinate_change -= 1
    if "right" in directions:
        x_coordinate_change += 1

    potential_row = row + x_coordinate_change
    potential_col = col + y_coordinate_change
    while is_valid_coordinate(potential_row, potential_col, rows, cols):
        if seats[potential_row][potential_col] == "#":
            return "#"
        if seats[potential_row][potential_col] == "L":
            return "L"
        potential_row += x_coordinate_change
        potential_col += y_coordinate_change

    return None


possible_directions = [
    ["up"],
    ["down"],
    ["left"],
    ["right"],
    ["up", "left"],
    ["down", "left"],
    ["up", "right"],
    ["down", "right"]
]


def count_visible_occupied_seats(seats, row, col):
    return sum(
        1 for directions in possible_directions
        if get_visible_seat(seats, row, col, directions) == "#"
    )


def calculate_next_seats(current_seats, tolerance):
    rows = len(current_seats)
    cols = len(current_seats[0])
    next_seats = [[""]*cols for _ in range(rows)]
    any_change = False
    for i in range(rows):
        for j in range(cols):
            current_seat = current_seats[i][j]
            if current_seat == ".":
                next_seats[i][j] = "."
                continue

            surrounding_occupied_seats = count_visible_occupied_seats(current_seats, i, j)
            if current_seat == "L":
                if surrounding_occupied_seats == 0:
                    next_seats[i][j] = "#"
                    any_change = True
                else:
                    next_seats[i][j] = "L"
            elif current_seat == "#":
                if surrounding_occupied_seats >= tolerance:
                    next_seats[i][j] = "L"
                    any_change = True
                else:
                    next_seats[i][j] = "#"
    return next_seats, any_change


def count_occupied_seats(seats):
    count = 0
    for row in seats:
        for seat in row:
            if seat == "#":
                count += 1
    return count


with open("input.txt") as file:
    seats = [list(line) for line in file.read().split()]

current_seats = seats
next_seats, any_change = calculate_next_seats(current_seats, 5)
while any_change:
    next_seats, any_change = calculate_next_seats(next_seats, 5)

print(count_occupied_seats(next_seats))
