# 🚀 Loyalty Rewards Assignment

<div align="center">

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
<img src="https://img.shields.io/badge/-NestJs-ea2845?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJs" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/Tests-Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
<img src="https://img.shields.io/badge/Language-TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />

> A professional demo: NestJS API + React (Vite) dashboard implementing tiered earning, FIFO redemption, expiration, and batch posting.

</div>

---

## Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Live Demos](#live-demos)
- [Features](#features)
- [Data Model](#data-model)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [API Examples](#api-examples)
- [Testing](#testing)

---

## About

A demonstration loyalty-rewards system implementing realistic business rules:

- Tier multipliers (BRONZE → PLATINUM)
- FIFO redemption (oldest valid points redeemed first)
- Points expiration and safe balance handling
- Batch posting and full transaction history
- Focused unit/integration tests for core logic

---

## Tech Stack

- **Backend:** NestJS, TypeScript, Mongoose (MongoDB), Jest
- **Frontend:** React, Vite, Tailwind CSS, React Router, Context API
- **Deployment:** Backend on Render, Frontend on Vercel

---

## Live Demos

- Frontend: https://loyalty-rewards-assignment.vercel.app
- Backend API: https://loyalty-rewards-assignment.onrender.com/loyalty

> ⚠️ **Note:** Backend is hosted on the free Render tier. The first request may take 1-2 minutes as the service spins up from inactivity.

---

## Postman Collection

A Postman collection and environment are included to test the API easily.

```
📦 src/
├── 🧠 backend/
│ ├── ⚙️ postman/
│ │ ├── 🌐 Loyalty-Rewards-API.postman_collection.json
│ │ └── 🌐 Loyalty-Rewards-Env.postman_environment.json
```

**Files:**

- `Loyalty-Rewards-API.postman_collection.json`
- `Loyalty-Rewards-Env.postman_environment.json`

**Usage:**

1. Import both files into Postman
2. Select the provided environment
3. Run the requests in order (Create Account → Earn → Batch Post → Redeem → Get Transactions) **OR** If not in order you can use the customer id 123 for any request.

---

## Features

- ✅ Create accounts
- ✅ Earn points (NTM & Promotional) with multipliers
- ✅ FIFO redemption
- ✅ Points expiration & safe bookkeeping
- ✅ Batch posting of pending transactions
- ✅ Transaction history and account reporting
- ✅ Tests covering business rules

---

## Data Model (Overview)

- **LoyaltyAccount**
  - `customerId`, `accountNumber`, `tier`, `currentBalance`
  - `tierQualifyingPoints`, `totalPointsEarned`, `pointsRedeemed`
- **LoyaltyTransaction**
  - `type` (EARN / REDEEM), `category` (NTM / PROMOTIONAL)
  - `points`, `expirationDate`, `expired`, `posted`
- **LoyaltyTier**
  - `tierName` (BRONZE / SILVER / GOLD / PLATINUM), `minPoints`, `earnMultiplier`

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm (or yarn)
- MongoDB connection (local or cloud)

### Clone

```bash
git clone <repo-url>
cd loyalty-rewards-assignment
```

### Backend

```bash
cd backend
npm install
npm run start:dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Examples

### Create Account

```bash
POST /loyalty/accounts
Content-Type: application/json

{
  "customerId": 123
}
```

### Get Account

```bash
GET /loyalty/accounts/123
```

### Earn Points (NTM)

```bash
POST /loyalty/transactions/earn
Content-Type: application/json

{
  "customerId": 123,
  "category": "NTM",
  "rentalDuration": 5,
  "milesDriven": 100,
  "description": "Rental completed"
}
```

### Redeem Points

```bash
POST /loyalty/transactions/redeem
Content-Type: application/json

{
  "customerId": 123,
  "points": 250,
  "description": "Reward redemption"
}
```

## Testing

Tests cover: earn/redeem logic, FIFO redemption, insufficent balance handling, tier upgrades, and expiration behavior.

```bash
cd backend
npm run test
```
