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
