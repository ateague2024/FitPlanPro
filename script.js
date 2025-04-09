// FitPlan Pro - API Integration Script

// Configuration
const API_ENDPOINT = '/recommendations';
const API_KEY = "9gy7h44vBufpXnLhODClDQ==toXWEoCiDkYRI3kb";

// DOM Elements
let locationInput;
let detectLocationBtn;
let weatherTemp;
let weatherDesc;
let workoutCards;

// Current state
let currentLocation = {
    latitude: null,
    longitude: null
};

// Workout schedule from your existing code
const workoutSchedule = {
    0: ["chest", "triceps"],  // Monday
    1: ["cardio"],           // Tuesday
    2: ["hamstrings", "calves", "glutes"],  // Wednesday
    3: ["cardio"],           // Thursday
    4: ["biceps", "lower_back", "middle_back", "traps"]  // Friday
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    locationInput = document.getElementById('location-input');
    detectLocationBtn = document.getElementById('detect-location');
    weatherTemp = document.getElementById('weather-temp');
    weatherDesc = document.getElementById('weather-desc');
    workoutCards = document.querySelectorAll('.workout-card');

    // Set up event listeners
    detectLocationBtn.addEventListener('click', detectUserLocation);

    // Set up premium buttons
    const premiumButtons = document.querySelectorAll('.premium-button, .upgrade-button');
    premiumButtons.forEach(button => {
        button.addEventListener('click', showSubscriptionOptions);
    });

    // Initialize exercise info buttons
    initializeExerciseButtons();

    // Load today's workout on initial load
    highlightTodayWorkout();
});

// Detect user location
function detectUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                currentLocation.latitude = position.coords.latitude;
                currentLocation.longitude = position.coords.longitude;

                // Get location name via reverse geocoding
                fetchLocationName(currentLocation.latitude, currentLocation.longitude);

                // Fetch workout recommendations
                fetchWorkoutRecommendations();
            },
            // Error callback
            (error) => {
                console.error("Error getting location:", error);
                alert("Could not detect your location. Please enter it manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser. Please enter your location manually.");
    }
}

// Fetch location name using reverse geocoding
async function fetchLocationName(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();

        if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || '';
            const state = data.address.state || '';
            locationInput.value = city + (state ? `, ${state}` : '');
        }
    } catch (error) {
        console.error("Error fetching location name:", error);
    }
}

// Fetch workout recommendations
async function fetchWorkoutRecommendations() {
    try {
        // Prepare request data
        const requestData = {
            location: {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude
            },
            workout_schedule: workoutSchedule
        };

        // Make API request to recommendations endpoint
        const response = await fetch('/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check for any errors in the response
        if (data.error) {
            throw new Error(data.error);
        }

        // Update UI with recommendations
        updateWeatherDisplay(data.weather);
        updateWorkoutCards(data.exercises);

    } catch (error) {
        console.error("Error fetching recommendations:", error);

        // User-friendly error handling
        const weatherSummary = document.querySelector('.weather-summary');
        const errorElement = document.createElement('div');
        errorElement.className = 'weather-recommendation';
        errorElement.textContent = `Unable to fetch recommendations: ${error.message}`;
        errorElement.style.color = 'red';

        // Remove any existing recommendation
        const existingRecommendation = weatherSummary.querySelector('.weather-recommendation');
        if (existingRecommendation) {
            weatherSummary.removeChild(existingRecommendation);
        }

        weatherSummary.appendChild(errorElement);
    }
}

// Update the weather display
function updateWeatherDisplay(weatherData) {
    if (!weatherData || !weatherData.current) {
        console.error("Invalid weather data format");
        return;
    }

    // Extract temperature and format it
    const temp = weatherData.current.temp_2m || weatherData.current.temperature_2m;
    weatherTemp.textContent = `${Math.round(temp)}°${weatherData.current_units?.temp_2m || 'F'}`;

    // Set weather description and icon based on temperature
    let description = "Moderate";
    let iconClass = "fa-cloud-sun";

    if (temp < 50) {
        description = "Cool";
        iconClass = "fa-cloud";
    } else if (temp < 65) {
        description = "Mild";
        iconClass = "fa-cloud-sun";
    } else if (temp < 80) {
        description = "Warm";
        iconClass = "fa-sun";
    } else {
        description = "Hot";
        iconClass = "fa-temperature-high";
    }

    weatherDesc.textContent = description;

    // Update weather icon
    const weatherIcon = document.querySelector('.weather-icon');
    weatherIcon.className = `fas ${iconClass} weather-icon`;

    // Add weather recommendation for outdoor workouts
    let recommendationText = "";
    if (temp > 85) {
        recommendationText = "Consider indoor workouts due to heat";
    } else if (temp < 45) {
        recommendationText = "Consider indoor workouts due to cold";
    }

    // Display recommendation if needed
    if (recommendationText) {
        const weatherSummary = document.querySelector('.weather-summary');
        const recommendationElement = document.createElement('div');
        recommendationElement.className = 'weather-recommendation';
        recommendationElement.textContent = recommendationText;
        recommendationElement.style.color = '#f72585';
        recommendationElement.style.fontSize = '0.8rem';
        recommendationElement.style.fontWeight = 'bold';

        // Remove any existing recommendation
        const existingRecommendation = weatherSummary.querySelector('.weather-recommendation');
        if (existingRecommendation) {
            weatherSummary.removeChild(existingRecommendation);
        }

        weatherSummary.appendChild(recommendationElement);
    }
}

// Update workout cards with fetched exercises
function updateWorkoutCards(exercises) {
    if (!exercises || !Array.isArray(exercises)) {
        console.error("Invalid exercises data format");
        return;
    }

    // Group exercises by muscle group
    const exercisesByMuscle = {};
    exercises.forEach(exercise => {
        if (!exercisesByMuscle[exercise.muscle]) {
            exercisesByMuscle[exercise.muscle] = [];
        }
        exercisesByMuscle[exercise.muscle].push(exercise);
    });

    // Get current temperature from weather display
    const tempElement = document.getElementById('weather-temp');
    const temperature = tempElement ? parseFloat(tempElement.textContent) : 0;

    // Loop through all workout cards
    workoutCards.forEach((card, index) => {
        const dayOfWeek = index % 5; // 0 for Monday, 1 for Tuesday, etc.
        const muscleGroups = workoutSchedule[dayOfWeek] || [];

        // Update workout focus tags
        const focusContainer = card.querySelector('.workout-focus');
        focusContainer.innerHTML = ''; // Clear existing tags

        muscleGroups.forEach(muscle => {
            const focusTag = document.createElement('div');
            focusTag.className = 'focus-tag';
            focusTag.textContent = formatMuscleGroupName(muscle);
            focusContainer.appendChild(focusTag);
        });

        // Update exercise list
        const exerciseList = card.querySelector('.exercise-list');
        exerciseList.innerHTML = ''; // Clear existing exercises

        // If it's a cardio day (Tuesday/Thursday)
        if (dayOfWeek === 1 || dayOfWeek === 3) {
            // Check if temperature is above 60 degrees
            if (temperature > 60) {
                // Create outdoor activity recommendations
                const morningWalk = {
                    name: "45-Minute Morning Walk",
                    type: "outdoor",
                    muscle: "Cardio",
                    instructions: "Take a brisk 45-minute walk in the morning. Aim for a moderate pace that keeps your heart rate elevated."
                };

                const laterRun = {
                    name: "20-Minute Afternoon Run",
                    type: "outdoor",
                    muscle: "Cardio",
                    instructions: "2 hours after your morning walk, do a 20-minute run. Adjust pace based on your fitness level."
                };

                // Add outdoor activities to the exercise list
                addExerciseItem(exerciseList, morningWalk);
                addExerciseItem(exerciseList, laterRun);
            } else {
                // If temperature is 60 or below, use indoor cardio exercises
                const cardioExercises = exercises.filter(ex => ex.type === 'cardio' || ex.muscle === 'cardio');

                // Add up to 3 cardio exercises
                for (let i = 0; i < Math.min(3, cardioExercises.length); i++) {
                    addExerciseItem(exerciseList, cardioExercises[i]);
                }
            }
        } else {
            // For strength days, add exercises for each muscle group
            muscleGroups.forEach(muscle => {
                const muscleExercises = exercisesByMuscle[muscle] || [];

                // Add up to 1 exercise per muscle group
                if (muscleExercises.length > 0) {
                    addExerciseItem(exerciseList, muscleExercises[0]);
                }
            });
        }
    });
}


// Add an exercise item to the list
function addExerciseItem(container, exercise) {
    const li = document.createElement('li');
    li.className = 'exercise-item';

    li.innerHTML = `
        <div class="exercise-info">
            <div class="exercise-name">${exercise.name}</div>
            <div class="exercise-muscle">${formatMuscleGroupName(exercise.muscle || exercise.type)}</div>
        </div>
        <div class="exercise-actions">
            <button class="action-button info-button"><i class="fas fa-info-circle"></i></button>
            <button class="action-button premium-only"><i class="fas fa-video"></i></button>
        </div>
    `;

    container.appendChild(li);

    // Add event listener to the info button
    const infoButton = li.querySelector('.info-button');
    infoButton.addEventListener('click', () => showExerciseDetails(exercise));

    // Add event listener to premium-only button
    const premiumButton = li.querySelector('.premium-only');
    premiumButton.addEventListener('click', showSubscriptionOptions);
}

// Format muscle group name for display (capitalize, replace underscores)
function formatMuscleGroupName(name) {
    if (!name) return '';
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Show exercise details
function showExerciseDetails(exercise) {
    // Create modal for exercise details
    const modal = document.createElement('div');
    modal.className = 'exercise-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '10px';
    modalContent.style.padding = '2rem';
    modalContent.style.maxWidth = '600px';
    modalContent.style.width = '90%';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflowY = 'auto';

    modalContent.innerHTML = `
        <h2 style="color: #4361ee; margin-bottom: 1rem;">${exercise.name}</h2>
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <div style="background-color: #e9ecef; color: #212529; padding: 0.3rem 0.8rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600;">
                ${formatMuscleGroupName(exercise.muscle || exercise.type)}
            </div>
            <div style="background-color: #e9ecef; color: #212529; padding: 0.3rem 0.8rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600;">
                ${formatMuscleGroupName(exercise.equipment || 'Bodyweight')}
            </div>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <h3 style="color: #3f37c9; margin-bottom: 0.5rem; font-size: 1.1rem;">Instructions:</h3>
            <p style="line-height: 1.6;">${exercise.instructions || 'No instructions available.'}</p>
        </div>
        <div>
            <h3 style="color: #3f37c9; margin-bottom: 0.5rem; font-size: 1.1rem;">Recommended Sets:</h3>
            <p>3-4 sets of 8-12 repetitions</p>
        </div>
        <button id="close-modal" style="background-color: #4361ee; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 5px; cursor: pointer; font-weight: 600; margin-top: 1.5rem; transition: all 0.3s ease;">Close</button>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal when clicking the close button
    document.getElementById('close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Close modal when clicking outside the content
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Show subscription options modal
function showSubscriptionOptions() {
    // Create modal for subscription options
    const modal = document.createElement('div');
    modal.className = 'subscription-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '10px';
    modalContent.style.padding = '2rem';
    modalContent.style.maxWidth = '600px';
    modalContent.style.width = '90%';

    modalContent.innerHTML = `
        <h2 style="color: #f72585; margin-bottom: 1rem; text-align: center; font-size: 1.8rem;">Upgrade to FitPlan Pro Premium</h2>
        <p style="text-align: center; margin-bottom: 2rem; line-height: 1.6;">Get access to exclusive features and take your fitness journey to the next level!</p>

        <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem;">
            <div style="display: flex; gap: 1rem; align-items: center;">
                <i class="fas fa-video" style="color: #4361ee; font-size: 1.5rem;"></i>
                <div>
                    <h3 style="margin-bottom: 0.3rem; font-size: 1.2rem;">Exercise Video Tutorials</h3>
                    <p style="color: #6c757d; font-size: 0.9rem;">HD videos for every exercise with expert instructions</p>
                </div>
            </div>

            <div style="display: flex; gap: 1rem; align-items: center;">
                <i class="fas fa-dumbbell" style="color: #4361ee; font-size: 1.5rem;"></i>
                <div>
                    <h3 style="margin-bottom: 0.3rem; font-size: 1.2rem;">Custom Workout Plans</h3>
                    <p style="color: #6c757d; font-size: 0.9rem;">Personalized programs tailored to your goals</p>
                </div>
            </div>

            <div style="display: flex; gap: 1rem; align-items: center;">
                <i class="fas fa-chart-line" style="color: #4361ee; font-size: 1.5rem;"></i>
                <div>
                    <h3 style="margin-bottom: 0.3rem; font-size: 1.2rem;">Progress Tracking</h3>
                    <p style="color: #6c757d; font-size: 0.9rem;">Detailed stats and graphs to monitor your improvement</p>
                </div>
            </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
            <button id="monthly-plan" style="background-color: #4361ee; color: white; border: none; padding: 1rem; border-radius: 5px; cursor: pointer; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
                <span>Monthly Plan</span>
                <span>$9.99/month</span>
            </button>

            <button id="yearly-plan" style="background-color: #3f37c9; color: white; border: none; padding: 1rem; border-radius: 5px; cursor: pointer; font-weight: 600; display: flex; justify-content: space-between; align-items: center; position: relative;">
                <span>Yearly Plan</span>
                <span>$99.99/year <span style="font-size: 0.8rem; opacity: 0.9;">Save 16%</span></span>
                <div style="position: absolute; top: -10px; right: -10px; background-color: #f72585; color: white; padding: 0.2rem 0.5rem; border-radius: 50px; font-size: 0.7rem; font-weight: 700;">BEST VALUE</div>
            </button>
        </div>

        <p style="text-align: center; color: #6c757d; font-size: 0.8rem; margin-bottom: 1.5rem;">Secure payment processing. Cancel anytime.</p>

        <div style="display: flex; justify-content: space-between;">
            <button id="close-modal" style="background-color: transparent; color: #6c757d; border: 1px solid #6c757d; padding: 0.8rem 1.5rem; border-radius: 5px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">No Thanks</button>

            <button id="try-free" style="background-color: #f72585; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 5px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">Try Free for 7 Days</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal when clicking the close button
    document.getElementById('close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Handle plan selection
    document.getElementById('monthly-plan').addEventListener('click', () => {
        alert("You've selected the Monthly Plan! This would take you to the payment page.");
        document.body.removeChild(modal);
    });

    document.getElementById('yearly-plan').addEventListener('click', () => {
        alert("You've selected the Yearly Plan! This would take you to the payment page.");
        document.body.removeChild(modal);
    });

    document.getElementById('try-free').addEventListener('click', () => {
        alert("You've started your 7-day free trial! Welcome to FitPlan Pro Premium!");
        document.body.removeChild(modal);
    });

    // Close modal when clicking outside the content
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Initialize exercise info buttons
function initializeExerciseButtons() {
    const infoButtons = document.querySelectorAll('.action-button');
    infoButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (button.classList.contains('info-button')) {
                // This will be handled by the dynamic exercise creation
                return;
            }

            // For premium buttons, show subscription options
            if (button.classList.contains('premium-only')) {
                showSubscriptionOptions();
                return;
            }

            // For other buttons (in the static HTML)
            const exerciseName = this.closest('.exercise-item').querySelector('.exercise-name').textContent;
            alert(`More information about ${exerciseName} would appear here!`);
        });
    });
}

// Highlight today's workout
function highlightTodayWorkout() {
    const today = new Date().getDay(); // 0 for Sunday, 1 for Monday, etc.
    const dayIndex = today === 0 ? 5 : today - 1; // Convert to our index (0 for Monday)

    if (dayIndex >= 0 && dayIndex < 5) { // Only highlight weekdays
        const todayCard = workoutCards[dayIndex];
        todayCard.style.transform = 'scale(1.03)';
        todayCard.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';

        // Add "Today" label
        const workoutHeader = todayCard.querySelector('.workout-header');
        const todayLabel = document.createElement('span');
        todayLabel.textContent = 'TODAY';
        todayLabel.style.backgroundColor = 'white';
        todayLabel.style.color = workoutHeader.classList.contains('cardio') ? '#f72585' : '#4361ee';
        todayLabel.style.padding = '0.2rem 0.5rem';
        todayLabel.style.borderRadius = '50px';
        todayLabel.style.fontSize = '0.7rem';
        todayLabel.style.fontWeight = '700';
        todayLabel.style.marginLeft = '0.5rem';

        const headerTitle = workoutHeader.querySelector('h2');
        headerTitle.appendChild(todayLabel);
    }
}