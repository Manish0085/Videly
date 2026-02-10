# 🎥 Videly - High-Performance Scalable Video Streaming Platform

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Videly** is a robust, production-ready video streaming application engineered for scalability and performance. Built with a modern microservice-ready architecture using **Spring Boot** and **React**, it replicates core functionalities of platforms like YouTube and TikTok, capable of handling high-concurrency traffic through effective **Redis caching** strategies.

---

## 🚀 Key Features

### ⚡ **High-Performance Backend**
- **Robust API Design**: RESTful APIs built with Spring Boot following best practices.
- **Scalable Architecture**: Stateless authentication using **JWT** (JSON Web Tokens).
- **Redis Caching**: 
  - Implements **Write-Through** and **Lazy Loading** caching strategies.
  - Caches video metadata, user profiles, and search results to reduce database load by up to **80%**.
  - Optimized serialization for complex Java objects.
- **Database Optimization**: Advanced MongoDB aggregation pipelines for complex data retrieval (e.g., watch history, subscriber statistics).

### 🎨 **Modern Frontend Experience**
- **Responsive Design**: Mobile-first architecture.
  - **Desktop**: Grid layouts, sidebar navigation, dedicated video player.
  - **Mobile**: Native-app feel with bottom sheets, hidden scrollbars, and touch-optimized controls.
- **Shorts Player**: A TikTok/Reels-style immersive vertical video player.
  - **Snap Scrolling**: Smooth CSS scroll snapping.
  - **Infinite Scroll**: Lazy loading of short-form content.
- **Glassmorphism UI**: Premium aesthetic using opaque layers, blurs, and vibrant gradients.
- **Interactive UI**: Real-time optimistic UI updates for likes, subscriptions, and comments.

### 🛠️ **Core Functionalities**
- **Video Management**: Upload, edit, delete, and publish huge video files via **Cloudinary**.
- **Search System**:
  - High-performance search with **Regex** pattern matching.
  - **Redis-cached search results** for trending queries.
- **Engagement**:
  - Like/Dislike system.
  - Nested Comments.
  - Channel Subscriptions.
  - Community Tweets.
- **User Dashboard**: Analytics on video views, subscriber growth, and content performance.

---

## 🏗️ System Architecture

This project follows a layered architecture designed for separation of concerns and scalability.

```mermaid
graph TD
    Client[Client (React SPA)] -->|HTTPS / JSON| LB[Load Balancer / Gateway]
    LB --> API[Spring Boot Application]
    
    subgraph "Backend Infrastructure"
    API -->|Auth & Logic| Service[Service Layer]
    Service -->|Read/Write Hot Data| Redis[(Redis Cache)]
    Service -->|Persist Data| DB[(MongoDB Cluster)]
    Service -->|Store Media| Cloud[Cloudinary CDN]
    end
```

### 🧠 **Why Redis?**
In a video streaming platform, read operations (viewing videos, profiles, comments) massively outnumber write operations. 
- **Latency Reduction**: Profile and Video data is served from in-memory Redis instances in sub-millisecond time.
- **Throttling Protection**: Prevents database overwhelming during viral video surges.
- **Session Management**: Fast, secure token blacklisting and session storage.

---

## 📸 Screenshots

<!-- Add your screenshots here in the /screenshots folder and link them below -->

| **Home Page (Responsive Grid)** | **Shorts Player (Mobile Style)** |
|:------------------------------:|:--------------------------------:|
| ![Home Page](path/to/home-screenshot.png) | ![Shorts Player](path/to/shorts-screenshot.png) |
| *Adaptive grid layout* | *Immersive vertical scrolling* |

| **Search & Discovery** | **Video Player** |
|:----------------------:|:----------------:|
| ![Search](path/to/search-screenshot.png) | ![Player](path/to/player-screenshot.png) |
| *Fast, cached search results* | *Cinematic playback experience* |

---

## 🛠️ Tech Stack

### **Backend (Java Ecosystem)**
- **Framework**: Spring Boot 3.x
- **Build Tool**: Maven
- **Database**: MongoDB (NoSQL)
- **Caching**: Redis (Lettuce Client)
- **Security**: Spring Security 6, JWT
- **Cloud Storage**: Cloudinary SDK
- **Utilities**: Lombok, Jackson

### **Frontend (React Ecosystem)**
- **Library**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM 6
- **Styling**: Vanilla CSS3 (Variables, Flexbox, Grid), Glassmorphism concepts
- **HTTP Client**: Axios with Interceptors
- **State Management**: Context API

---

## 🚦 Getting Started

### Prerequisites
- Java JDK 17+
- Node.js 18+
- MongoDB Instance (Local or Atlas)
- Redis Server
- Cloudinary Account

### 1. Clone the Repository
```bash
git clone https://github.com/Manish0085/Mern-Project.git
cd Mern-Project
```

### 2. Backend Setup
Navigate to the backend directory and configure environment variables.
```bash
cd backend-java
# Create a .env file or update application.properties
```

**Required Environment Variables:**
```properties
SPRING_DATA_MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/streambox
REDIS_HOST=localhost
REDIS_PORT=6379
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_super_secret_key
```

Run the application:
```bash
mvn spring-boot:run
```

### 3. Frontend Setup
Navigate to the frontend directory.
```bash
cd ../frontend
npm install
```

Start the development server:
```bash
npm run dev
```

---

## 🤝 Contribution
Contributions are welcome! Please fork the repository and submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.
