# Portfolio Manager - AI-Powered Investment Tracking

This project is a comprehensive **Portfolio Manager** designed to help users track and manage their investments in financial securities like stocks and bonds. Built with modern technologies, it focuses on scalability, flexibility, and AI-powered insights.

## Key Features
- **Investment Tracking**: Manage securities with detailed classifications for stocks (e.g., regular, preferred) and bonds (e.g., government, corporate).
- **Risk Analysis**: Calculate weighted portfolio risk using advanced algorithms based on sector and volatility.
- **AI Integration**: Leverage local AI (via Ollama) for portfolio analysis and recommendations.
- **Dynamic Visualizations**: Represent portfolio composition with tables and interactive graphs.
- **CRUD Operations**: Seamlessly perform Create, Read, Update, and Delete operations using MongoDB and Mongoose.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **AI Integration**: Ollama (Local AI)
- **Frontend (Optional)**: Chart.js, React (planned for future iterations)

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory and add:
     ```
     MONGO_URI=mongodb://localhost:27017/portfolioDB
     ```

4. Start the server:
   ```bash
   npm start
   ```

## Usage
- Use the API to manage securities, calculate portfolio risk, and get AI-powered recommendations.
- Future iterations will include a user-friendly frontend for visualizations.

## Why This Project?
This Portfolio Manager showcases expertise in building scalable, data-driven systems with modern tools and practices, integrating AI to enhance financial applications.
