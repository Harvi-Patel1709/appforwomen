# User Guide
 
[Back to README](../README.md) | [Architecture](ARCHITECTURE.md) | [API Reference](API_REFERENCE.md) | [Frontend Flows](FRONTEND_FLOWS.md)
 
Welcome to Eraya! This guide walks you through every feature of the app, from creating your account to tracking your cycle, logging symptoms, finding doctors, and using wellness tools.
 
---
 
## Table of Contents
 
- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Cycle Tracking](#cycle-tracking)
- [Symptom Logging](#symptom-logging)
- [Doctor Directory & Appointments](#doctor-directory--appointments)
- [Wellness Hub](#wellness-hub)
- [Profile & Settings](#profile--settings)
- [Tips & Best Practices](#tips--best-practices)
- [Troubleshooting](#troubleshooting)
 
---
 
## Getting Started
 
### Creating Your Account
 
1. Open Eraya in your web browser
2. Click **Sign Up** on the login page
3. Enter your **email address**, **name**, and a **password**
4. Click **Create Account**
5. A welcome email will be sent to your inbox
 
### Completing the Onboarding Wizard
 
After registration, you will be guided through a 3-step setup:
 
#### Step 1: Personal Information
- Enter your date of birth
- Set your preferred language/region
 
#### Step 2: Cycle Information
- Enter the **start date of your last period**
- Enter your **average cycle length** (typical range: 21-35 days)
- Enter your **average period duration** (typical range: 3-7 days)
 
This information powers Eraya's cycle predictions and phase calculations.
 
#### Step 3: Health Goals
- Select your wellness goals (e.g., track symptoms, improve fitness, manage stress)
- These preferences personalize your dashboard content
 
### Logging In
 
1. Go to the login page
2. Enter your **email** and **password**
3. Optionally check **Remember me** to save your email for next time
4. Click **Log In**
 
You will be redirected to the dashboard.
 
### Logging Out
 
Click the **Logout** button in the top navigation bar on any page.
 
---
 
## Dashboard Overview
 
The dashboard is your home screen after logging in. It provides a quick overview of your cycle status and one-click access to all features.
 
### What You See
 
- **Cycle Calendar**: An interactive monthly calendar showing your current cycle phase with color coding
- **Cycle Day Counter**: Shows which day of your cycle you are on
- **Phase Indicator**: Displays your current menstrual phase (Menstrual, Follicular, Ovulation, or Luteal)
- **Feature Cards**: Quick-access cards to navigate to Symptoms, Doctors, Wellness, and My Cycle pages
 
### Navigation
 
Click any feature card to navigate to that section:
 
| Card | Destination | What It Does |
|------|-------------|-------------|
| **Track Symptoms** | Symptoms page | Log daily symptoms and intensity |
| **Find Doctors** | Doctors page | Browse nearby healthcare providers |
| **Wellness** | Wellness hub | Meditation, hydration, health tips |
| **My Cycle** | Cycle insights | Detailed phase information and predictions |
 
---
 
## Cycle Tracking
 
### Understanding Your Phases
 
Eraya divides your menstrual cycle into four phases, each shown with a distinct color on the calendar:
 
| Phase | Typical Days | Description |
|-------|-------------|-------------|
| **Menstrual** | Days 1-5 | Your period. The uterine lining sheds. |
| **Follicular** | Days 6-13 | Hormone levels rise. Energy and mood often improve. |
| **Ovulation / Fertile** | Days 14-16 | Egg is released. Peak fertility window. |
| **Luteal** | Days 17-28 | Progesterone rises. PMS symptoms may appear. |
 
*Actual timing varies based on your individual cycle length.*
 
### Using the Cycle Calendar
 
The calendar on the dashboard and My Cycle page displays:
 
- **Today**: Highlighted with a distinct marker
- **Period days**: Colored to indicate menstrual phase
- **Fertile window**: Marked to show predicted ovulation days
- **Phase colors**: Each phase has a unique color for easy identification
 
#### Navigating months
- Click the **left arrow** to view the previous month
- Click the **right arrow** to view the next month
 
### My Cycle Page
 
The **My Cycle** page provides deeper insights:
 
- **Phase Timeline**: Visual bar showing all four phases and where you currently are
- **Cycle Statistics**: Average cycle length, period duration, and cycle regularity
- **Phase Details**: Detailed description of each phase with typical symptoms and self-care tips
- **Predictions**: Estimated dates for your next period and fertile window
 
---
 
## Symptom Logging
 
### How to Log Symptoms
 
1. Navigate to the **Symptoms** page from the dashboard
2. Select today's date (or choose a different date)
3. Choose symptoms from the category chips:
 
#### Symptom Categories
 
| Category | Example Symptoms |
|----------|-----------------|
| **Mood** | Happy, Sad, Anxious, Irritable, Calm, Energetic |
| **Physical** | Cramps, Headache, Bloating, Breast tenderness, Backache, Fatigue |
| **Sex / Drive** | High libido, Low libido, Protected, Unprotected |
| **Flow** | Light, Medium, Heavy, Spotting |
| **Discharge** | Dry, Sticky, Creamy, Watery, Egg white |
| **Digestion** | Normal, Constipation, Diarrhea, Nausea, Cravings |
| **Activity** | Exercise, Rest day, Yoga, Walking, Running |
| **Water Intake** | Glasses consumed (numeric tracking) |
 
4. Set the **intensity level** (1-10 scale)
5. Add optional **notes** for additional context
6. Click **Save**
 
### Viewing Symptom History
 
- Scroll down on the Symptoms page to see your **recent logs**
- Each entry shows the date, logged symptoms, intensity, and any notes
- Use this history to identify patterns across your cycle
 
### Offline Support
 
If you are offline or the server is temporarily unavailable:
- Symptoms are saved to your browser's local storage
- They will be synced with the server when connectivity returns
- You will not lose any data during brief outages
 
---
 
## Doctor Directory & Appointments
 
### Finding Nearby Doctors
 
1. Navigate to the **Doctors** page
2. Allow location access when prompted by your browser
3. Eraya searches for healthcare providers within 5 km of your location
 
### Filtering by Specialty
 
Use the filter tabs to narrow results:
 
| Filter | Shows |
|--------|-------|
| **All** | All healthcare providers |
| **Gynecologist** | OB/GYN specialists |
| **Endocrinologist** | Hormone and endocrine specialists |
| **Nutritionist** | Diet and nutrition specialists |
| **Therapist** | Mental health professionals |
| **PCOS Specialist** | Providers specializing in PCOS |
 
### Doctor Cards
 
Each doctor card displays:
- **Name** and credentials
- **Specialty** category
- **Address** (reverse-geocoded from coordinates)
- **Distance** from your location
- **Book Appointment** button
 
### Booking an Appointment
 
1. Click **Book Appointment** on a doctor card
2. Fill in the booking form:
   - **Preferred date**: Select your desired appointment date
   - **Preferred time**: Choose a time slot
   - **Your name**: Full name for the appointment
   - **Phone number**: Contact number for confirmation
   - **Reason** (optional): Brief description of why you need the visit
3. Click **Submit**
4. You will see a confirmation message with your booking status
 
### Viewing Your Appointments
 
- Your booked appointments appear in your appointment list
- Each appointment shows:
  - Doctor name and specialty
  - Date and time
  - Status: **Pending**, **Confirmed**, or **Completed**
 
---
 
## Wellness Hub
 
### Meditation Timer
 
1. Go to the **Wellness** page
2. Find the **Meditation** section
3. Select a meditation duration or set a custom timer
4. Click **Start** to begin
5. A calming timer counts down your session
6. Your total meditation sessions are tracked in your wellness stats
 
### Hydration Tracker
 
1. On the Wellness page, find the **Hydration** section
2. Log each glass of water by clicking the **+** button
3. Track your daily progress toward your hydration goal
4. Your hydration stats persist across sessions
 
### Health Tips
 
The Wellness page displays rotating health tips and wellness content relevant to your current cycle phase, including:
- Nutrition suggestions
- Exercise recommendations
- Self-care practices
- Stress management techniques
 
### AI Wellness Chatbot
 
1. Look for the **chat icon** on the Wellness page
2. Click to open the chatbot window
3. Type your health or wellness question
4. The AI provides personalized guidance based on your query
5. Conversation history is maintained during your session
 
**Note:** The chatbot provides general wellness guidance and is not a substitute for professional medical advice.
 
---
 
## Profile & Settings
 
### Profile Page
 
Your profile page shows a summary of your account:
- **Name** and email address
- **Member since** date
- **Cycle statistics** (average cycle length, period duration)
- **Tracking streak** and activity summary
 
### Settings Page
 
The settings page lets you manage your account:
 
#### Account Management
- Update your name or email
- Change your password
- View your account creation date
 
#### Data & Privacy
- **Export data**: Download your symptom logs and cycle data
- **Clear local data**: Remove cached data from your browser
 
#### Preferences
- Toggle notification preferences
- Adjust cycle tracking settings
- Update your health goals
 
---
 
## Tips & Best Practices
 
### For Accurate Predictions
 
- **Log consistently**: The more data you provide, the better Eraya can predict your cycle
- **Track every period**: Mark the start and end of each period for accurate cycle length calculations
- **Log symptoms daily**: Regular symptom logging reveals patterns you might miss otherwise
- **Update cycle settings**: If your cycle length changes, update it in your profile for better predictions
 
### For Privacy & Security
 
- **Use a strong password**: At least 8 characters with a mix of letters, numbers, and symbols
- **Log out on shared devices**: Always log out when using a public or shared computer
- **Keep your browser updated**: Modern browsers provide better security for session cookies
 
### For the Best Experience
 
- **Allow location access**: This enables the doctor discovery feature to find providers near you
- **Use a modern browser**: Chrome, Firefox, Safari, or Edge for full feature support
- **Check your email**: Look for welcome and notification emails from Eraya
- **Explore the wellness hub**: Use the meditation timer and hydration tracker daily for best results
 
---
 
## Troubleshooting
 
### I cannot log in
 
- Double-check your email and password
- Make sure Caps Lock is off
- Try clearing your browser cookies and logging in again
- If you forgot your password, contact support for a reset
 
### The page loads slowly
 
- Check your internet connection
- Try refreshing the page
- Clear your browser cache (Settings > Clear browsing data)
- The app works offline for basic features using cached data
 
### Doctors page shows no results
 
- Make sure you have granted location permission to the browser
- Check that your browser supports the Geolocation API
- Try a different browser if the issue persists
- The search covers a 5 km radius; results depend on your location
 
### My symptoms were not saved
 
- Check your internet connection
- Symptoms are saved locally even if the server is unreachable
- Try saving again when you have a stable connection
- Check the browser console for error messages
 
### The calendar shows incorrect dates
 
- Verify your cycle settings (last period date, cycle length, period duration)
- Update your cycle information on the setup or settings page
- Predictions improve over time as you log more data
 
### Chatbot is not responding
 
- Ensure the `GEMINI_API_KEY` is configured (admin/deployment setting)
- Check your internet connection
- Try refreshing the page and reopening the chat window