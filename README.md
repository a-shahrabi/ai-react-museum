# 🤖 AI & Data Science Learning Hub for Students

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0+-646CFF.svg)](https://vitejs.dev/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-green.svg)](https://www.w3.org/WAI/WCAG21/AA/)

## 📋 Overview

This web application is an interactive, beginner-friendly platform designed for middle school students in Ontario to learn about Machine Learning and Data Science in a safe, engaging, and school-compliant way. It avoids complicated games or coding requirements, focusing instead on visual, guided, and hands-on activities that build understanding step-by-step.

## ✨ Features

- **Light Introduction to AI and Data Science concepts** tailored for middle school level
- **Three non-game interactive modules** that explain:
  - How data is visualized and interpreted
  - The machine learning pipeline (data → features → training → predictions)
  - How bias in datasets can affect model performance
- **One safe, preloaded hands-on activity** where students interact with a mini AI model or dataset (no uploads required)
- **School-friendly design**: No personal data collection, no external tracking, all content runs in the browser
- **Fully accessible**: AODA/WCAG 2.1 AA compliant design

## 📚 Learning Modules

### 1.  Welcome & Intro
Short explanation of what AI and Data Science are, with real-world examples relevant to students' daily lives.

**Goal:** Spark curiosity and establish foundational understanding.

### 2.  Data Visualization Explorer
Students explore a preloaded dataset (e.g., weather data, sports results, school lunch preferences) using interactive charts and graphs.

**Goal:** Understand how data presentation changes interpretation and discover patterns.

### 3.  ML Pipeline Walkthrough
Step-by-step interactive panels showing how raw data becomes predictions through collection, cleaning, feature selection, training, and testing.

**Goal:** Demystify the machine learning process with visual explanations.

### 4.  Bias & Fairness Checker
Interactive demonstration showing the effect of unbalanced datasets on prediction quality using relatable examples.

**Goal:** Introduce ethical considerations in AI and the importance of fair representation.

### 5.  Hands-On: Mini Classifier
Students "train" a simple classification model with preloaded examples (e.g., categorizing images, text sentiment) and test its predictions.

**Goal:** Apply learned concepts in a safe, interactive environment.

## 🛠️ Tech Stack

- **Frontend:** React 18+ with Vite
- **Visualization:** Chart.js / Plotly.js for interactive charts
- **Machine Learning:** TensorFlow.js for in-browser models (optional)
- **Styling:** Tailwind CSS for responsive design
- **Hosting:** Vercel / Netlify (recommended for easy deployment)
- **Testing:** Vitest + React Testing Library
- **Accessibility:** React Aria components where needed

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16.0 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-learning-hub.git
   ```

2. Navigate into the project directory:
   ```bash
   cd ai-learning-hub
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

###  Running the App

1. Open your browser and go to `http://localhost:5173` (or the port Vite specifies)
2. Navigate through the modules from the home screen
3. No account or login is required
4. All data processing happens locally in your browser

## 📁 Project Structure

```
ai-learning-hub/
├── public/
│   ├── datasets/          # Preloaded educational datasets
│   ├── images/           # Educational images and icons
│   └── index.html
├── src/
│   ├── components/       # Reusable React components
│   ├── modules/          # Individual learning modules
│   ├── utils/           # Helper functions and data processing
│   ├── styles/          # Global CSS and Tailwind config
│   └── App.jsx          # Main application component
├── tests/               # Unit and integration tests
└── package.json
```

##  Safety & Privacy

- ✅ **No user-uploaded images or files** - all content is preloaded
- ✅ **No personal data collection** - completely anonymous usage
- ✅ **No third-party analytics or tracking**
- ✅ **Fully AODA/WCAG 2.1 AA accessible design**
- ✅ **All processing happens locally** - no data sent to external servers
- ✅ **School network friendly** - no blocked external dependencies

##  Testing

Run the test suite:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run test:coverage
```

##  Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

### Manual Deployment
```bash
npm run build
# Deploy the contents of the 'dist' folder to your hosting provider
```

##  Contributing

We welcome contributions from educators, developers, and students! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Educational Alignment

This platform aligns with:
- **Ontario Digital Literacy Curriculum** (Grades 6-8)
- **Computer Science Education Week** activities
- **AI4ALL** educational principles
- **UNESCO AI Ethics Guidelines** for educational content

##  Credits & Acknowledgments

- Inspired by open educational tools like [Machine Learning for Kids](https://machinelearningforkids.co.uk/), [Quick, Draw!](https://quickdraw.withgoogle.com/), and [Google Teachable Machine](https://teachablemachine.withgoogle.com/)
- All datasets are sourced from open educational resources and are locally hosted for student privacy
- Icons provided by [Lucide React](https://lucide.dev/)
- Educational content reviewed by certified Ontario educators

##  Roadmap

- [ ] **v1.1**: Additional datasets for different subject areas
- [ ] **v1.2**: French language support for Ontario bilingual schools
- [ ] **v1.3**: Teacher dashboard with progress tracking
- [ ] **v2.0**: Advanced modules for high school students
- [ ] **v2.1**: Integration with Google Classroom

---

**Made for Ontario students and educators**
