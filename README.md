# Student Management

This repository contains an Angular frontend and two interchangeable backends: a JSON Server mock and a Spring Boot API using H2.

## Run with the JSON Server mock

Make sure `frontend/src/app/core/services/api.service.ts` uses jsonUrl `http://localhost:3000` as its API base URL.

In one terminal:

```bash
cd frontend
npm install
npm start
```

In a second terminal:

```bash
cd frontend
npm run api
```

Open `http://localhost:4200`. The mock API loads data from `frontend/db.json` and serves `/students` and `/courses` on port `3000`.

## Run with the Java backend

Change the API base URL in `frontend/src/app/core/services/api.service.ts` to javaUrl `http://localhost:8080`.

Install Java 21+ and Maven 3.6.3+ if they are not already installed. On macOS with Homebrew, install Maven with:

```bash
brew install maven
```

In one terminal:

```bash
cd backend
mvn spring-boot:run
```

In a second terminal:

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`. The Java API serves `/students` and `/courses` and stores data in a file-backed H2 database. Java 21+ and Maven 3.6.3+ are required.

The H2 console is available at `http://localhost:8080/h2-console` while the backend is running. Use JDBC URL `jdbc:h2:file:./data/student-management`, username `sa`, and a blank password. The database files are created under `backend/data/` when you start Spring Boot from `backend/`.

## Build the frontend

From `frontend/`:

```bash
npm run build
```

## Run the frontend tests

From `frontend/`:

```bash
npm test
```

The tests use Angular's Vitest runner with jsdom and run once without watch mode.
