from datetime import datetime


SECONDS_PER_HOUR = 3600

def printWithSpaces(record='', numSpaces: int=20):
    print("\n" * numSpaces)
    print(record)
    print("\n" * numSpaces)


def intTryParse(value):
    try:
        return int(value), True
    except ValueError:
        return value, False


def getDurationHours(date_start: datetime, date_end: datetime):
    then = date_start        
    now  = date_end                             # Now
    duration = now - then                         # For build-in functions
    duration_in_s = duration.total_seconds()      # Total number of seconds between dates

    hours = divmod(duration_in_s, SECONDS_PER_HOUR)[0] 

    return hours

