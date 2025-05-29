BASE_URL_WEATHER = "https://api.open-meteo.com/v1/forecast"
BASE_URL_EXERCISE = "https://exercisedb.p.rapidapi.com/exercises"

WEATHER_API_TEMPLATE = f"{BASE_URL_WEATHER}?latitude=36.3007&longitude=-82.6057&current=temperature_2m,precipitation,rain,showers,snowfall}}"
EXERCISE_API_TEMPLATE = f"{BASE_URL_EXERCISE}/bodyPart/{{__BODYPART__}}"