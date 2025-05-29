import requests
from util.URL_Templates import EXERCISE_API_TEMPLATE

api_key = "9gy7h44vBufpXnLhODClDQ==toXWEoCiDkYRI3kb"

def get_exercises(api_key, muscle_groups=None, exercise_type="muscle"):
    exercises = []
    if not api_key:
        raise ValueError("Please provide a valid ExerciseDB API key.")

    if muscle_groups and exercise_type != "muscle":
        raise ValueError("Muscle groups can only be used with exercise_type='muscle'")

    if exercise_type not in ("muscle", "cardio", "olympic_weightlifting", "plyometrics", "powerlifting", "strength", "stretching", "strongman"):
        raise ValueError("Invalid exercise_type. Must be one of: muscle, cardio, olympic_weightlifting, plyometrics, powerlifting, strength, stretching, strongman")

    base_url = "https://api.api-ninjas.com/v1/exercises"

    if muscle_groups:
        for group in muscle_groups:
            url = f"{base_url}?muscle={group}"
            headers = {"X-Api-Key": api_key}

            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                exercises.extend(response.json())
            else:
                print(f"Error fetching data for {group}:", response.text)
    elif exercise_type:
        url = f"{base_url}?type={exercise_type}"
        headers = {"X-Api-Key": api_key}

        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            exercises.extend(response.json())
        else:
            print(f"Error fetching {exercise_type} exercises:", response.text)

    return exercises