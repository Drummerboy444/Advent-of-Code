from instruction import Instruction


class Program:
    def __init__(self, lines):
        self.accumulator = 0

        self._instructions = [Instruction(line) for line in lines]
        self._next_instruction_index = 0
        self._visited_instructions = []

    def flip_instruction(self, index):
        self._instructions[index].flip()

    def run(self):
        while not self.in_loop() and not self.finished():
            self._run_next_instruction()

    def finished(self):
        return self._next_instruction_index >= len(self._instructions)

    def in_loop(self):
        return self._next_instruction_index in self._visited_instructions

    def _run_next_instruction(self):
        instruction = self._instructions[self._next_instruction_index]
        operation = instruction.operation
        argument = instruction.argument

        if operation == "acc":
            self._acc(argument)
        elif operation == "jmp":
            self._jmp(argument)
        elif operation == "nop":
            self._nop()

    def _acc(self, argument):
        self.accumulator += argument
        self._move(1)

    def _jmp(self, argument):
        self._move(argument)

    def _nop(self):
        self._move(1)

    def _move(self, increment):
        self._visited_instructions.append(self._next_instruction_index)
        self._next_instruction_index += increment
