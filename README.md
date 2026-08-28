# FitPlan Pro – AI-Powered Workout Planner

**FitPlan Pro** is a Flask-based full-stack fitness assistant that provides smart, personalized workout recommendations based on your muscle group goals and local weather data. Users can also explore simulated subscription and free trial options.

---

## Live Demo
*Coming soon – deploying on Render or Railway*

---

## Features

- ✅ AI-powered workout recommendations based on selected muscle groups
- ✅ Automatically fetches local **weather forecasts** to suggest indoor vs. outdoor workouts
- ✅ REST API endpoint for submitting location and workout schedule
- ✅ Simulated **subscription system** (monthly/yearly) with expiration logic
- ✅ Free trial functionality
- ✅ Modular codebase with clean API integration

---

## 🛠️ Tech Stack

- **Backend:** Python, Flask  
- **Frontend:** Jinja2 Templates, HTML, CSS (upgradeable to React)
- **APIs:** ExerciseDB API, Weather API  
- **Database:** Runtime (can be extended to SQLite/MySQL)  
- **Deployment:** Render (planned)

---

## Setup & Usage

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/FitPlanPro.git
cd FitPlanPro
2. Install Dependencies
bash
Copy
Edit
pip install -r requirements.txt
3. Set Up Environment Variables
Create a .env file in the root directory:

ini
Copy
Edit
EXERCISE_API_KEY=your_exercise_api_key
WEATHER_API_KEY=your_weather_api_key
4. Run the App
bash
Copy
Edit
python app.py
5. Open in Browser
cpp
Copy
Edit
http://127.0.0.1:5000/
   Project Structure
bash
Copy
Edit
/util
  ├── Workout_API_Accessor.py
  └── Weather_API_Accessor.py
/templates
/static
app.py
README.md
   Example API Usage
POST /recommendations

json
Copy
Edit
{
  "location": { "latitude": 36.3, "longitude": -82.4 },
  "workout_schedule": {
    "0": ["chest", "triceps"],
    "1": ["cardio"],
    "2": ["back", "biceps"]
  }
}
Response
 List of recommended exercises per day

 5-day weather forecast

 Future Improvements
Deploy live app with hosted frontend

Add user login + plan-saving feature

Connect to Stripe or PayPal for real subscription handling

Expand error handling and validation
