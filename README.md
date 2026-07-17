# 🌿 EcoFindr — AI-Powered Eco-Friendly Shopping Assistant

> A Chrome Extension that helps shoppers make environmentally conscious purchasing decisions by analyzing product descriptions and assigning an EcoScore in real time.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?logo=googlechrome)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📖 Overview

EcoFindr is a browser extension that evaluates the sustainability of products while users browse e-commerce websites such as Amazon and Flipkart.

Instead of reading lengthy product descriptions, users instantly receive an **EcoScore (0–100)** along with a detailed explanation of why the product is environmentally friendly—or not.

The project demonstrates practical web scraping, browser extension development, DOM manipulation, rule-based AI scoring, and modern frontend development.

---

## ✨ Features

- 🌱 Real-time EcoScore calculation
- 🛒 Supports Amazon & Flipkart product pages
- 📊 Sustainability breakdown with positive and negative factors
- 🎨 Premium luxury-inspired interface
- ⚡ Floating EcoScore badge
- 📦 Chrome Extension (Manifest V3)
- 💾 Local storage support
- 📱 Responsive popup dashboard

---

## 🖼️ Screenshots

### Home / Popup

> *(Add screenshot here)*

```
assets/screenshots/popup.png
```

---

### Amazon Product Page

> *(Add screenshot here)*

```
assets/screenshots/amazon.png
```

---

### EcoScore Badge

> *(Add screenshot here)*

```
assets/screenshots/badge.png
```

---

## 🏗️ Architecture

```
                 User
                  │
                  ▼
      Amazon / Flipkart Page
                  │
        Content Script (JS)
                  │
        Extract Product Details
                  │
        Eco Scoring Engine
                  │
      Chrome Local Storage
                  │
                  ▼
         React Popup Dashboard
```

---

## ⚙️ Tech Stack

| Technology | Purpose |
|------------|----------|
| React | Frontend UI |
| Vite | Development & Build Tool |
| JavaScript | Core Logic |
| Chrome Extension API | Browser Integration |
| Manifest V3 | Extension Framework |
| HTML/CSS | Styling |
| Local Storage | Data Persistence |

---

## 🧠 EcoScore Logic

Each product starts with a base score.

Positive keywords increase the score:

- ♻️ Recycled
- 🌿 Organic
- 🧴 Refillable
- 🪵 Bamboo
- 🥛 Glass
- 📦 Recyclable Packaging

Negative keywords reduce the score:

- ❌ Plastic
- ⚠️ PVC
- 🗑️ Disposable
- 📱 Electronics
- 👕 Fast Fashion
- 🚚 High Carbon Shipping

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/EcoFindr.git
```

---

### Install Dependencies

```bash
npm install
```

---

### Start Development

```bash
npm run dev
```

---

### Build Extension

```bash
npm run build
```

---

### Load in Chrome

1. Open Chrome

```
chrome://extensions
```

2. Enable Developer Mode

3. Click **Load unpacked**

4. Select the **extension/** folder

---

## 📂 Project Structure

```
EcoFindr/
│
├── assets/
│   └── screenshots/
│
├── extension/
│
├── public/
│
├── src/
│
├── background.js
├── contentScript.js
├── manifest.json
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎯 Future Improvements

- 🤖 AI-powered sustainability analysis
- 🌍 Carbon footprint estimation
- 📈 Product comparison dashboard
- 🔍 Barcode scanning
- 📊 Eco shopping history
- ☁️ Cloud synchronization
- 📱 Firefox & Edge support

---

## 🎥 Demo

*(Add GIF here)*

```
assets/demo.gif
```

---

## 💡 Why I Built This

Consumers often struggle to identify environmentally responsible products while shopping online.

EcoFindr simplifies sustainable shopping by providing an instant sustainability score directly on product pages, helping users make informed purchasing decisions.

---

## 👨‍💻 Author

**M. Abhiram Reddy**

B.Tech – Artificial Intelligence & Data Science

- GitHub: https://github.com/yourusername
- LinkedIn: https://linkedin.com/in/yourprofile

---

## ⭐ If you found this project interesting

Please consider giving it a ⭐ on GitHub!
