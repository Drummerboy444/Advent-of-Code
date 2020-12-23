input = [7, 9, 2, 8, 4, 5, 1, 3, 6]


class CupCircle:
    def __init__(self, current_cup):
        self.current_cup = current_cup
        self.picked_up_1 = None
        self.picked_up_2 = None
        self.picked_up_3 = None

    def pick_up_3(self):
        self.picked_up_1 = self.current_cup.next_cup
        self.picked_up_2 = self.picked_up_1.next_cup
        self.picked_up_3 = self.picked_up_2.next_cup
        self.current_cup.next_cup = self.picked_up_3.next_cup

    def get_destination_cup(self):
        destination_cup = None
        value_to_check = self.current_cup.value - 1
        while not destination_cup:
            cup_to_check = self.current_cup.next_cup
            while cup_to_check is not self.current_cup:
                if cup_to_check.value == value_to_check:
                    destination_cup = cup_to_check
                    break
                cup_to_check = cup_to_check.next_cup
            value_to_check -= 1
            if value_to_check < 1:
                value_to_check = 9
        return destination_cup

    def return_picked_up_cups(self, destination_cup):
        self.picked_up_3.next_cup = destination_cup.next_cup
        destination_cup.next_cup = self.picked_up_1

    def select_next_current_cup(self):
        self.current_cup = self.current_cup.next_cup


class Cup:
    def __init__(self, value):
        self.value = value
        self.next_cup = None


class Game:
    def __init__(self, cup_circle):
        self.cup_circle = cup_circle

    def play_next_move(self):
        self.cup_circle.pick_up_3()
        destination_cup = self.cup_circle.get_destination_cup()
        self.cup_circle.return_picked_up_cups(destination_cup)
        self.cup_circle.select_next_current_cup()


cup_list = [Cup(value) for value in input]
for i in range(len(input)):
    cup_list[i].next_cup = cup_list[(i + 1) % len(input)]

cup_circle = CupCircle(cup_list[0])
game = Game(cup_circle)
for _ in range(100):
    game.play_next_move()


def get_output(game):
    cup_labeled_1 = None
    cup_to_check = game.cup_circle.current_cup
    while not cup_labeled_1:
        if cup_to_check.value == 1:
            cup_labeled_1 = cup_to_check
        cup_to_check = cup_to_check.next_cup

    cup_adding = cup_labeled_1.next_cup
    output = ""
    for _ in range(8):
        output += str(cup_adding.value)
        cup_adding = cup_adding.next_cup
    return output


print(f"Part 1: {get_output(game)}")
