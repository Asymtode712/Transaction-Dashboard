# Transaction Dashboard

Transaction dashboard is a assignment project made using the MERN stack (MongoDB, Express, React, Node.js) to manage and display product transaction data.

## Installation

1. **Clone the repository:**
   
   ```bash
   git clone https://github.com/Asymtode712/Transaction-Dashboard.git
   ```
2. **Switch to project directory:**
   
   ```bash
   cd Transaction-Dashboard
   ```
3. **Install the dependencies:**

   ```bash
   npm i
   ```

## Run

**For Backend:**

   ```bash
   cd backend
   ```

   ```bash
   node server.js
   ```
   

## API Endpoints:

- GET /api/initdb: Initialize the database with transaction data from a remote JSON file.
- GET /api/transactions: Retrieve a paginated list of transactions.
- GET /api/stats: Get statistics for a given month.
- GET /api/barchart: Get bar chart data for a given month.
- GET /api/piechart: Get pie chart data for a given month.
- GET /api/combined-data: Get combined data (statistics, bar chart, pie chart) for a given month.

