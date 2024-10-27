import copy
import random
from collections import Counter

class Hat:
    def __init__(self, **kwargs):
        """Initialize a Hat object with specified colors and counts of balls."""
        self.contents = []
        for color, count in kwargs.items():
            self.contents.extend([color] * count)
    
    def __str__(self):
        """Return a string representation of the hat's contents."""
        return str(self.contents)
        
    def draw(self, num_balls_to_draw):
        """Draw a specified number of balls from the hat."""
        if num_balls_to_draw >= len(self.contents):
            draw_list = self.contents
            self.contents = []
        else:
            draw_list = random.sample(self.contents, num_balls_to_draw)
            for ball in draw_list:
                self.contents.remove(ball)  # Remove drawn balls
        return draw_list

def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
    """Perform experiments to estimate the probability of drawing certain balls."""
    M = 0
    for _ in range(num_experiments):
        hat_copy = copy.deepcopy(hat)
        draw_list = hat_copy.draw(num_balls_drawn)
        list_counter = Counter(draw_list)
        if all(list_counter[key] >= count for key, count in expected_balls.items()):
            M += 1

    return round(M / num_experiments, 3)  # Round the result for better presentation

# Example usage
hat = Hat(black=6, red=4, green=3)
probability = experiment(hat=hat,
                  expected_balls={'red': 2, 'green': 1},
                  num_balls_drawn=5,
                  num_experiments=2000)
print(hat)
print(probability)
