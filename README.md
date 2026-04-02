# WorldWise

WorldWise is a React app for tracking places you have visited on an interactive map. It combines a protected app area, city and country views, reverse geocoding, and a small local JSON API for storing trip entries.

## Features

- Browse a map built with Leaflet and `react-leaflet`
- Click on the map to add a visited city
- Use browser geolocation to jump to your current position
- Reverse geocode coordinates into city and country data
- Save trip dates and personal notes for each city
- View saved cities and visited countries
- Access the main app through a protected route with demo authentication

## Tech Stack

- React 18
- Vite
- React Router
- Leaflet + React Leaflet
- `react-datepicker`
- `json-server`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the local API

The app expects a JSON API at `http://localhost:8000`.

```bash
npm run server
```

This serves data from [data/cities.json](/Users/sherysmac/Desktop/Udemy/ReactJS/worldwise/data/cities.json).

### 3. Start the frontend

In a second terminal:

```bash
npm run dev
```

Vite will start the app locally, typically at `http://localhost:5173`.

## Demo Login

The protected `/app` route uses a fake auth context with the following credentials:

- Email: `jack@example.com`
- Password: `qwerty`

The login form is already prefilled with these values in development.

## Available Scripts

- `npm run dev`: Start the Vite development server
- `npm run build`: Create a production build
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint
- `npm run server`: Start `json-server` on port `8000`

## Project Structure

```text
src/
  components/   Reusable UI, map, lists, forms, and layout pieces
  contexts/     City data state and fake authentication state
  hooks/        Custom hooks for geolocation and URL coordinates
  pages/        Route-level screens
data/
  cities.json   Local API data source for json-server
```

## Notes

- The map uses OpenStreetMap tiles.
- The city form uses the BigDataCloud reverse geocoding API to derive city and country details from clicked coordinates.
- Creating or deleting cities updates the local `json-server` data source while the server is running.
