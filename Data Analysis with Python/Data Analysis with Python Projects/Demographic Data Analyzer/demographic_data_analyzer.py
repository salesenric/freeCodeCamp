import pandas as pd

def calculate_demographic_data(print_data=True):
    # Read data from file
    df = pd.read_csv('adult.data.csv', delimiter=',', header=0)

    # Helper function to calculate percentage
    def calculate_percentage(subset, total):
        return round((subset.shape[0] / total) * 100, 1)

    # How many of each race are represented in this dataset?
    race_count = df['race'].value_counts()

    # Average age of men
    average_age_men = round(df[df['sex'] == 'Male']['age'].mean(), 1)

    # Percentage of people with a Bachelor's degree
    percentage_bachelors = calculate_percentage(df[df['education'] == 'Bachelors'], df.shape[0])

    # Define advanced education levels
    advanced_education = ['Bachelors', 'Masters', 'Doctorate']
    
    # People with and without advanced education
    higher_education = df[df['education'].isin(advanced_education)]
    lower_education = df[~df['education'].isin(advanced_education)]
    
    # Percentage of people with advanced education earning >50K
    higher_education_rich = calculate_percentage(higher_education[higher_education['salary'] == '>50K'], higher_education.shape[0])
    lower_education_rich = calculate_percentage(lower_education[lower_education['salary'] == '>50K'], lower_education.shape[0])

    # Minimum hours worked per week
    min_work_hours = df['hours-per-week'].min()

    # Percentage of rich among those who work the minimum hours
    num_min_workers = df[df['hours-per-week'] == min_work_hours]
    rich_percentage = calculate_percentage(num_min_workers[num_min_workers['salary'] == '>50K'], num_min_workers.shape[0])

    # Country with the highest percentage of people earning >50K
    country_salary_ratio = (df[df['salary'] == '>50K']['native-country'].value_counts() / 
                            df['native-country'].value_counts() * 100).dropna()
    highest_earning_country = country_salary_ratio.idxmax()
    highest_earning_country_percentage = round(country_salary_ratio.max(), 1)

    # Most popular occupation for >50K earners in India
    top_IN_occupation = df[(df['native-country'] == 'India') & 
                           (df['salary'] == '>50K')]['occupation'].value_counts().idxmax()

    # DO NOT MODIFY BELOW THIS LINE
    if print_data:
        print("Number of each race:\n", race_count)
        print("Average age of men:", average_age_men)
        print(f"Percentage with Bachelors degrees: {percentage_bachelors}%")
        print(f"Percentage with higher education that earn >50K: {higher_education_rich}%")
        print(f"Percentage without higher education that earn >50K: {lower_education_rich}%")
        print(f"Min work time: {min_work_hours} hours/week")
        print(f"Percentage of rich among those who work fewest hours: {rich_percentage}%")
        print("Country with highest percentage of rich:", highest_earning_country)
        print(f"Highest percentage of rich people in country: {highest_earning_country_percentage}%")
        print("Top occupations in India:", top_IN_occupation)

    return {
        'race_count': race_count,
        'average_age_men': average_age_men,
        'percentage_bachelors': percentage_bachelors,
        'higher_education_rich': higher_education_rich,
        'lower_education_rich': lower_education_rich,
        'min_work_hours': min_work_hours,
        'rich_percentage': rich_percentage,
        'highest_earning_country': highest_earning_country,
        'highest_earning_country_percentage': highest_earning_country_percentage,
        'top_IN_occupation': top_IN_occupation
    }
