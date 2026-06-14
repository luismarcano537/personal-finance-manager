# Personal Finance Manager Backend API

## 1. Backend overview

The backend is an ASP.NET Core API for managing a user's categories, income and expense transactions, and monthly summaries. Protected endpoints use JWT authentication, and persistence is handled by PostgreSQL through Entity Framework Core.

The solution is split into:

- `PersonalFinance.Api`: controllers, middleware, authentication, and Swagger.
- `PersonalFinance.Application`: service interfaces and API contracts.
- `PersonalFinance.Domain`: entities and enums.
- `PersonalFinance.Infrastructure`: EF Core, PostgreSQL, and service implementations.

## 2. Tech stack

- .NET 10 / ASP.NET Core
- Entity Framework Core 10
- PostgreSQL 16
- Npgsql
- JWT Bearer authentication
- Swagger / OpenAPI
- Docker Compose

## 3. Local setup

Run commands from `src/backend` unless noted otherwise.

### Start PostgreSQL

The repository root contains `docker-compose.yml` with PostgreSQL exposed on port `5433`.

```bash
docker compose -f ../../docker-compose.yml up -d postgres
```

Example connection string matching the Docker service:

```text
Host=localhost;Port=5433;Database=personal_finance;Username=postgres;Password=<development-password>
```

Set `ConnectionStrings:DefaultConnection` and the `Jwt` settings in local configuration. Use a strong JWT key of at least 32 characters and do not commit secrets.

### Apply migrations

```bash
dotnet ef database update --project PersonalFinance.Infrastructure --startup-project PersonalFinance.Api
```

Install the EF CLI first if it is unavailable:

```bash
dotnet tool install --global dotnet-ef
```

### Run the API

```bash
dotnet run --project PersonalFinance.Api
```

Development URLs from the launch profile:

- HTTP: `http://localhost:5174`
- HTTPS: `https://localhost:7240`

## 4. Swagger URL

Swagger is enabled in the Development environment:

```text
https://localhost:7240/swagger
```

The HTTP equivalent is `http://localhost:5174/swagger`.

## 5. Authentication

Register or log in to obtain an `accessToken`. Send it to protected endpoints in the `Authorization` header:

```http
Authorization: Bearer <access-token>
```

Example login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alex@example.com",
  "password": "example-password"
}
```

Example response:

```json
{
  "accessToken": "<jwt-token>",
  "expiresAt": "2026-06-14T22:00:00Z",
  "user": {
    "id": "11111111-1111-1111-1111-111111111111",
    "name": "Alex",
    "email": "alex@example.com",
    "createdAt": "2026-06-14T20:00:00Z"
  }
}
```

## 6. Endpoints

All routes below use the `/api` prefix. Categories, transactions, summaries, and `GET /auth/me` require a Bearer token.

### Auth

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Authenticate and return a JWT |
| `GET` | `/api/auth/me` | Return the authenticated user |

Register request:

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "password": "example-password"
}
```

### Categories

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/categories` | Create a category |
| `GET` | `/api/categories?type=2` | List categories; `type` is optional |
| `GET` | `/api/categories/{id}` | Get a category |
| `PUT` | `/api/categories/{id}` | Update a category |
| `DELETE` | `/api/categories/{id}` | Deactivate a category |

Create/update request:

```json
{
  "name": "Groceries",
  "type": 2
}
```

Example response:

```json
{
  "id": "22222222-2222-2222-2222-222222222222",
  "name": "Groceries",
  "type": 2,
  "createdAt": "2026-06-14T20:10:00Z",
  "updatedAt": null,
  "isActive": true
}
```

### Transactions

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/transactions` | Create a transaction |
| `GET` | `/api/transactions` | List transactions |
| `GET` | `/api/transactions/{id}` | Get a transaction |
| `PUT` | `/api/transactions/{id}` | Update a transaction |
| `DELETE` | `/api/transactions/{id}` | Deactivate a transaction |

`GET /api/transactions` accepts optional `month`, `year`, `type`, and `categoryId` query parameters.

Create/update request:

```json
{
  "categoryId": "22222222-2222-2222-2222-222222222222",
  "type": 2,
  "amount": 125.50,
  "description": "Weekly groceries",
  "transactionDate": "2026-06-14T12:00:00Z"
}
```

Example response:

```json
{
  "id": "33333333-3333-3333-3333-333333333333",
  "categoryId": "22222222-2222-2222-2222-222222222222",
  "categoryName": "Groceries",
  "type": 2,
  "amount": 125.50,
  "description": "Weekly groceries",
  "transactionDate": "2026-06-14T12:00:00Z",
  "createdAt": "2026-06-14T20:15:00Z",
  "updatedAt": null,
  "isActive": true
}
```

### Summary

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/summary/monthly?month=6&year=2026` | Monthly income, expenses, balance, and count |
| `GET` | `/api/summary/categories?month=6&year=2026&type=2` | Totals and counts grouped by category; `type` is optional |

Monthly summary response:

```json
{
  "month": 6,
  "year": 2026,
  "totalIncome": 5000.00,
  "totalExpense": 1850.50,
  "balance": 3149.50,
  "transactionsCount": 18
}
```

Category summary response:

```json
{
  "month": 6,
  "year": 2026,
  "type": 2,
  "categories": [
    {
      "categoryId": "22222222-2222-2222-2222-222222222222",
      "categoryName": "Groceries",
      "total": 625.75,
      "transactionsCount": 5
    }
  ]
}
```

## 7. API error response pattern

Global exception middleware returns a consistent JSON shape:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Month must be between 1 and 12. (Parameter 'month')",
  "traceId": "0HMP..."
}
```

Common statuses are `400`, `401`, `404`, `409`, and `500`. Unexpected errors return a generic message; stack traces are not included in API responses.

## 8. Useful enum values

`CategoryType` is represented numerically in JSON and query strings:

| Value | Meaning |
|---|---|
| `1` | Income |
| `2` | Expense |

## 9. Security notes

- Protected endpoints derive the user ID from validated JWT claims.
- Category, transaction, and summary requests do not accept a user ID.
- Queries are scoped to the authenticated user, preventing access to another user's data.
- Passwords and JWT signing keys must not be committed or included in client-visible responses.
- Use HTTPS and secure secret storage outside local development.

## 10. Current backend status

Implemented:

- JWT registration, login, and current-user lookup
- Protected category CRUD
- Protected transaction CRUD and filtering
- Monthly financial summary
- Category summary with optional income/expense filtering
- Global API error handling
- PostgreSQL persistence and EF Core migrations
- Docker PostgreSQL setup
- Development Swagger UI
