import re


with open("input.txt") as file:
    sections = file.read().split("\n\n")
    rules_with_ids = sections[0].split("\n")
    messages = sections[1].split("\n")[:-1]


# Generated using solution to part 1
regex_for_42 = "(((a(((aaa|b(ab|ba))b|((bb|ba)b|(aa|ba)a)a)b|(((b|a)(b|a)b|(ab|aa)a)a|(a(ab|ba)|b(bb|ba))b)a)|b(b(b((ab|b(b|a))b|(ab|aa)a)|a(a(ab|ba)|b(bb|ba)))|a(b(bb|ba)(b|a)|a(bab|aab))))a|((a((a(ab|aa)|bab)a|(a(ab|bb)|b(bb|ba))b)|b(b(ab|aa)a|((ab|aa)b|((b|a)a|ab)a)b))b|(b((b(ab|aa)|a(ab|b(b|a)))a|((bb|aa)b|(ab|aa)a)b)|a((bab|aab)b|(a(bb|ba)|b(ab|aa))a))a)b)b|(((a(b(a(ab|aa)|bab)|a((bb|ba)b|(ab|ba)a))|b((b(bb|ba)|aab)b|b(ab|aa)a))a|((b(b(bb|a(b|a))|a(bb|ba))|a(((b|a)a|bb)b|(ab|b(b|a))a))a|(a((aa|ba)b|(ab|ba)a)|b((bb|a(b|a))a|((b|a)a|ab)b))b)b)b|(b(b((a(aa|ba)|b(ab|b(b|a)))a|((bb|a(b|a))b|(aa|ba)a)b)|a(b((ab|bb)a|(bb|a(b|a))b)|a(aab|b(bb|a(b|a)))))|a(((b(ab|ba)|a(ab|bb))b|((ab|b(b|a))a|(ab|ba)b)a)b|((a(bb|aa)|b(ab|aa))b|(bab|aab)a)a))a)a)"
regex_for_31 = "(a(a((a(b(a(ab|ba)|bba)|a(aab|b(bb|a(b|a))))|b(a((ab|bb)a|(ab|b(b|a))b)|b((ab|b(b|a))a|(ab|ba)b)))b|(a(a(b(ab|b(b|a))|a(b|a)(b|a))|b(aba|b(ab|aa)))|b((baa|(bb|ba)b)b|(abb|((b|a)a|ab)a)a))a)|b(((b((bb|aa)b|aaa)|a(a((b|a)a|bb)|bba))a|(a((bb|a(b|a))b|aba)|b(b|a)((b|a)a|ab))b)b|((((bb|ba)b|((b|a)a|bb)a)a|(b(bb|ba)|aab)b)a|(ab(aa|ba)|b(((b|a)a|bb)a|(ab|bb)b))b)a))|b((((a(ab|aa)a|b((bb|aa)b|baa))b|(b((bb|ba)a|(ab|aa)b)|a(((b|a)a|bb)b|(b|a)(b|a)a))a)b|(b((bab|(ab|bb)a)b|(baa|a(ab|bb))a)|a(b(bab|(aa|ba)a)|a(a((b|a)a|bb)|bba)))a)a|(((b(b(b|a)(b|a)|abb)|a(b|a)(aa|ba))b|(b(b((b|a)a|ab)|a(ab|bb))|a(aaa|bbb))a)b|(a(a(b|a)((b|a)a|bb)|b(ab|aa)(b|a))|b(a(a(bb|aa)|b(ab|aa))|b((bb|ba)a|aab)))a)b))"


rule_id_pattern = re.compile("(\\d+): (.+)")
rule_lookup = {}
for rule_with_id in rules_with_ids:
    rule_id_match = rule_id_pattern.match(rule_with_id)
    rule_id = rule_id_match[1]
    rule = rule_id_match[2]
    rule_lookup[rule_id] = rule


def get_regex(rule):
    # Hardcode the 2 rules that have been switched
    if rule == "8":
        return f"(({regex_for_42})+)"
    if rule == "11":
        regex = f"({regex_for_42}{{1}}{regex_for_31}{{1}}"
        for i in range(2, 10):
            regex += f"|{regex_for_42}{{{i}}}{regex_for_31}{{{i}}}"
        regex += ")"
        return regex
    if rule == "\"a\"":
        return "a"
    if rule == "\"b\"":
        return "b"
    if rule.isnumeric():
        return get_regex(rule_lookup[rule])

    if "|" in rule:
        split = rule.split(" | ")
        left_regex = get_regex(split[0])
        right_regex = get_regex(split[1])
        return f"({left_regex}|{right_regex})"
    else:
        return f"{''.join([get_regex(sub_rule) for sub_rule in rule.split()])}"


rule_0_pattern = re.compile(f"^{get_regex('0')}$")
total = 0
for message in messages:
    if rule_0_pattern.match(message):
        total += 1
print(f"Part 2: {total}")
