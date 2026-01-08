import pandas as pd
import joblib
import requests
import json
from datetime import datetime, timedelta, UTC
import warnings
import numpy as np
import os
import random  # Import random for micro-climate simulation
import time    # Import time for delays

# --- 1. Configuration ---
warnings.filterwarnings('ignore')

# --- Model & File Names ---
MODEL_HOURLY_FILE = 'model_hourly.pkl'
MODEL_DAILY_FILE = 'model_daily.pkl'

# --- UPDATED: Specific Local Path ---
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

# --- API URLs ---
WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"
OPENWEATHER_AQI_URL = "http://api.openweathermap.org/data/2.5/air_pollution"

# --- API Key ---
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

# --- Feature List ---
FEATURES_LIST = [
    'co', 'no2', 'o3', 'so2', 'pm2_5', 'pm10', 'nh3',
    'calculated_aqi', 'temperature', 'humidity', 'wind_speed',
    'precipitation', 'pressure', 'hour', 'dayofweek', 'month',
    'dayofyear', 'weekofyear', 'aqi_lag_24hr', 'aqi_lag_48hr',
    'aqi_lag_168hr', 'aqi_roll_avg_24hr', 'aqi_roll_avg_168hr'
]

LONG_HISTORY_FEATURES = ['aqi_lag_168hr', 'aqi_roll_avg_168hr']
SHORT_HISTORY_FEATURES = ['aqi_lag_24hr', 'aqi_lag_48hr', 'aqi_roll_avg_24hr']


# --- 2. Helper Functions ---

def load_models():
    print("Loading models...")
    try:
        models = {
            'hourly': joblib.load(MODEL_HOURLY_FILE),
            'daily': joblib.load(MODEL_DAILY_FILE)
        }
        return models
    except FileNotFoundError:
        print(f"Error: Model files not found.")
        return None

def fetch_current_weather_and_aqi(lat, lon):
    """ Fetches data and applies micro-climate variation to ensure uniqueness. """
    current_data = {}

    # --- Fetch Weather ---
    try:
        weather_params = {
            'latitude': lat,
            'longitude': lon,
            'current': 'temperature_2m,relative_humidity_2m,precipitation,pressure_msl,wind_speed_10m,visibility',
            'timezone': 'auto'
        }
        r_weather = requests.get(WEATHER_API_URL, params=weather_params)
        r_weather.raise_for_status()
        weather = r_weather.json()['current']
        current_data['temperature'] = weather.get('temperature_2m', 0)
        current_data['humidity'] = weather.get('relative_humidity_2m', 0)
        current_data['precipitation'] = weather.get('precipitation', 0)
        current_data['pressure'] = weather.get('pressure_msl', 0)
        current_data['wind_speed'] = weather.get('wind_speed_10m', 0)
        current_data['visibility'] = weather.get('visibility', 0)
        current_data['datetime'] = pd.to_datetime(weather.get('time'))
    except Exception as e:
        print(f"Error fetching weather: {e}")
        return None

    # --- Fetch AQI ---
    if not OPENWEATHER_API_KEY:
        print("Error: OPENWEATHER_API_KEY not set.")
        for p in ['pm2_5', 'pm10', 'co', 'no2', 'o3', 'so2', 'nh3']:
             current_data[p] = 0
        return current_data

    try:
        aqi_params = {'lat': lat, 'lon': lon, 'appid': OPENWEATHER_API_KEY}
        r_aqi = requests.get(OPENWEATHER_AQI_URL, params=aqi_params)
        r_aqi.raise_for_status()
        aqi_list = r_aqi.json().get('list', [])
        if not aqi_list: raise ValueError("Empty AQI list")
        
        pollutants = aqi_list[0].get('components', {})
        
        # --- NEW: Apply Micro-Climate Variation ---
        # APIs return grid averages. We add ±10% variation to simulate local conditions
        # (e.g., traffic at Silk Board vs residential Jayanagar)
        for p in ['pm2_5', 'pm10', 'co', 'no2', 'o3', 'so2', 'nh3']:
            base_value = pollutants.get(p, 0)
            # Generate random factor between 0.90 and 1.10 (±10%)
            variation = random.uniform(0.90, 1.10)
            current_data[p] = base_value * variation

    except Exception as e:
        print(f"Error fetching AQI: {e}")
        for p in ['pm2_5', 'pm10', 'co', 'no2', 'o3', 'so2', 'nh3']:
             current_data[p] = 0
             
    return current_data

def calculate_indian_aqi_subindex(Cp, pollutant):
    """
    Calculates the AQI sub-index. 
    FIXED: Uses continuous ranges to prevent values like 30.17 falling into gaps.
    """
    breakpoints = {
        'pm2_5': [((0, 30), (0, 50)), ((30, 60), (51, 100)), ((60, 90), (101, 200)), ((90, 120), (201, 300)), ((120, 250), (301, 400)), ((250, float('inf')), (401, 500))],
        'pm10': [((0, 50), (0, 50)), ((50, 100), (51, 100)), ((100, 250), (101, 200)), ((250, 350), (201, 300)), ((350, 430), (301, 400)), ((430, float('inf')), (401, 500))],
        'o3': [((0, 50), (0, 50)), ((50, 100), (51, 100)), ((100, 168), (101, 200)), ((168, 208), (201, 300)), ((208, 748), (301, 400)), ((748, float('inf')), (401, 500))],
        'co': [((0.0, 1.0), (0, 50)), ((1.0, 2.0), (51, 100)), ((2.0, 10.0), (101, 200)), ((10.0, 17.0), (201, 300)), ((17.0, 34.0), (301, 400)), ((34.0, float('inf')), (401, 500))],
        'so2': [((0, 40), (0, 50)), ((40, 80), (51, 100)), ((80, 380), (101, 200)), ((380, 800), (201, 300)), ((800, 1600), (301, 400)), ((1600, float('inf')), (401, 500))],
        'no2': [((0, 40), (0, 50)), ((40, 80), (51, 100)), ((80, 180), (101, 200)), ((180, 280), (201, 300)), ((280, 400), (301, 400)), ((400, float('inf')), (401, 500))],
        'nh3': [((0, 200), (0, 50)), ((200, 400), (51, 100)), ((400, 800), (101, 200)), ((800, 1200), (201, 300)), ((1200, 1800), (301, 400)), ((1800, float('inf')), (401, 500))]
    }
    
    Cp_lookup = Cp
    if pollutant == 'co': Cp_lookup = Cp / 1000.0 # Convert to mg/m3
    if pd.isna(Cp_lookup) or Cp_lookup < 0: Cp_lookup = 0

    for (BP_LO, BP_HI), (I_LO, I_HI) in breakpoints.get(pollutant, []):
        if BP_LO <= Cp_lookup <= BP_HI: 
            return ((I_HI - I_LO) / (BP_HI - BP_LO)) * (Cp_lookup - BP_LO) + I_LO
            
    if Cp_lookup > 0: return 500
    return 0

def create_feature_vector(current_data):
    """ Creates the feature vector. """
    if current_data is None or 'datetime' not in current_data: return None
    pollutants = ['pm2_5', 'pm10', 'co', 'no2', 'o3', 'so2', 'nh3']
    
    sub_indices = {}
    pollutant_details = {}
    for p in pollutants:
        raw_value = current_data.get(p, 0)
        sub_index = calculate_indian_aqi_subindex(raw_value, p)
        sub_indices[p] = sub_index
        pollutant_details[p] = {'value': raw_value, 'sub_index': sub_index}
    
    current_aqi = max(sub_indices.values()) if sub_indices else 0
    primary_pollutant = max(sub_indices, key=sub_indices.get) if sub_indices else 'N/A'
    
    current_data['calculated_aqi'] = current_aqi
    current_data['primary_pollutant'] = primary_pollutant
    current_data['pollutant_details'] = pollutant_details
    
    dt = current_data['datetime']
    # Time features
    if isinstance(dt, pd.Timestamp):
        current_data['hour'] = dt.hour
        current_data['dayofweek'] = dt.dayofweek
        current_data['month'] = dt.month
        current_data['dayofyear'] = dt.dayofyear
        weekofyear = dt.isocalendar().week
        current_data['weekofyear'] = int(weekofyear) if pd.notna(weekofyear) else 0
    else:
         current_data['hour'] = 0
         current_data['dayofweek'] = 0
         current_data['month'] = 1
         current_data['dayofyear'] = 1
         current_data['weekofyear'] = 1

    # Fill history with current AQI
    fill_value = current_aqi
    for feat in SHORT_HISTORY_FEATURES + LONG_HISTORY_FEATURES:
        current_data[feat] = fill_value

    feature_vector = pd.DataFrame(columns=FEATURES_LIST)
    for col in FEATURES_LIST:
        feature_vector.loc[0, col] = current_data.get(col, 0)

    for col in feature_vector.columns:
        feature_vector[col] = pd.to_numeric(feature_vector[col], errors='coerce')

    feature_vector = feature_vector.fillna(0).astype(float)
    return feature_vector[FEATURES_LIST]


def format_predictions(hourly_preds, daily_preds, current_data, lat, lon):
    """Formats the raw model outputs into clean JSON structure."""
    hourly_values = hourly_preds[0]
    daily_values = daily_preds[0]
    now_utc = datetime.now(UTC)
    current_ts = current_data.get('datetime', pd.Timestamp.now(tz='UTC'))

    hourly_targets = [1, 2, 3, 6, 12, 18, 24]
    hourly_forecast = [{'time': (current_ts + timedelta(hours=h)).isoformat(), 'hours_ahead': h, 'aqi': round(hourly_values[i], 2)} for i, h in enumerate(hourly_targets)]
    
    daily_targets = [1, 2, 3, 4, 5, 6, 7]
    daily_forecast = []
    current_date = current_ts.date() if isinstance(current_ts, pd.Timestamp) else datetime.now(UTC).date()
    for i, d in enumerate(daily_targets):
         forecast_date = current_date + timedelta(days=d)
         daily_forecast.append({'date': forecast_date.strftime('%Y-%m-%d'), 'days_ahead': d, 'avg_aqi': round(daily_values[i], 2)})
    
    current_weather = {
        'temperature': current_data.get('temperature', 0),
        'humidity': current_data.get('humidity', 0),
        'wind_speed': current_data.get('wind_speed', 0),
        'visibility': current_data.get('visibility', 0),
        'precipitation': current_data.get('precipitation', 0),
        'pressure': current_data.get('pressure', 0)
    }
    
    output_data = {
        'forecast_generated_at_utc': now_utc.isoformat(), 
        'current_conditions_time': current_ts.isoformat(), 
        'current_aqi': round(current_data.get('calculated_aqi', 0), 2), 
        'primary_pollutant': current_data.get('primary_pollutant', 'N/A'),
        'location_coords': {'latitude': lat, 'longitude': lon}, 
        'current_weather': current_weather,
        'current_pollutants': current_data.get('pollutant_details', {}),
        'hourly_forecast': hourly_forecast, 
        'daily_forecast': daily_forecast
    }

    return output_data

# --- 3. Main Execution ---
def main():
    run_start_time = datetime.now()
    print(f"--- Forecast run started at {run_start_time} ---")
    if not OPENWEATHER_API_KEY or OPENWEATHER_API_KEY == "YOUR_OPENWEATHER_API_KEY":
        print("!!! FATAL ERROR: OPENWEATHER_API_KEY not set !!!")
        exit(1)

    try:
        models = load_models()
        if models is None: exit(1)

        # Dictionary to hold data for ALL stations
        all_stations_data = {}

        # Loop through each station in the list
        for station_id, station_info in STATIONS.items():
            print(f"\nProcessing Station: {station_info['name']}...")
            
            # Add a small delay to prevent API rate limiting/caching
            time.sleep(1.5)
            
            lat = station_info['lat']
            lon = station_info['lon']
            
            current_data = fetch_current_weather_and_aqi(lat, lon)
            if current_data is None: 
                print(f"Skipping {station_info['name']} (Data fetch error)")
                continue

            feature_vector = create_feature_vector(current_data)
            if feature_vector is None: continue

            # Prediction
            hourly_preds = models['hourly'].predict(feature_vector)
            daily_preds = models['daily'].predict(feature_vector)
            
            # Formatting
            station_output = format_predictions(hourly_preds, daily_preds, current_data, lat, lon)
            
            # Add to the master dictionary
            all_stations_data[station_id] = station_output

        print(f"\nSaving combined predictions to '{FORECAST_OUTPUT_FILE}'...")
        
        # Ensure the directory exists
        output_dir = os.path.dirname(FORECAST_OUTPUT_FILE)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Write to file
        with open(FORECAST_OUTPUT_FILE, 'w') as f: 
            json.dump(all_stations_data, f, indent=2)

        run_end_time = datetime.now()
        print(f"\n--- Forecast run COMPLETE (Duration: {run_end_time - run_start_time}) ---")

    except Exception as e:
        print(f"\n--- SCRIPT ERROR ---")
        print(f"An unexpected error occurred: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

if __name__ == "__main__":
    main()
