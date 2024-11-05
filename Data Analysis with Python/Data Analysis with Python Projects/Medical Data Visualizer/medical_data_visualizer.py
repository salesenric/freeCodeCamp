import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Load data
df = pd.read_csv('medical_examination.csv')

# Add 'overweight' column: 1 if BMI > 25, else 0
df['overweight'] = np.where(df['weight'] / (df['height'] / 100) ** 2 > 25, 1, 0)

# Normalize 'cholesterol' and 'gluc' values: set to 1 if >1, else 0
df['cholesterol'] = np.where(df['cholesterol'] > 1, 1, 0)
df['gluc'] = np.where(df['gluc'] > 1, 1, 0)

def draw_cat_plot():
    # Melt the DataFrame to have the categorical variables in long format
    df_cat = pd.melt(df, id_vars='cardio', value_vars=['cholesterol', 'gluc', 'smoke', 'alco', 'active', 'overweight'])

    # Group and reformat the data to get counts for each condition
    df_cat = df_cat.groupby(['cardio', 'variable', 'value']).size().reset_index(name='total')
    
    # Create the categorical plot
    fig = sns.catplot(
        data=df_cat, kind='bar',
        x='variable', y='total', hue='value',
        col='cardio', height=4, aspect=1
    ).fig
    
    # Save figure
    fig.savefig('catplot.png')
    return fig

def clean_data(df):
    # Apply filtering conditions for valid data
    return df[
        (df['ap_lo'] <= df['ap_hi']) &
        (df['height'] >= df['height'].quantile(0.025)) &
        (df['height'] <= df['height'].quantile(0.975)) &
        (df['weight'] >= df['weight'].quantile(0.025)) &
        (df['weight'] <= df['weight'].quantile(0.975))
    ]

def draw_heat_map():
    # Clean the data for the heatmap
    df_heat = clean_data(df)

    # Calculate the correlation matrix
    corr = df_heat.corr()

    # Generate a mask for the upper triangle
    mask = np.triu(np.ones_like(corr, dtype=bool))

    # Set up the matplotlib figure
    fig, ax = plt.subplots(figsize=(12, 10))

    # Plot the heatmap
    sns.heatmap(
        corr, mask=mask, annot=True, fmt=".1f", cmap="coolwarm",
        square=True, cbar_kws={"shrink": .8}, ax=ax
    )
    
    # Set title for clarity
    ax.set_title("Correlation Heatmap of Medical Data")

    # Save figure
    fig.savefig('heatmap.png')
    return fig
