class Category:
    def __init__(self, category):
        self.ledger = []
        self.category = category
    
    def __str__(self):
        output = ''
        n = (30 - len(self.category)) // 2
        for _ in range(n):
            output += '*'
        output += self.category
        for _ in range(n):
            output += '*'

        for i in range(len(self.ledger)):
            output += f"\n{self.ledger[i]['description'][:23]:23}{self.ledger[i]['amount']:>7.2f}"

        output += f'\nTotal: {self.get_balance()}'

        return output
    
    def deposit(self, amount, description=''):
        self.ledger.append({'amount': amount, 'description': description})

    def withdraw(self, amount, description=''):
        if not self.check_funds(amount):
            return False
        self.ledger.append({'amount': -amount, 'description': description})
        return True

    def get_balance(self):
        balance = 0
        for i in range(len(self.ledger)):
            balance += self.ledger[i]['amount']
        return balance

    def transfer(self, amount, dest_budg_cat):
        if not self.check_funds(amount):
            return False
        self.withdraw(amount, f'Transfer to {dest_budg_cat.category}')
        dest_budg_cat.deposit(amount, f'Transfer from {self.category}')
        return True

    def check_funds(self, amount):
        return self.get_balance() >= amount

def create_spend_chart(categories):
    chart = 'Percentage spent by category'
    n = len(categories)
    sum_total = 0
    sum_list = {}

    for category in categories:
        sum_cat = 0
        for i in category.ledger:
            if i['amount'] < 0:
                sum_cat += i['amount']
                sum_total += i['amount']
        sum_list[category.category] = sum_cat
    
    for category in categories:
        if sum_total!= 0:
            sum_list[category.category] = (int(sum_list[category.category] / sum_total * 100) // 10) * 10
    
    for i in range(100,-10,-10):
        chart += f'\n{i:3}|'
        for j in range(n):
            if sum_list[categories[j].category] >= i:
                chart += ' o '
            else:
                chart += '   '
        chart += ' '

    chart += '\n    ' + '-' * (3 * n + 1)

    max_length = max(len(category.category) for category in categories)
    
    for char in range(max_length):
        chart += '\n   '
        for j in range(n):
            if char < len(categories[j].category):
                chart += f'  {categories[j].category[char]}'
            else:
                chart += '   '
        chart += '  '
    
    return chart

food = Category('Food')
food.deposit(1000, 'deposit')
food.withdraw(10.15, 'groceries')
food.withdraw(15.89, 'restaurant and more food for dessert')
clothing = Category('Clothing')
food.transfer(50, clothing)
print(food)
print(create_spend_chart([food, clothing]))
