# Finance Trecker

A full-stack personal finance tracker with a React frontend and Express/MongoDB backend.

## Features

- Add income and expense transactions
- Edit and delete transactions
- Filter transaction history by type
- Persistent storage in MongoDB
- Live balance, income, and expense totals

## Project structure

- `client/` — React + Vite frontend
- `server/` — Express backend with Mongoose

## Getting started

### 1. Server

1. Copy `server/.env.example` to `server/.env` and set your MongoDB connection string:

```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/mydb?retryWrites=true&w=majority
```

2. Install dependencies and start the server:

```bash
cd server
npm install
npm run dev
```

The server runs on `http://localhost:5000`.

### 2. Client

1. Install dependencies:

```bash
cd client
npm install
```

2. Start the development server:

```bash
npm run dev
```

The client runs on `http://localhost:5173` by default.

### 3. Electron desktop mode

From the repository root, install all dependencies once and then start the desktop app:

```bash
cd ..\Finance-trecker
npm install
npm start
```

This will:
- install root + client + server dependencies
- build the React client into `client/dist/`
- launch the Electron desktop app
- start the backend server automatically on port `5000`

If `server/.env` is missing or `MONGO_URL` is not configured, the app will still run using in-memory storage.

### 4. Desktop development mode

For faster development without rebuilding the production bundle, run from the repository root:

```bash
cd ..\Finance-trecker
npm run dev
```

This command will:
- start the Express backend dev server in `server/`
- start the Vite dev server in `client/`
- wait for the client to be ready and launch Electron pointing at `http://localhost:5173`

> Use this mode when you want live React updates and a desktop preview at the same time.

## API routes

- `GET /transactions`
- `POST /transactions`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`

## Notes

- The frontend uses `VITE_API_URL` if provided, otherwise it defaults to `http://localhost:5000`.
- Make sure your backend is running before using the frontend.
