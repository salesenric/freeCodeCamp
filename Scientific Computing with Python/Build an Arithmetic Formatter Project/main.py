def arithmetic_arranger(problems, show_answers=False):

    problems_list = [problem.split(" ") for problem in problems]

    # print(f'{problems_list}\n')

    if len(problems_list) > 5:
        return 'Error: Too many problems.'
    
    for problem in problems_list:
        if problem[1] not in ('+', '-'):
            return "Error: Operator must be '+' or '-'."
        if not (problem[0].isdigit() and problem[2].isdigit()):
            return 'Error: Numbers must only contain digits.'
        if not (len(problem[0]) < 5 and len(problem[2]) < 5):
            return 'Error: Numbers cannot be more than four digits.'

    ops_list = [problem[0]+problem[1]+problem[2] for problem in problems_list]

    # print(f'{ops_list}\n')

    solutions_list = [eval(problem[0]+problem[1]+problem[2]) for problem in problems_list]

    # print(f'{solutions_list}\n')

    total_list = [{
                    'num1': problems_list[i][0], 
                    'op': problems_list[i][1], 
                    'num2': problems_list[i][2], 
                    'sol': solutions_list[i],
                    'size': max(len(problems_list[i][0]),len(problems_list[i][2]))
                } for i in range(len(problems_list))]

    # print(f'{total_list}\n')
    
    draw = ''

    # fila 1
    for i in range(len(total_list)):
        if i == 0:
            draw += '  '

        if len(total_list[i]['num1']) == total_list[i]['size']:
            draw += total_list[i]['num1']
        else:
            for _ in range(total_list[i]['size'] - len(total_list[i]['num1'])):
                draw += ' '
            draw += total_list[i]['num1']
        
        if i < len(total_list)-1:
            draw += '      '
        else:
            draw += f'\n'
    
    # fila 2
    for i in range(len(total_list)):
        draw += total_list[i]['op'] + ' '
        if len(total_list[i]['num2']) == total_list[i]['size']:
            draw += total_list[i]['num2']
        else:
            for _ in range(total_list[i]['size'] - len(total_list[i]['num2'])):
                draw += ' '
            draw += total_list[i]['num2']
        if i < len(total_list)-1:
            draw += '    '
        else:
            draw += f'\n'

    # fila 3
    for i in range(len(total_list)):
        draw += '--'
        for _ in range(total_list[i]['size']):
            draw += '-'
        if i < len(total_list)-1:
            draw += '    '
    
    # fila 4
    if show_answers:
        draw += f'\n'
        for i in range(len(total_list)):
            if len(str(total_list[i]['sol'])) == total_list[i]['size']:
                draw += '  '
            elif len(str(total_list[i]['sol'])) > total_list[i]['size']:
                draw += ' '
            else:
                draw += '  '
                for _ in range(total_list[i]['size'] - len(str(total_list[i]['sol']))):
                    draw += ' '
            draw += str(total_list[i]['sol'])
            if i < len(total_list)-1:
                draw += '    '

    return draw

print(f'\n{arithmetic_arranger(["100 - 99", "49 + 123"], True)}')
