class Passport:
    def __init__(self, raw_passport):
        self._key_value_pairs = {}
        for passport_part in raw_passport:
            passport_part = passport_part.replace("\n", "")
            string_pairs = passport_part.split()
            for string_pair in string_pairs:
                key_value_pair = string_pair.split(":")
                self._key_value_pairs[key_value_pair[0]] = key_value_pair[1]

    def __contains__(self, item):
        return item in self._key_value_pairs

    def __getitem__(self, item):
        return self._key_value_pairs[item]
