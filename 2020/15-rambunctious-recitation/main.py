input = [6, 3, 15, 13, 1, 0]

spoken_numbers_to_turn = {}

for i in range(len(input) - 1):
    spoken_numbers_to_turn[input[i]] = i + 1

last_number_spoken = input[-1]
turn = len(input) + 1

while turn <= 30000000:
    next_number = None

    if last_number_spoken in spoken_numbers_to_turn:
        last_time_spoke = spoken_numbers_to_turn[last_number_spoken]
        next_number = turn - 1 - last_time_spoke
    else:
        next_number = 0

    spoken_numbers_to_turn[last_number_spoken] = turn - 1
    last_number_spoken = next_number
    turn += 1

print(last_number_spoken)
