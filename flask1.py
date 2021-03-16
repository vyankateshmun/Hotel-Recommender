import pandas as pd
import numpy as np
import xgboost as xg 
from xgboost import XGBRegressor
import joblib
from joblib import dump
df = pd.read_csv('hotel_dataset.csv')
y = df.iloc[:,-1].values
X = df[['StarRating','HotelCapacity','CityRank','HasSwimmingPool','IsHoliday','FreeBreakfast']]
xgb_model = XGBRegressor()
xgb_model.fit(X, y, verbose=False)
dump(xgb_model, "hotel_prices.joblib")