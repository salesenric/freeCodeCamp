class Rectangle:

    def __init__(self, width, height):
        self.width = width
        self.height = height

    def __str__(self):
        return str(f'Rectangle(width={self.width}, height={self.height})')

    def set_width(self, width):
        self.width = width
    
    def set_height(self, height):
        self.height = height
    
    def get_area(self):
        return self.width * self.height
    
    def get_perimeter(self):
        return (2 * self.width) +  (2 * self.height)
    
    def get_diagonal(self):
        return (self.width ** 2 + self.height ** 2) ** 0.5
    
    def get_picture(self):
        if self.width > 50 or self.height > 50:
            return 'Too big for picture.'

        picture = ''
        for row in range(self.height):
            for col in range(self.width):
                picture += '*'
            picture += '\n'
        return picture
    
    def get_amount_inside(self, shape):
        return int(self.get_area() / shape.get_area())
    

class Square(Rectangle):

    def __init__(self, side):
        # super().__init__(width=side, height=side)
        self.side = side

    def __str__(self):
        return str(f'Square(side={self.side})')

    def set_side(self, side):
        self.side = side
    
    def set_width(self, width):
        self.side = width
    
    def set_height(self, height):
        self.side = height
    
    def get_area(self):
        return self.side ** 2
    
    def get_perimeter(self):
        return (4 * self.side)
    
    def get_diagonal(self):
        return (self.side ** 2 + self.side ** 2) ** 0.5
    
    def get_picture(self):
        if self.side > 50:
            return 'Too big for picture.'
        picture = ''
        for row in range(self.side):
            for col in range(self.side):
                picture += '*'
            picture += '\n'
        return picture


rect = Rectangle(10, 5)
print(rect.get_area())
rect.set_height(3)
print(rect.get_perimeter())
print(rect)
print(rect.get_picture())

sq = Square(9)
print(sq.get_area())
sq.set_side(4)
print(sq.get_diagonal())
print(sq)
print(sq.get_picture())

rect.set_height(8)
rect.set_width(16)
print(rect.get_amount_inside(sq))
