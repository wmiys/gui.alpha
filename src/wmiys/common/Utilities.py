

def printWithSpaces(record='', numSpaces: int=20):
    print("\n" * numSpaces)
    print(record)
    print("\n" * numSpaces)


def intTryParse(value):
    try:
        return int(value), True
    except ValueError:
        return value, False
