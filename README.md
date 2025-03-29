# Codesign Backend

This repo contains a Node.js and Express backend for a B2B SaaS dashboard. The API provides insights into team productivity based on logged activities.

## Project Structure

codesign/
├── data/
│ └── companies.js # Sample data
├── routes/
│ ├── activityRoutes.js # Endpoint for adding activities
│ └── reportRoutes.js # Endpoints for reports
├── index.js # Express server setup
└── README.md # This file

## Setup Instructions

 **Clone the Repository:**

   git clone https://github.com/yourusername/codesign-backend.git
   cd codesign-backend
   npm install  (Install Dependencies)
   node index.js    (Start the Server)

## API Endpoints
GET /report/overview (Returns a summary report across all companies)
GET /report/company/:companyId (Returns analytics grouped by team for a specific company)
GET /report/member/:memberId (Returns a daily activity log for a member)
POST /activity  (Allows adding a new activity for a member)






