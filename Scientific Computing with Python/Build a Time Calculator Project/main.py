def add_time(start, duration, day=''):

    start_hour = int(start[:start.find(':')])
    start_minute = int(start[start.find(':')+1:start.find(' ')])
    start_part = start[start.find(' ')+1:]

    duration_hour = int(duration[:duration.find(':')])
    duration_minute = int(duration[duration.find(':')+1:])

    new_hour = start_hour + duration_hour
    new_minute = start_minute + duration_minute
    new_part = start_part

    while new_minute >= 60:
        new_hour += 1
        new_minute -= 60
    
    count_day = 0

    while new_hour >= 12:
        if new_part == 'AM':
            new_part = 'PM'
        else:
            new_part = 'AM'
            count_day += 1
        new_hour -= 12
    
    if new_hour == 0:
        new_hour = 12

    message = f'{new_hour}:{new_minute:02} {new_part}'

    if day:
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        for i in range(len(days)):
            if days[i].lower() == day.lower():
                day_index = i

        new_day_index = (day_index + count_day) % 7
        message += f', {days[new_day_index]}'
    
    if count_day == 1:
        message += ' (next day)'
    elif count_day > 1:
        message += f' ({count_day} days later)'
    
    return message

print(add_time('11:59 PM', '24:05'))
