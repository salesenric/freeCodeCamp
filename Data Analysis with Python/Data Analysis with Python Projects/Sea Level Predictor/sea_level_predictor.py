import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress

def draw_plot():
    # Read data from file
    df = pd.read_csv('epa-sea-level.csv')
    year_column = 'Year'
    sea_level_column = 'CSIRO Adjusted Sea Level'

    # Create scatter plot of the observed data
    plt.figure(figsize=(12, 7))
    plt.scatter(df[year_column], df[sea_level_column], color='dodgerblue', label="Observed Data", alpha=0.7)

    # Helper function for plotting a line of best fit
    def plot_best_fit_line(start_year, end_year, data, color, label):
        subset = data[data[year_column] >= start_year]
        slope, intercept, _, _, _ = linregress(subset[year_column], subset[sea_level_column])
        years_range = range(start_year, end_year + 1)
        plt.plot(years_range, [slope * year + intercept for year in years_range], color=color, linewidth=2, label=label)
        return slope, intercept

    # Plot the first line of best fit (all data)
    slope_all, intercept_all = plot_best_fit_line(df[year_column].min(), 2050, df, color='crimson', label="Best Fit (All Data)")

    # Plot the second line of best fit (from 2000 onwards)
    slope_recent, intercept_recent = plot_best_fit_line(2000, 2050, df, color='darkgreen', label="Best Fit (2000 Onwards)")

    # Mark and annotate the sea level at 2000 for both lines
    sea_level_2000_all = slope_all * 2000 + intercept_all
    sea_level_2000_recent = slope_recent * 2000 + intercept_recent
    plt.scatter(2000, sea_level_2000_all, color='orange', marker='o', s=100, edgecolor='black', label=f"2000 (All Data): {sea_level_2000_all:.2f} in")
    plt.scatter(2000, sea_level_2000_recent, color='purple', marker='o', s=100, edgecolor='black', label=f"2000 (2000 Onwards): {sea_level_2000_recent:.2f} in")

    # Mark and annotate predictions for 2050
    sea_level_2050_all = slope_all * 2050 + intercept_all
    sea_level_2050_recent = slope_recent * 2050 + intercept_recent
    plt.scatter(2050, sea_level_2050_all, color='red', marker='x', s=120, label=f"2050 Prediction (All Data): {sea_level_2050_all:.2f} in")
    plt.scatter(2050, sea_level_2050_recent, color='blue', marker='x', s=120, label=f"2050 Prediction (2000 Onwards): {sea_level_2050_recent:.2f} in")

    # Annotate the predictions for clarity
    plt.text(2050, sea_level_2050_all, f"{sea_level_2050_all:.2f} in", fontsize=10, ha='right', color='red', weight='bold')
    plt.text(2050, sea_level_2050_recent, f"{sea_level_2050_recent:.2f} in", fontsize=10, ha='right', color='blue', weight='bold')

    # Add labels, title, and style
    plt.title("Rise in Sea Level", fontsize=18, fontweight='bold', color='navy')
    plt.xlabel("Year", fontsize=14, fontweight='bold')
    plt.ylabel("Sea Level (inches)", fontsize=14, fontweight='bold')

    # Enhance the plot's appearance
    plt.grid(visible=True, linestyle='--', alpha=0.6)
    plt.gca().set_facecolor('#f0f0f0')

    # Set legend outside the plot area for clarity
    plt.legend(loc='center left', bbox_to_anchor=(1, 0.5), fontsize=12, fancybox=True)

    # Save plot and show
    plt.tight_layout()
    plt.savefig('sea_level_plot.png')
    plt.show()
    return plt.gca()
