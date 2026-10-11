# Practical 9: In-Memory Caching and Query Optimization

**Student Name:** Ghoniya Dhyey  
**Student ID:** 24CS024  
**Subject:** ITUE301 - AWDF (Advanced Web Development Frameworks)  
**Academic Year:** 2025-26  
**Institution:** Charotar University of Science and Technology (CHARUSAT), CSPIT  

---

## 🎯 Aim
To implement server-side caching using `node-cache` and measure its impact on API response time, ensuring cache invalidation on write operations (`POST`, `PUT`, `DELETE`).

## 🛠️ Tech Stack
- **Runtime:** Node.js + Express.js
- **In-Memory Cache:** `node-cache` (60s TTL)
- **Benchmarking:** Automated Latency Profiler

## 📂 Project Structure
```
Practical_9/
├── src/
│   ├── cache/
│   │   └── cacheService.js     # In-memory cache singleton & stats
│   ├── controllers/
│   │   └── taskController.js   # Cache hit/miss & invalidation logic
│   ├── routes/
│   │   └── taskRoutes.js       # Endpoints: GET, POST, DELETE, Stats
│   └── app.js                  # Express middleware setup
├── server.js                   # Server launcher (Port 5002)
├── benchmark.js                # Empirical latency measurement script
├── package.json
└── README.md
```

## 📊 Measured Response Times
| Request Type | Run 1 | Run 2 | Run 3 | Average Latency |
| :--- | :--- | :--- | :--- | :--- |
| **Uncached DB Query** | 102 ms | 98 ms | 104 ms | **101.3 ms** |
| **In-Memory Cached (HIT)** | 2 ms | 1 ms | 2 ms | **1.7 ms** |
| **Performance Boost** | **~59.5x Faster** | | | |

## 🚀 Getting Started
```bash
npm install
npm start
node benchmark.js
```
