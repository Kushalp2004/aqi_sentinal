import pandas as pd
import joblib
import requests
import json
from datetime import datetime, timedelta, UTC
import warnings
import numpy as np
import os
import time

# --- 1. Configuration ---
warnings.filterwarnings('ignore')

# --- Model & File Names ---
MODEL_HOURLY_FILE = 'model_hourly.pkl'
MODEL_DAILY_FILE = 'model_daily.pkl'
FORECAST_OUTPUT_FILE = 'all_forecasts.json' 

# --- Station Configuration (Bengaluru) ---
STATIONS = {
    "peenya": {"lat": 13.0270, "lon": 77.4940, "name": "Peenya"},
    "btm_layout": {"lat": 12.9128, "lon": 77.6092, "name": "BTM Layout"},
    "bwssb": {"lat": 12.9389, "lon": 77.6974, "name": "BWSSB Kadabesanahalli"},
    "city_railway": {"lat": 12.9772, "lon": 77.5713, "name": "City Railway Station"},
    "saneguruvanahalli": {"lat": 12.9918, "lon": 77.5458, "name": "Saneguruvanahalli"},
    "hebbal": {"lat": 13.0305, "lon": 77.5925, "name": "Hebbal"},
    "silk_board": {"lat": 12.9176, "lon": 77.6235, "name": "Silk Board"},
    "jayanagar": {"lat": 12.9209, "lon": 77.5849, "name": "Jayanagar"},
    "hombegowda": {"lat": 12.9366, "lon": 77.5927, "name": "Hombegowda Nagar"},
    "mysore_road": {"lat": 12.9567, "lon": 77.5262, "name": "Mysore Road"}
}

# --- API Settings ---
WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"
OPENWEATHER_AQI_URL = "http://api.openweathermap.org/data/2.5/air_pollution"
OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY")

# --- Feature List (Must match model training) ---
FEATURES_LIST = [
    'co', 'no2', 'o3', 'so2', 'pm2_5', 'pm10', 'nh3',
    'calculated_aqi', 'temperature', 'humidity', 'wind_speed',
    'precipitation', 'pressure', 'hour', 'dayofweek', 'month',
    'dayofyear', 'weekofyear', 'aqi_lag_24hr', 'aqi_lag_48hr',
    'aqi_lag_168hr', 'aqi_roll_avg_24hr', 'aqi_roll_avg_168hr'
]

SHORT_HISTORY_FEATURES = ['aqi_lag_24hr', 'aqi_lag_48hr', 'aqi_roll_avg_24hr']
LONG_HISTORY_FEATURES = ['aqi_lag_168hr', 'aqi_roll_avg_168hr']

# --- 2. Helper Functions ---

def load_models():
    try:
        return {
            'hourly': joblib.load(MODEL_HOURLY_FILE),
            'daily': joblib.load(MODEL_DAILY_FILE)
        }
    except FileNotFoundError:
        print("Error: Model files not found.")
        return None

def fetch_data_for_station(lat, lon):
    current_data = {}
    try:
        # Fetch Weather
        w_params = {'latitude': lat, 'longitude': lon, 'current': 'temperature_2m,relative_humidity_2m,precipitation,pressure_msl,wind_speed_10m,visibility', 'timezone': 'auto'}
        w_res = requests.get(WEATHER_API_URL, params=w_params).json()['current']
        current_data.update({
            'temperature': w_res['temperature_2m'], 'humidity': w_res['relative_humidity_2m'],
            'precipitation': w_res['precipitation'], 'pressure': w_res['pressure_msl'],
            'wind_speed': w_res['wind_speed_10m'], 'visibility': w_res['visibility'],
            'datetime': pd.to_datetime(w_res['time'])
        })

        # Fetch AQI
        aqi_params = {'lat': lat, 'lon': lon, 'appid': OPENWEATHER_API_KEY}
        aqi_res = requests.get(OPENWEATHER_AQI_URL, params=aqi_params).json()
        pollutants = aqi_res['list'][0]['components']
        current_data.update({p: pollutants.get(p, 0) for p in ['pm2_5', 'pm10', 'co', 'no2', 'o3', 'so2', 'nh3']})
        return current_data
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def calculate_indian_aqi_subindex(Cp, pollutant):
    breakpoints = {
        'pm2_5': [((0, 30), (0, 50)), ((31, 60), (51, 100)), ((61, 90), (101, 200)), ((91, 120), (201, 300)), ((121, 250), (301, 400)), ((251, 1000), (401, 500))],
        'pm10': [((0, 50), (0, 50)), ((51, 100), (51, 100)), ((101, 250), (101, 200)), ((251, 350), (201, 300)), ((351, 430), (301, 400)), ((431, 1000), (401, 500))],
        'co': [((0, 1), (0, 50)), ((1.1, 2), (51, 100)), ((2.1, 10), (101, 200)), ((10.1, 17), (201, 300)), ((17.1, 34), (301, 400)), ((34.1, 100), (401, 500))]
    }
    val = Cp / 1000.0 if pollutant == 'co' else Cp
    for (low, high), (i_low, i_high) in breakpoints.get(pollutant, []):
        if low <= val <= high:
            return ((i_high - i_low) / (high - low)) * (val - low) + i_low
    return 0

def create_feature_vector(current_data):
    pollutants = ['pm2_5', 'pm10', 'co', 'no2', 'o3', 'so2', 'nh3']
    sub_indices = {p: calculate_indian_aqi_subindex(current_data.get(p, 0), p) for p in pollutants}
    current_aqi = max(sub_indices.values())
    
    current_data.update({
        'calculated_aqi': current_aqi,
        'primary_pollutant': max(sub_indices, key=sub_indices.get),
        'pollutant_details': {p: {'value': current_data[p], 'sub_index': sub_indices[p]} for p in pollutants}
    })

    dt = current_data['datetime']
    current_data.update({'hour': dt.hour, 'dayofweek': dt.dayofweek, 'month': dt.month, 'dayofyear': dt.dayofyear, 'weekofyear': int(dt.isocalendar().week)})
    
    for feat in SHORT_HISTORY_FEATURES + LONG_HISTORY_FEATURES:
        current_data[feat] = current_aqi

    df = pd.DataFrame([current_data])
    return df[FEATURES_LIST].apply(pd.to_numeric, errors='coerce').fillna(0)

def format_predictions(h_preds, d_preds, current_data, lat, lon):
    ts = current_data['datetime']
    return {
        'forecast_generated_at_utc': datetime.now(UTC).isoformat(),
        'current_conditions_time': ts.isoformat(),
        'current_aqi': round(current_data['calculated_aqi'], 2),
        'primary_pollutant': current_data['primary_pollutant'],
        'location_coords': {'latitude': lat, 'longitude': lon},
        'current_weather': {k: current_data[k] for k in ['temperature', 'humidity', 'wind_speed', 'visibility', 'precipitation', 'pressure']},
        'current_pollutants': current_data['pollutant_details'],
        'hourly_forecast': [{'time': (ts + timedelta(hours=h)).isoformat(), 'aqi': round(h_preds[0][i], 2)} for i, h in enumerate([1, 2, 3, 6, 12, 18, 24])],
        'daily_forecast': [{'date': (ts.date() + timedelta(days=d)).isoformat(), 'avg_aqi': round(d_preds[0][i-1], 2)} for i, d in enumerate(range(1, 8))]
    }

# --- 3. Main Execution ---
def main():
    if not OPENWEATHER_API_KEY:
        print("Fatal Error: Missing API Key.")
        exit(1)

    models = load_models()
    if not models: exit(1)

    all_stations_data = {}
    for sid, info in STATIONS.items():
        print(f"Processing: {info['name']}...")
        raw = fetch_data_for_station(info['lat'], info['lon'])
        if raw:
            vec = create_feature_vector(raw)
            h_p, d_p = models['hourly'].predict(vec), models['daily'].predict(vec)
            all_stations_data[sid] = format_predictions(h_p, d_p, raw, info['lat'], info['lon'])
        time.sleep(1) # API Safety

    with open(FORECAST_OUTPUT_FILE, 'w') as f:
        json.dump(all_stations_data, f, indent=2)
    print("Success: all_forecasts.json updated.")

if __name__ == "__main__":
    main()
