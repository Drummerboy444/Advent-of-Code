with open("input.txt") as file:
    lines = [line[:-2] for line in file.readlines()]


bag_children_lookup = {}


for line in lines:
    split = line.split(" bags contain ")

    bag_colour = split[0]
    bag_children_lookup[bag_colour] = []

    children_bags = []\
        if split[1] == 'no other bags'\
        else split[1][:-1].split(", ")

    for child_bag in children_bags:
        bag_colour_parts = child_bag.split()
        count = int(bag_colour_parts[0])
        colour = f"{bag_colour_parts[1]} {bag_colour_parts[2]}"
        bag_children_lookup[bag_colour].append([count, colour])


def can_contain_gold_bag(colour):
    can_contain_gold = False

    for child_bag in bag_children_lookup[colour]:
        child_bag_colour = child_bag[1]
        if child_bag_colour == "shiny gold" or can_contain_gold_bag(child_bag_colour):
            can_contain_gold = True

    return can_contain_gold


total = 0
for colour in bag_children_lookup.keys():
    if can_contain_gold_bag(colour):
        total += 1

print(total)
