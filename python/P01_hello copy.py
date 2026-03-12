# Author: OMKAR PATHAK
# This program prints the entered message

def justPrint(text):
    '''This function prints the text passed as argument to this function'''
    print(text)
    a=input("Enter a number: ")
    b=input("Enter another number: ")
    base_value = 10
    increment_value=20
    difference = increment_value - base_value
    divide_value = increment_value / base_value
    multiply_value = increment_value * base_value
    floor_division = increment_value // base_value  # // -> integer division

    print("Floor Division:", floor_division)
    # print("Difference is:", increment_value - base_value)
    print("Divide value is:", divide_value)
    print("Multiply value is:", multiply_value)
    print("Modulus:", increment_value % base_value )         # %  -> remainder
    print('Addition is:', int(a) + int(b))

if __name__ == '__main__':
    justPrint('Hello Sindhuja')
    justPrint('Hello Sindhuja')
    justPrint('Hello Sindhuja')


