import re


class Instruction:
    _pattern = re.compile("([a-z]{3}) ([+-][0-9]+)")

    def __init__(self, line):
        match = self._pattern.match(line)
        self.operation = match.group(1)
        self.argument = int(match.group(2))
