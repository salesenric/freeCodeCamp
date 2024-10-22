def add_time(start, duration, day=None):
    start_hour, start_minute = map(int, start[:-3].split(':'))
    start_part = start[-2:]
    
    duration_hour, duration_minute = map(int, duration.split(':'))
    
    # Adjust hours for 12-hour format
    if start_part == "PM":
        start_hour += 12 if start_hour != 12 else 0
    elif start_hour == 12:
        start_hour = 0

    # Calculate new time
    total_minutes = start_minute + duration_minute
    total_hours = start_hour + duration_hour + total_minutes // 60
    new_minute = total_minutes % 60
    new_hour = total_hours % 24
    
    # Adjust AM/PM and 12-hour format
    new_part = "AM" if new_hour < 12 else "PM"
    new_hour = new_hour % 12 or 12
    
    # Count days
    count_day = total_hours // 24
    
    # Build the message
    message = f"{new_hour}:{new_minute:02} {new_part}"
    
    if day:
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        day_index = days.index(day.capitalize())
        new_day_index = (day_index + count_day) % 7
        message += f", {days[new_day_index]}"
    
    if count_day == 1:
        message += " (next day)"
    elif count_day > 1:
        message += f" ({count_day} days later)"
    
    return message
