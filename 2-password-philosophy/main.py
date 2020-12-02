from password_validator import PasswordValidator


with open("input.txt") as file:
    lines = file.readlines()


ans = len([l for l in lines if PasswordValidator(l).is_valid()])
print(ans)
