class PasswordValidator:
    def __init__(self, line):
        line = line.replace("\n", "")
        row_items = line.split(" ")
        min_max = row_items[0].split("-")
        self.min = int(min_max[0])
        self.max = int(min_max[1])
        self.required_character = row_items[1][0]
        self.password = row_items[2]

    def is_valid(self):
        count = self.password.count(self.required_character)
        return self.min <= count <= self.max
