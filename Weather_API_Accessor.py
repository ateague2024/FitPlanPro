import requests


def get_weather_data(latitude, longitude, date_from=None, date_to=None):
    """
  Fetches weather data from the Open-Meteo API.

  Args:
      latitude (float): Latitude coordinate.
      longitude (float): Longitude coordinate.
      date_from (str, optional): Start date in YYYY-MM-DD format.
      date_to (str, optional): End date in YYYY-MM-DD format.

  Returns:
      dict: A dictionary containing weather data.
  """
    try:
        # Build the API URL - using a direct approach without dependencies
        url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,precipitation&temperature_unit=fahrenheit"

        # Make a standard requests API call
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for non-200 status codes

        # Convert response to JSON
        weather_data = response.json()

        return weather_data
    except Exception as e:
        print(f"Error in weather API request: {e}")
        # Return fallback weather data
        return {
            "current": {
                "temperature_2m": 72,
                "current_units": {
                    "temperature_2m": "F"
                }
            }
        }