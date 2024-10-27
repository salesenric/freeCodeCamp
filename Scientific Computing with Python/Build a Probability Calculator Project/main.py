import copy
import random
from collections import Counter

class Hat:
    def __init__(self, **kwargs):
        self.contents = []
        
        for color, count in kwargs.items():
            self.contents.extend([color] * count)
    
    def __str__(self):
        return str(self.contents)
        
    def draw(self, num_balls_to_draw):
        draw_list = []
        if num_balls_to_draw < len(self.contents):
            for _ in range(num_balls_to_draw):
                draw_list.append(self.contents.pop(random.randint(0, len(self.contents)-1)))
        else:
            draw_list = self.contents
            self.contents = []
        return draw_list

def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
    M = 0
    for _ in range(num_experiments):
        hat_copy = copy.deepcopy(hat)
        draw_list = hat_copy.draw(num_balls_drawn)
        list_counter = Counter(draw_list)
        if all(list_counter[key] >= count for key, count in expected_balls.items()):
            M += 1

    return M / num_experiments

hat = Hat(black=6, red=4, green=3)
probability = experiment(hat=hat,
                  expected_balls={'red':2,'green':1},
                  num_balls_drawn=5,
                  num_experiments=2000)
print(hat)
print(probability)
