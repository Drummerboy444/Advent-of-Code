with open("input.txt") as file:
    lines = file.readlines()


groups = [[]]
current_group_index = 0
for line in lines:
    trimmed_line = line[:-1]
    if trimmed_line:
        groups[current_group_index].append(trimmed_line)
    else:
        groups.append([])
        current_group_index += 1


sum = 0
for group in groups:
    group_answers = set()
    for answers in group:
        for answer in answers:
            group_answers.add(answer)
    sum += len(group_answers)

print(sum)
