import re


with open("input.txt") as file:
    sections = file.read().split("\n\n")

card_pattern = re.compile("Player [\\d]:([\\s\\S]*)")
player_1 = [int(i) for i in card_pattern.match(sections[0])[1].split("\n")[1:]]
player_2 = [int(i) for i in card_pattern.match(sections[1])[1].split("\n")[1:-1]]

while len(player_1) > 0 and len(player_2) > 0:
    top_card_1 = player_1.pop(0)
    top_card_2 = player_2.pop(0)
    if top_card_1 > top_card_2:
        player_1.append(top_card_1)
        player_1.append(top_card_2)
    else:
        player_2.append(top_card_2)
        player_2.append(top_card_1)

winner = player_1 if player_1 else player_2

total = 0
number_of_cards = len(winner)
for i in range(number_of_cards):
    total += winner[i] * (number_of_cards - i)
print(total)
