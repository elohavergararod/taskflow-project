# Backend API — Tools & Ecosystem

A reference guide to the core tools used in professional backend and API development.

---

## Axios

Axios is a promise-based HTTP client for both Node.js and the browser. While the native `fetch` API works for basic requests, Axios is preferred in production environments for several reasons.

It automatically transforms request and response data to and from JSON, meaning you no longer need to manually call `res.json()`. It also provides built-in support for request and response interceptors, which allow you to attach authentication tokens, log requests, or handle errors globally without repeating logic across every call.

```js
// fetch — manual JSON handling
const res = await fetch('/api/v1/tasks');
const data = await res.json();

// axios — automatic JSON parsing
const { data } = await axios.get('/api/v1/tasks');
```

Axios also handles HTTP error status codes (4xx, 5xx) by throwing automatically, whereas `fetch` only throws on network failures — a subtle but important distinction when building reliable error handling.

---

## Postman

Postman is a GUI application for designing, testing, and documenting REST APIs. It allows you to send HTTP requests (GET, POST, PUT, DELETE) to any endpoint and inspect the full response — status code, headers, and body — without writing a single line of frontend code.

Its real value in a professional workflow comes from **collections**: groups of saved requests that document how an API behaves. A well-structured Postman collection acts as living documentation — it shows not just the happy path but also what happens when things go wrong.

**Examples of what to test and document:**

| Scenario | Expected response |
|---|---|
| `POST /tasks` with valid body | `201 Created` |
| `POST /tasks` without a title | `400 Bad Request` |
| `DELETE /tasks/:id` with valid ID | `204 No Content` |
| `DELETE /tasks/:id` with non-existent ID | `404 Not Found` |

Postman also supports **environment variables**, so you can switch between `localhost:3000` and a production URL by just changing the active environment.

---

## Sentry

Sentry is an error monitoring and performance tracking platform. Once integrated into your application, it automatically captures unhandled exceptions, records the full stack trace, and sends you an alert — in real time.

Without Sentry, you only find out about errors when a user reports them. With Sentry, you know about the error before the user even notices.

Beyond error capture, Sentry provides:

- **Breadcrumbs**: a chronological trail of events leading up to the crash
- **Release tracking**: correlates errors with specific deployments so you know exactly which commit introduced a bug
- **Performance monitoring**: identifies slow database queries or API endpoints

In a Node.js/Express project, integration is a single middleware call:

```js
const Sentry = require('@sentry/node');

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());

// your routes here

app.use(Sentry.Handlers.errorHandler()); // must be before your own error handler
```

---

## Swagger

Swagger (now part of the **OpenAPI Specification**) is a standard for describing REST APIs in a machine-readable format (JSON or YAML). From that single specification file, tooling can automatically generate interactive documentation, client SDKs, and server stubs.

The most practical use in an Express project is `swagger-ui-express`, which serves a live, interactive documentation page directly from your running server — typically at `/api/docs`.

```js
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

This gives any developer — frontend, backend, or external — a self-service interface to explore every endpoint, see the expected request body, and test calls directly from the browser without needing Postman.

Swagger is the industry standard for API contracts. When two teams need to agree on how an API will behave before it is built, the OpenAPI spec is the document they write first.

---

## Summary

| Tool | Category | Primary purpose |
|---|---|---|
| **Axios** | HTTP client | Cleaner, more reliable HTTP requests |
| **Postman** | API testing | Manual testing and collection documentation |
| **Sentry** | Error monitoring | Real-time error tracking in production |
| **Swagger** | API documentation | Interactive, standardized API contracts |
