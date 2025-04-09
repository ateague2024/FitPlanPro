import flask
import json
import os
from dotenv import load_dotenv
import datetime
from flask import render_template, send_from_directory
from util.Workout_API_Accessor import get_exercises
from util.Weather_API_Accessor import get_weather_data

app = flask.Flask(__name__)

# Load environment variables
load_dotenv()

# Load API keys from environment variables
exercise_api_key = os.getenv("EXERCISE_API_KEY")
if not exercise_api_key:
    print("WARNING: EXERCISE_API_KEY not found in environment variables. Please set the key.")
    # You might want to exit or raise an exception depending on your requirements


# Serve static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)


# Serve the HTML interface
@app.route('/')
def index():
    return render_template('index.html')


# API endpoint for workout recommendations
@app.route('/recommendations', methods=['POST'])
def recommendations():
    """
    API endpoint to receive location and workout schedule data and return recommendations.
    """
    try:
        data = flask.request.get_json()
        location = data.get("location")
        workout_schedule = data.get("workout_schedule")

        # Validate request data
        if not location or not workout_schedule:
            return {
                "error": "Missing required fields in request data. Please provide location and workout_schedule."}, 400

        recommendations = get_workout_recommendations(location, workout_schedule)
        return flask.jsonify(recommendations)

    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return {"error": f"Internal server error: {str(e)}"}, 500


def get_workout_recommendations(location, workout_schedule):
    """
    Fetches and transforms data to generate workout recommendations.

    Args:
        location (dict): Dictionary containing latitude and longitude.
        workout_schedule (dict): Dictionary representing workout schedule.

    Returns:
        dict: A dictionary containing exercises and weather data.
    """
    latitude = location.get("latitude")
    longitude = location.get("longitude")

    # Validate location data
    if not latitude or not longitude:
        return {"error": "Invalid location data. Please provide latitude and longitude."}, 400

    # Get dates for weather API
    today = datetime.date.today()
    date_from = today.strftime('%Y-%m-%d')
    date_to = (today + datetime.timedelta(days=4)).strftime('%Y-%m-%d')  # 5-day forecast

    # Fetch exercise data
    exercises = []
    for day, muscle_groups in workout_schedule.items():
        # Convert day index to integer if it's a string
        day_index = int(day) if isinstance(day, str) else day

        if day_index in [1, 3]:  # Tuesday and Thursday are cardio days
            cardio_exercises = get_exercises(exercise_api_key, exercise_type="cardio")
            for exercise in cardio_exercises:
                # Add the day to each exercise for easier filtering on the frontend
                exercise['day'] = day_index
                exercises.append(exercise)
        else:
            for muscle_group in muscle_groups:
                muscle_exercises = get_exercises(exercise_api_key, muscle_groups=[muscle_group])
                for exercise in muscle_exercises:
                    # Add the day to each exercise for easier filtering on the frontend
                    exercise['day'] = day_index
                    exercises.append(exercise)

    # Fetch weather data
    try:
        weather_data = get_weather_data(latitude, longitude, date_from, date_to)
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        # Provide a fallback weather data structure if the API fails
        weather_data = {
            "current": {
                "temp_2m": 72,
                "current_units": {
                    "temp_2m": "F"
                }
            }
        }

    # Create recommendations with both data sets
    return {
        "exercises": exercises,
        "weather": weather_data
    }


# Add premium subscription endpoints
@app.route('/subscribe', methods=['POST'])
def subscribe():
    """
    Handle subscription requests (this would be connected to a payment processor in production)
    """
    try:
        data = flask.request.get_json()
        plan_type = data.get("plan_type")  # "monthly" or "yearly"

        # In a real implementation, this would connect to Stripe, PayPal, etc.
        # For now, we'll just simulate a successful subscription

        return {
            "success": True,
            "message": f"Successfully subscribed to the {plan_type} plan!",
            "subscription_id": "sub_" + os.urandom(8).hex(),
            "active_until": (datetime.date.today() + datetime.timedelta(
                days=30 if plan_type == "monthly" else 365)).isoformat()
        }

    except Exception as e:
        print(f"Error processing subscription: {e}")
        return {"error": "Failed to process subscription"}, 500


# Add free trial endpoint
@app.route('/free-trial', methods=['POST'])
def free_trial():
    """
    Start a free trial subscription
    """
    try:
        data = flask.request.get_json()
        email = data.get("email")

        if not email:
            return {"error": "Email is required to start a free trial"}, 400

        # In a real implementation, this would record the user's information
        # and start a trial subscription

        return {
            "success": True,
            "message": "Your 7-day free trial has started!",
            "trial_id": "trial_" + os.urandom(8).hex(),
            "active_until": (datetime.date.today() + datetime.timedelta(days=7)).isoformat()
        }

    except Exception as e:
        print(f"Error starting free trial: {e}")
        return {"error": "Failed to start free trial"}, 500


if __name__ == "__main__":
    # Create templates and static directories if they don't exist
    os.makedirs("templates", exist_ok=True)
    os.makedirs("static", exist_ok=True)

    print("Starting FitPlan Pro application...")
    print("Access the application at http://127.0.0.1:5000/")
    app.run(debug=True, port=5000)  # Using port 5001 to avoid conflicts