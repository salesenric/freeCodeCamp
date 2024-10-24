class Category:
    def __init__(self, category):
        # Initialize the Category with a name and an empty ledger
        self.ledger = []
        self.category = category
    
    def __str__(self):
        # Create a string representation of the category with a centered title
        output = f'{self.category:*^30}' # Center the category name in asterisks

        # Add each item in the ledger to the output
        for entry in self.ledger:
            output += f"\n{entry['description'][:23]:23}{entry['amount']:>7.2f}"
        
        # Add total balance at the end
        output += f'\nTotal: {self.get_balance()}'

        return output
    
    def deposit(self, amount, description=''):
        # Add a deposit entry to the ledger
        self.ledger.append({'amount': amount, 'description': description})

    def withdraw(self, amount, description=''):
        # Withdraw money if sufficient funds are available
        if self.check_funds(amount):
            self.ledger.append({'amount': -amount, 'description': description})
            return True
        return False

    def get_balance(self):
        # Calculate and return the total balance
        return sum(entry['amount'] for entry in self.ledger)

    def transfer(self, amount, dest_budg_cat):
        # Transfer money to another category if sufficient funds are available
        if self.check_funds(amount):
            self.withdraw(amount, f'Transfer to {dest_budg_cat.category}')
            dest_budg_cat.deposit(amount, f'Transfer from {self.category}')
            return True
        return False

    def check_funds(self, amount):
        # Check if there are sufficient funds for a withdrawal or transfer
        return self.get_balance() >= amount

def create_spend_chart(categories):
    # Create a bar chart representing the percentage spent by each category
    chart = 'Percentage spent by category'
    num_categories = len(categories)
    total_spent = 0
    sum_list = {}

    # Calculate total spending per category
    for category in categories:
        sum_cat = sum(-entry['amount'] for entry in category.ledger if entry['amount'] < 0)
        sum_list[category.category] = sum_cat
        total_spent += sum_cat
    
    # Calculate percentages for each category
    for category in sum_list:
        sum_list[category] = (sum_list[category] / total_spent * 100) // 10 * 10 if total_spent else 0

    # Build the chart from top to bottom
    for i in range(100,-10,-10):
        chart += f'\n{i:3}|'
        for category in categories:
            chart += ' o ' if sum_list[category.category] >= i else '   '
        chart += ' '

    # Add the horizontal line below the bars
    chart += '\n    ' + '-' * (3 * num_categories + 1)

    # Add category names vertically below the chart
    max_length = max(len(category.category) for category in categories)
    
    for char in range(max_length):
        chart += '\n   '
        for category in categories:
            chart += f'  {category.category[char]}' if char < len(category.category) else '   '
        chart += '  '
    
    return chart

# Example usage
food = Category('Food')
food.deposit(1000, 'deposit')
food.withdraw(10.15, 'groceries')
food.withdraw(15.89, 'restaurant and more food for dessert')
clothing = Category('Clothing')
food.transfer(50, clothing)

# Print results
print(food)
print(create_spend_chart([food, clothing]))
