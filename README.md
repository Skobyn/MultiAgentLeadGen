# MultiAgentLeadGen

A web-based multi-source lead generation and email campaign management platform with AI-powered features.

## Overview

This platform provides comprehensive lead generation, enrichment from diverse sources, and email campaign management with tracking and automation capabilities. Users interact through an intuitive UI and AI-powered chatbot.

## Core Features

- Lead aggregation from multiple data sources (Apollo, LinkedIn, Crunchbase, ZoomInfo, etc.)
- Lead enrichment via email verification, LinkedIn data scraping, and AI-driven personalization
- AI chatbot for natural language interactions to refine searches and manage workflows
- Personalized email campaign creation, sending, and tracking with automation

## Tech Stack

- **Frontend:** React with TypeScript, Tailwind CSS
- **Backend:** Node.js microservices
- **Database:** MongoDB
- **Cloud Infrastructure:** AWS
- **Email Providers:** SendGrid
- **AI Integrations:** OpenAI API

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB
- API keys for selected services

### Installation

1. Clone the repository
```bash
git clone https://github.com/Skobyn/MultiAgentLeadGen.git
cd MultiAgentLeadGen
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables
```bash
# Create .env files in both frontend and backend directories
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

4. Start the development servers
```bash
# Start the frontend
cd frontend
npm start

# Start the backend
cd ../backend
npm run dev
```

## Project Structure

```
MultiAgentLeadGen/
├── frontend/                # React application
│   ├── public/              # Static files
│   └── src/                 # Source files
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       ├── services/        # API service integrations
│       ├── context/         # React context providers
│       └── hooks/           # Custom React hooks
├── backend/                 # Node.js backend
│   ├── src/                 # Source files
│   │   ├── api/             # API routes
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   └── microservices/       # Individual microservices
│       ├── email-service/   # Email sending and tracking
│       ├── lead-service/    # Lead generation and enrichment
│       ├── ai-service/      # AI and NLP functionality
│       └── auth-service/    # Authentication and authorization
└── docs/                    # Documentation files
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.