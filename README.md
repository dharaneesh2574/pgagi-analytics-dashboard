# PGAGI Dashboard

A modern, responsive dashboard application that integrates weather information, news updates, and financial data in a unified interface.

## Project Overview

PGAGI Dashboard is a Next.js-based web application that provides real-time access to:
- Weather information with 7-day forecasts
- Latest news from various categories
- Real-time stock market data and charts

The application features a dark theme UI with responsive design and interactive components.

## Technologies Used

- **Frontend Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **State Management**: React Hooks
- **API Integration**:
  - OpenWeather API
  - NewsAPI
  - Alpha Vantage API

## Installation Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/dharaneesh2574/pgagi-analytics-dashboard.git
   cd pgagi-analytics-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key
   NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alphavantage_api_key
   ```

## How to Run the Project

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Testing Instructions

Currently, the project uses manual testing. To test the application:

1. Start the development server
2. Test each dashboard component:
   - Weather dashboard with city search
   - News dashboard with category filtering
   - Finance dashboard with stock search and charts

## Deployment Details

The application is deployed using Vercel with GitHub Actions for CI/CD:

- **Production**: Deploys automatically on pushes to the main branch
- **Preview**: Deploys automatically on pushes to other branches

### Live Application
The dashboard is live at: [PGAGI Dashboard](https://pgagi-dashboard-9gsip2zuy-dharaneeshs-projects-becc7bb0.vercel.app)

### Important Notes
- The News API integration requires a paid subscription for CORS access. The free tier only works with server-side requests, which is not implemented in this version.
- Weather and Finance features are fully functional with their respective free API tiers.

### Deployment Environment Variables

The following secrets need to be configured in GitHub:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_OPENWEATHER_API_KEY`
- `NEXT_PUBLIC_NEWS_API_KEY`
- `NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | API key for OpenWeather service | Yes |
| `NEXT_PUBLIC_NEWS_API_KEY` | API key for NewsAPI service | Yes |
| `NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY` | API key for Alpha Vantage service | Yes |

## API Setup

### OpenWeather API
1. Visit [OpenWeather](https://openweathermap.org/)
2. Sign up for a free account
3. Generate an API key
4. Add the key to your `.env.local` file

### NewsAPI
1. Visit [NewsAPI](https://newsapi.org/)
2. Register for an API key
3. Add the key to your `.env.local` file

### Alpha Vantage API
1. Visit [Alpha Vantage](https://www.alphavantage.co/)
2. Get a free API key
3. Add the key to your `.env.local` file

## Project Structure

```
pgagi-dashboard/
├── app/
│   ├── (routes)/           # Route components
│   ├── components/         # Reusable components
│   ├── services/          # API service functions
│   ├── types/            # TypeScript type definitions
│   └── layout.tsx        # Root layout component
├── public/               # Static assets
└── .github/
    └── workflows/        # GitHub Actions workflows
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
