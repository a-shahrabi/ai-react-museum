# AI & Data Science Learning Hub for Students
Overview

This web application is an interactive, beginner-friendly platform designed for middle school students in Ontario to learn about Machine Learning and Data Science in a safe, engaging, and school-compliant way.
It avoids complicated games or coding requirements, focusing instead on visual, guided, and hands-on activities that build understanding step-by-step.

# Features

Light Introduction to AI and Data Science concepts

Three non-game interactive modules that explain:

How data is visualized and interpreted

The machine learning pipeline (data → features → training → predictions)

How bias in datasets can affect model performance

One safe, preloaded hands-on activity where students interact with a mini AI model or dataset (no uploads required)

School-friendly design: No personal data collection, no external tracking, all content runs in the browser

# Modules
1. Welcome & Intro

Short explanation of what AI and Data Science are, with real-world examples.

Goal: Spark curiosity.

2. Data Visualization Explorer

Students explore a preloaded dataset (e.g., weather data, sports results) using interactive charts.

Goal: Understand how data presentation changes interpretation.

3. ML Pipeline Walkthrough

Step-by-step panels showing how raw data becomes predictions.

Goal: Demystify the machine learning process.

4. Bias & Fairness Checker

Demonstrates the effect of unbalanced datasets on prediction quality.

Goal: Introduce ethical considerations in AI.

5. Hands-On: Mini Classifier

Students “train” a model with preloaded examples and test its predictions.

Goal: Apply concepts in a safe, interactive way.

Tech Stack

Frontend: React + Vite

Visualization: Chart.js / Plotly.js

ML (Optional): TensorFlow.js for in-browser models

Styling: Tailwind CSS

Hosting: Vercel / Netlify (recommended)

Installation
# Clone the repository
git clone https://github.com/yourusername/yourprojectname.git

# Navigate into the project directory
cd yourprojectname

# Install dependencies
npm install

# Start the development server
npm run dev

Running the App

Open your browser and go to http://localhost:5173 (or the port Vite specifies)

Navigate through the modules from the home screen

No account or login is required

Safety & Privacy

No user-uploaded images or files

No personal data collection

No third-party analytics

Fully AODA/WCAG 2.1 AA accessible design

Credits

Inspired by open educational tools like Machine Learning for Kids, Quick, Draw!, and Google Teachable Machine.

All datasets and images are locally hosted for student privacy.
