# Spotify Stats

A React application that visualizes your Spotify listening statistics, built with Vite and TypeScript.

## Features

- View your top artists and tracks
- See detailed audio features of your favorite songs
- Secure authentication with Spotify

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: You will need Node.js installed on your machine. [Download Node.js](https://nodejs.org/)
- **Spotify Developer Account**: You need a Spotify account to access the Developer Dashboard.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/wbeatty/spotifyStats.git
cd spotifyStats
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Spotify API

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Log in and create a new app.
3. Note your **Client ID**.
4. Click "Edit Settings" and add `http://127.0.0.1:5173/callback` to the **Redirect URIs**.
5. Save your changes.

### 4. Update Configuration

Open `src/config.ts` and replace the `clientId` with your own from the Spotify Dashboard:

```typescript
// src/config.ts
export const clientId = "YOUR_CLIENT_ID_HERE";
export const redirectUri = "http://127.0.0.1:5173/callback";
// ...
```

### 5. Run the Application

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://127.0.0.1:5173`.

## Building for Production

To build the app for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Technologies Used

- React
- TypeScript
- Vite
- Lucide React (Icons)

