# 🔱 Tirumala Smart Pilgrimage & Temple Management

An **AI-powered pilgrim footfall forecasting and decision-support system** designed to predict visitor demand at **Tirumala Tirupati** using statistical time-series models, machine learning, and deep learning.

The project focuses primarily on building an end-to-end **time-series forecasting pipeline** and integrates the final forecasting model with a full-stack web application for visualization and operational planning.

---

## 🎯 Project Objective

Pilgrim footfall at Tirumala varies significantly due to **seasonality, weekends, festivals, holidays, and historical crowd patterns**.

The objective is to forecast future pilgrim footfall and use these predictions to support:

* Crowd and queue management
* Laddu and Annaprasadam planning
* Security and workforce allocation
* Transportation planning
* Hotel occupancy forecasting
* Infrastructure and resource planning

---

## 🧠 Machine Learning Pipeline

The project follows a complete forecasting workflow:

```text
Data Collection
      ↓
Data Cleaning & Preprocessing
      ↓
Exploratory Time-Series Analysis
      ↓
Feature Engineering & Selection
      ↓
Temporal Train / Validation / Test Split
      ↓
Model Training
      ↓
Model Evaluation & Comparison
      ↓
Best Model Selection
      ↓
Forecast Generation
      ↓
Dashboard & Decision Support
```

### 1. Data Collection & Preprocessing

Historical pilgrim footfall data is collected and processed before model training.

Preprocessing includes:

* Missing-value handling
* Duplicate removal
* Outlier analysis
* Timestamp validation
* Chronological ordering
* Data-type transformation
* Scaling/normalization where required

Unlike standard regression problems, the dataset is **not randomly shuffled**, preserving temporal relationships and preventing future-data leakage.

---

### 2. Time-Series Analysis

Exploratory analysis is performed to identify:

* Trend
* Seasonality
* Autocorrelation
* Periodic patterns
* Weekend effects
* Festival/holiday spikes
* Abnormal crowd behavior

Statistical techniques such as **ACF, PACF, rolling statistics, and stationarity testing** can be used to understand temporal dependencies and determine appropriate forecasting configurations.

---

### 3. Feature Engineering

Temporal and historical features are generated to improve predictive performance.

```text
Calendar Features
├── Day of Week
├── Month
├── Weekend
├── Holiday
└── Festival

Lag Features
├── Lag 1
├── Lag 7
├── Lag 14
└── Lag 30

Rolling Features
├── 7-Day Mean
├── 14-Day Mean
├── 30-Day Mean
└── Rolling Standard Deviation
```

External variables can additionally be incorporated as **exogenous features** when available.

---

## 🤖 Forecasting Models

Multiple forecasting approaches are trained and benchmarked instead of assuming a single model will perform best.

### Statistical Models

```text
AR
MA
ARMA
ARIMA
SARIMA
ARIMAX
SARIMAX
```

**SARIMA** captures seasonal temporal patterns, while **ARIMAX/SARIMAX** can incorporate external variables such as holidays, festivals, weather, or special events.

### Machine Learning

```text
XGBoost
CatBoost
```

Gradient-boosting models use engineered lag, rolling, calendar, and external features to learn nonlinear relationships in pilgrim demand.

### Deep Learning

```text
RNN
LSTM
```

Sequential neural networks are evaluated for their ability to capture longer-term dependencies within historical footfall sequences.

---

## 📊 Model Evaluation

Models are evaluated on chronologically separated data using forecasting metrics such as:

* **MAE** — Mean Absolute Error
* **RMSE** — Root Mean Squared Error
* **MAPE** — Mean Absolute Percentage Error
* **R²** — supplementary regression metric

A temporal split is used:

```text
Past                                      Future
──────────────────────────────────────────────►

TRAIN                  VALIDATION        TEST
████████████████████   ██████████        ███████
```

Walk-forward validation can additionally be used to evaluate model stability across different forecasting periods.

The final model is selected based on **forecast accuracy, generalization, stability, interpretability, and computational requirements** rather than model complexity alone.

---

## ⚙️ System Architecture

```text
Historical Data
      ↓
Preprocessing & Feature Engineering
      ↓
Forecasting Models
      ↓
Model Evaluation
      ↓
Best Model
      ↓
Forecast Generation
      ↓
Backend API
      ↓
React Dashboard
      ↓
Operational Insights
```

The forecasting output is transformed into decision-support information for resource planning and crowd management.

---

## 🌐 Full-Stack Application

The ML system is integrated with a web platform to present forecasting results to different stakeholders.

### Frontend

Built using:

```text
React + Vite + Tailwind CSS
```

Provides dashboards for:

* Temple Administration
* Pilgrims
* Government
* Hotel Partners
* Travel Agencies

The dashboards visualize forecasts, crowd levels, resource requirements, transportation demand, and operational alerts.

### Backend

Built using:

```text
Node.js + Express.js + REST APIs
```

The backend connects application services with forecasting outputs and provides data to the frontend dashboards.

---

## 🛠️ Technology Stack

| Layer                       | Technologies                    |
| --------------------------- | ------------------------------- |
| **Data Processing**         | Python, Pandas, NumPy           |
| **Statistical Forecasting** | Statsmodels                     |
| **Machine Learning**        | Scikit-learn, XGBoost, CatBoost |
| **Deep Learning**           | TensorFlow / Keras              |
| **Visualization**           | Matplotlib                      |
| **Frontend**                | React, Vite, Tailwind CSS       |
| **Backend**                 | Node.js, Express.js             |
| **API**                     | REST                            |

---

## 📂 Project Structure

```text
├── ml/
│   ├── data/
│   ├── notebooks/
│   ├── preprocessing/
│   ├── features/
│   ├── models/
│   ├── evaluation/
│   └── forecasting/
│
├── backend/
│   ├── src/
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Install Dependencies

```bash
npm run install-all
```

### Start Application

```bash
npm run dev
```

The development servers run at:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

Individual services can also be started using:

```bash
npm run frontend
npm run backend
```

---

## 🔑 Dashboard Access

| Role          | Route              |
| ------------- | ------------------ |
| Temple Admin  | `/temple_overview` |
| Pilgrim       | `/pilgrim`         |
| Government    | `/government`      |
| Hotel Partner | `/hotel`           |
| Travel Agency | `/travel`          |

---

## 🔮 Future Scope

The system can be extended with:

* Real-time pilgrim data ingestion
* Weather and transportation data integration
* Automated model retraining
* Model and data-drift monitoring
* Ensemble forecasting
* Prediction intervals and uncertainty estimation
* Explainable AI using SHAP
* Geospatial crowd forecasting
* Dynamic resource optimization

---

## 📌 Disclaimer

This project is developed for **academic, research, and demonstration purposes** and is not an official TTD system.

Some operational values, alerts, CCTV feeds, and dashboard information may be simulated for demonstrating how forecasting results can support real-world temple operations.
