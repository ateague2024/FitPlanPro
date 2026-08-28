# FitPlan Pro

FitPlan Pro is an early full-stack fitness application I originally built while in school. The project uses Flask, JavaScript, external APIs, and weather data to generate workout recommendations based on selected muscle groups and local conditions.

I have kept this repository public to show my earlier development work, API integration experience, and growth as a software developer.

---

## Live Demo

[View FitPlan Pro on Render](https://fitplanpro.onrender.com)

---

## Project Overview

FitPlan Pro allows users to select workout goals, submit location data, and receive recommended exercises alongside weather-based indoor or outdoor workout guidance.

The project also includes simulated subscription and free-trial functionality as part of the original application concept.

---

## Features

- Workout recommendations based on selected muscle groups
- Local weather integration for indoor and outdoor workout suggestions
- REST API endpoint for submitting workout and location data
- Exercise data retrieved from an external API
- Simulated monthly and yearly subscription options
- Free-trial expiration logic
- Flask-based backend with modular API utility files
- Responsive HTML, CSS, and JavaScript interface

---

## Tech Stack

**Backend**

- Python
- Flask

**Frontend**

- HTML
- CSS
- JavaScript
- Jinja2 templates

**APIs**

- ExerciseDB API
- Weather API

**Deployment**

- Deployed on Render
- Live application available through the repository website link

---

## Project Structure

```text
FitPlanPro/
├── static/
├── templates/
├── util/
│   ├── Workout_API_Accessor.py
│   └── Weather_API_Accessor.py
├── .gitignore
├── app.py
├── render.yml
├── requirements.txt
└── README.md

Local Setup
1. Clone the repository
git clone https://github.com/ateague2024/FitPlanPro.git
cd FitPlanPro
2. Create and activate a virtual environment

Windows:

python -m venv venv
venv\Scripts\activate

macOS or Linux:

python3 -m venv venv
source venv/bin/activate
3. Install dependencies
pip install -r requirements.txt
4. Configure environment variables

Create a .env file in the project root:

EXERCISE_API_KEY=your_exercise_api_key
WEATHER_API_KEY=your_weather_api_key

Do not commit the .env file or real API keys to GitHub.

5. Run the application
python app.py
6. Open the application
http://127.0.0.1:5000/
Example API Request
Endpoint
POST /recommendations
Request Body
{
  "location": {
    "latitude": 36.3,
    "longitude": -82.4
  },
  "workout_schedule": {
    "0": ["chest", "triceps"],
    "1": ["cardio"],
    "2": ["back", "biceps"]
  }
}
Expected Response

The endpoint returns workout recommendations for each scheduled day along with weather forecast information used to support indoor or outdoor workout suggestions.

What This Project Demonstrates
Flask route and API development
External API integration
JSON request and response handling
Environment-variable configuration
Modular Python utility files
Frontend and backend integration
Early subscription and trial logic
Basic cloud deployment
Future Improvements
Add user authentication
Save workout plans to a database
Improve request validation and error handling
Add automated testing
Replace simulated subscriptions with real payment processing
Improve mobile responsiveness
Add persistent user progress tracking
Expand workout personalization
Project Status

This repository represents the original school-era version of FitPlan Pro. It is maintained as a portfolio project and a record of my earlier full-stack development work.
