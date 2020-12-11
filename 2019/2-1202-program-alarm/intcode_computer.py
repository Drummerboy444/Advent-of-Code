class IntcodeComputer:
    _opcode_to_parameter_counts = {
        1: 3,
        2: 3,
        99: 0
    }

    def __init__(self):
        self._memory = None
        self._instruction_pointer = None
        self._halted = None

    def run(self, program):
        self._memory = [value for value in program]
        self._instruction_pointer = 0
        self._halted = False

        while not self._halted:
            self._run_next_instruction()

    def get_output(self):
        return self._memory[0]

    def _run_next_instruction(self):
        opcode = self._get_opcode()
        parameter_count = self._get_parameter_count(opcode)
        parameters = self._get_parameters(parameter_count)

        if opcode == 1:
            self._memory[parameters[2]] = self._memory[parameters[0]] + self._memory[parameters[1]]
        elif opcode == 2:
            self._memory[parameters[2]] = self._memory[parameters[0]] * self._memory[parameters[1]]
        elif opcode == 99:
            self._halted = True
            return

        self._instruction_pointer += parameter_count + 1

    def _get_opcode(self):
        return self._memory[self._instruction_pointer]

    def _get_parameter_count(self, opcode):
        return self._opcode_to_parameter_counts[opcode]

    def _get_parameters(self, parameter_count):
        start = self._instruction_pointer + 1
        end = start + parameter_count
        return self._memory[start:end]
