def count_surrounding_occupied_seats(seats, row, col):
    seats_to_check = []
    rows = len(seats)
    cols = len(seats[0])
    if row > 0:
        seats_to_check.append(seats[row - 1][col])
    if row < rows - 1:
        seats_to_check.append(seats[row + 1][col])
    if col > 0:
        seats_to_check.append(seats[row][col - 1])
    if col < cols - 1:
        seats_to_check.append(seats[row][col + 1])
    if row > 0 and col > 0:
        seats_to_check.append(seats[row - 1][col - 1])
    if row > 0 and col < cols - 1:
        seats_to_check.append(seats[row - 1][col + 1])
    if row < rows - 1 and col > 0:
        seats_to_check.append(seats[row + 1][col - 1])
    if row < rows - 1 and col < cols - 1:
        seats_to_check.append(seats[row + 1][col + 1])

    return sum(1 for seat_to_check in seats_to_check if seat_to_check is "#")


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

            surrounding_occupied_seats = count_surrounding_occupied_seats(current_seats, i, j)
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
next_seats, any_change = calculate_next_seats(current_seats, 4)
changes = 1
while any_change:
    next_seats, any_change = calculate_next_seats(next_seats, 4)
    if any_change:
        changes += 1

print(count_occupied_seats(next_seats))
