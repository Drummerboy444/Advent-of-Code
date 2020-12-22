import re


with open("input.txt") as file:
    sections = file.read().split("\n\n")

card_pattern = re.compile("Player [\\d]:([\\s\\S]*)")
player_1 = [int(i) for i in card_pattern.match(sections[0])[1].split("\n")[1:]]
player_2 = [int(i) for i in card_pattern.match(sections[1])[1].split("\n")[1:-1]]


def copy_deck(deck):
    return [i for i in deck]


class Game:
    def __init__(self, p_1, p_2):
        self.player_1 = copy_deck(p_1)
        self.player_2 = copy_deck(p_2)
        self.seen_before = []
        self.winner = None

    def play(self):
        while not self.winner:
            self.play_next_round()

    def play_next_round(self):
        if self.has_seen_before():
            self.winner = "Player 1"
            return
        if len(self.player_1) == 0:
            self.winner = "Player 2"
            return
        if len(self.player_2) == 0:
            self.winner = "Player 1"
            return

        top_card_1 = self.player_1.pop(0)
        top_card_2 = self.player_2.pop(0)

        if len(self.player_1) >= top_card_1 and len(self.player_2) >= top_card_2:
            sub_game = Game(self.player_1[:top_card_1], self.player_2[:top_card_2])
            sub_game.play()
            if sub_game.winner == "Player 1":
                self.player_1.append(top_card_1)
                self.player_1.append(top_card_2)
            else:
                self.player_2.append(top_card_2)
                self.player_2.append(top_card_1)
        else:
            if top_card_1 > top_card_2:
                self.player_1.append(top_card_1)
                self.player_1.append(top_card_2)
            else:
                self.player_2.append(top_card_2)
                self.player_2.append(top_card_1)

    def has_seen_before(self):
        has_seen_before = [self.player_1, self.player_2] in self.seen_before
        self.seen_before.append([copy_deck(self.player_1), copy_deck(self.player_2)])
        return has_seen_before


game = Game(player_1, player_2)
game.play()
winner = game.player_1 if game.winner == "Player 1" else game.player_2

total = 0
number_of_cards = len(winner)
for i in range(number_of_cards):
    total += winner[i] * (number_of_cards - i)
print(total)
