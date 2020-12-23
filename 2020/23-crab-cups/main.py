class CupCircle:
    def __init__(self, current_cup):
        self.current_cup = current_cup
        self.picked_up_1 = None
        self.picked_up_2 = None
        self.picked_up_3 = None

        self.values_to_cup = {self.current_cup.value: self.current_cup}
        self.max_value = self.current_cup.value
        cup_to_check = self.current_cup.next_cup
        while cup_to_check is not self.current_cup:
            self.values_to_cup[cup_to_check.value] = cup_to_check
            self.max_value = max(self.max_value, cup_to_check.value)
            cup_to_check = cup_to_check.next_cup

    def play_next_move(self):
        self.pick_up_3()
        destination_cup = self.get_destination_cup()
        self.return_picked_up_cups(destination_cup)
        self.select_next_current_cup()

    def get_cup_1(self):
        return self.values_to_cup[1]

    def pick_up_3(self):
        self.picked_up_1 = self.current_cup.next_cup
        self.picked_up_2 = self.picked_up_1.next_cup
        self.picked_up_3 = self.picked_up_2.next_cup
        self.current_cup.next_cup = self.picked_up_3.next_cup

    def get_destination_cup(self):
        destination_cup = None
        value_to_check = self.current_cup.value - 1
        while not destination_cup:
            if value_to_check < 1:
                value_to_check = self.max_value
            if not self.value_is_in_picked_up_cups(value_to_check):
                destination_cup = self.values_to_cup[value_to_check]
            value_to_check -= 1
        return destination_cup

    def value_is_in_picked_up_cups(self, value):
        return self.picked_up_1.value == value or self.picked_up_2.value == value or self.picked_up_3.value == value

    def return_picked_up_cups(self, destination_cup):
        self.picked_up_3.next_cup = destination_cup.next_cup
        destination_cup.next_cup = self.picked_up_1

    def select_next_current_cup(self):
        self.current_cup = self.current_cup.next_cup


class Cup:
    def __init__(self, value):
        self.value = value
        self.next_cup = None


input = [7, 9, 2, 8, 4, 5, 1, 3, 6]
for i in range(10, 1000001):
    input.append(i)

cup_list = [Cup(value) for value in input]
for i in range(len(input)):
    cup_list[i].next_cup = cup_list[(i + 1) % len(input)]

cup_circle = CupCircle(cup_list[0])
for i in range(10000000):
    cup_circle.play_next_move()

cup_1 = cup_circle.get_cup_1()
print(cup_1.next_cup.value * cup_1.next_cup.next_cup.value)
