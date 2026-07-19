<<<<<<< HEAD
# AgriVision AI - Smart Crop Care & Disease Detection System

AgriVision AI is an end-to-end, premium agricultural intelligence platform designed to help farmers instantly detect crop diseases, analyze atmospheric risk levels, toggle languages (English, Hindi, Marathi), locate local agri stores with stock checklists, and download PDF diagnostic reports.

---

## System Architecture

The application is structured as a modern multi-service system:
1. **Client (React + Vite)**: A premium glassmorphic user interface built with Tailwind CSS, Lucide React, and Recharts. Includes responsive dashboards, drag-and-drop / webcam uploads, Leaflet interactive mapping, and a floating AI chatbot.
2. **Server (Node.js + Express + MongoDB)**: A robust REST API managing authentication, prediction history proxying, weather analytics, and role authorization.
3. **AI Service (FastAPI + TensorFlow)**: A high-performance Python microservice that loads a MobileNetV2 CNN model (`crop_model.keras`) trained on the PlantVillage dataset. Falls back to a smart mock prediction engine if TensorFlow is not configured.

---

## Quick Start Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port `27017` or a cloud URI)
- Python (3.9 - 3.11 recommended for TensorFlow compatibility)

---

### Step 1: Start the AI Service (Python FastAPI)

1. Navigate to the `ai-service` directory:
   ```bash
   cd ai-service
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server using Uvicorn:
   ```bash
   python -m uvicorn main:app --port 8000 --host 127.0.0.1
   ```
   *The AI service will be running at `http://127.0.0.1:8000`.*

---

### Step 2: Start the Backend Server (Node.js & Express)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file (already completed in development):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cropcare
   JWT_SECRET=your_jwt_secret_key
   AI_SERVICE_URL=http://127.0.0.1:8000
   OPENWEATHER_API_KEY=your_key_here
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *The Express server will run on `http://localhost:5000`.*

---

### Step 3: Start the Client Application (React + Vite)

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *The client interface will run on `http://localhost:5173`.*

---

## Features Checklist

- **AI Leaf Diagnosis**: Drag-and-drop leaf photos or capture via webcam. Returns crop, disease type, confidence metrics, symptoms, and organic/chemical treatments.
- **Crop Weather Advisory**: Monitors weather stats and runs a localized risk engine calculating pathogen outbreak risks (Blights/Spots) based on temperature and humidity.
- **Agri Stores Map**: Interactive Leaflet maps identifying regional supply stores, contact info, and current stock for recommended treatments.
- **Multi-language Support**: Seamless toggle between **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.
- **Interactive FAQ Chatbot**: A premium assistant bubble answering common queries on treatments, crops, and app guide.
- **Admin Dashboard**: Visual analytics on crop share and disease prevalence powered by Recharts, restricted strictly to users with the `admin` role.


