import pandas as pd

df = pd.read_csv("charts.csv")

filtered_df = df[df['Rank'] == 1]

filtered_df = filtered_df.sort_values(by='Date', ascending=False)

filtered_df.to_csv('filtered.csv', index=False)
