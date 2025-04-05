# AgroTech Platform

A revolutionary platform connecting Indian farmers with markets, technology, and government schemes to increase agricultural productivity and income.

## Features

- **Farmer Dashboard**: Track crops, access market prices, and get personalized recommendations
- **Government Schemes**: Access and apply for relevant agricultural support programs
- **Crop Health Monitoring**: AI-powered disease detection and treatment recommendations
- **Market Connect**: Direct connection to buyers with fair price negotiations
- **Weather Integration**: Localized weather forecasts and alerts

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy
- **Authentication**: JWT-based authentication
- **Database**: SQLite (development), PostgreSQL (production)
- **External APIs**:
  - OpenWeather API for weather forecasts
  - data.gov.in API for market prices
  - KindWise API for crop disease detection
  - Custom API for additional crop disease services (optional)

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Git
- API keys for external services (see Environment Setup)

### Environment Setup

1. **API Keys**: You'll need the following API keys:
   - OpenWeather API key for weather forecasts
   - data.gov.in API key for market prices
   - KindWise API key for crop disease detection
   - (Optional) Additional third-party API key for crop disease detection

2. Set up environment variables by copying the template files:
   ```bash
   cp backend/.env.template backend/.env
   cp frontend/.env.template frontend/.env.local
   ```
   
3. Edit the environment files with your API keys and configuration values.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agrotech.git
cd agrotech
```

2. Set up the backend:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

3. Set up the frontend:
```bash
cd frontend
npm install
npm run dev
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Quick deployment with Docker:
```bash
# Make sure Docker and Docker Compose are installed
cp backend/.env.template backend/.env  # Edit with production values
cp frontend/.env.template frontend/.env.local  # Edit with production values
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [OpenWeather API](https://openweathermap.org/api)
- [data.gov.in API](https://data.gov.in/) 