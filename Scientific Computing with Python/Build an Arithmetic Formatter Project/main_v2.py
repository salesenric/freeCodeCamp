def arithmetic_arranger(problems, show_answers=False):

    if len(problems) > 5:
        return 'Error: Too many problems.'

    first_line, second_line, dashes, answers = [], [], [], []
    gap = '    '  # Set the gap between problems

    for problem in problems:
        num1, op, num2 = problem.split()

        if op not in ('+', '-'):
            return "Error: Operator must be '+' or '-'."
        if not (num1.isdigit() and num2.isdigit()):
            return 'Error: Numbers must only contain digits.'
        if len(num1) > 4 or len(num2) > 4:
            return 'Error: Numbers cannot be more than four digits.'

        width = max(len(num1), len(num2)) + 2  # 2 extra spaces for operator and padding
        first_line.append(num1.rjust(width))
        second_line.append(op + ' ' + num2.rjust(width - 2))
        dashes.append('-' * width)

        if show_answers:
            result = str(eval(problem))
            answers.append(result.rjust(width))

    # Join the parts with four spaces between each problem
    arranged_problems = gap.join(first_line) + '\n' + gap.join(second_line) + '\n' + gap.join(dashes)
    
    if show_answers:
        arranged_problems += '\n' + gap.join(answers)

    return arranged_problems

# Test the function
print(arithmetic_arranger(["100 - 99", "49 + 123"], True))
