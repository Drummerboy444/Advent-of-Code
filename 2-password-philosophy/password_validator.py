class PasswordValidator:
    def __init__(self, line):
        line = line.replace("\n", "")
        row_items = line.split(" ")
        indexes = row_items[0].split("-")
        self.index_1 = int(indexes[0]) - 1
        self.index_2 = int(indexes[1]) - 1
        self.required_character = row_items[1][0]
        self.password = row_items[2]

    def is_valid(self):
        character_1 = self.password[self.index_1]
        character_2 = self.password[self.index_2]
        return (character_1 == self.required_character) != (character_2 == self.required_character)
