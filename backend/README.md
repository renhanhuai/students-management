# Student Management API

Spring Boot REST backend for the Angular demo. It uses a file-backed H2 database and keeps the JSON contract compatible with the Angular `Student` and `Course` models.

## Requirements

- Java 21 or newer
- Maven 3.6.3 or newer

## Run

From this directory:

```bash
mvn spring-boot:run
```

The API listens on `http://localhost:8080`. H2 Console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/student-management`, user `sa`, blank password).

Java packages are organized into `model`, `repository`, and `controller` layers. Request/response DTOs live with the models for this small demo.

Endpoints: CRUD at `/students` and `/courses`. Student JSON includes `courseIds`, matching the Angular model. The backend creates IDs.

The Angular dev server runs on port 4200; configure its API base URL to `http://localhost:8080` and enable CORS or use an Angular proxy when connecting the frontend.
