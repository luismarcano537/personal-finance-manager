# Personal Finance Manager

A portfolio-focused personal finance application for securely managing income, expenses, categories, and financial summaries. The ASP.NET Core backend MVP is complete; the frontend is planned and has not been implemented yet.

## Current Status

**Backend MVP: implemented**

The API supports authenticated financial data management, PostgreSQL persistence, consistent error responses, and interactive Swagger documentation. Frontend development is a future phase.

## Main Features

- User registration and JWT login
- Authenticated user profile endpoint
- Category CRUD
- Transaction CRUD with filtering
- Monthly income, expense, balance, and transaction summaries
- Monthly totals and transaction counts grouped by category
- Global API error handling
- Swagger / OpenAPI documentation
- User-level data isolation

## Tech Stack

- .NET 10 and ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL 16
- Docker and Docker Compose
- JWT Bearer authentication
- Swagger / OpenAPI

## Project Structure

```text
personal-finance-manager/
├── docker-compose.yml
└── src/
    ├── backend/
    │   ├── docs/
    │   │   └── backend-api.md
    │   ├── PersonalFinance.Api/
    │   ├── PersonalFinance.Application/
    │   ├── PersonalFinance.Domain/
    │   └── PersonalFinance.Infrastructure/
    └── frontend/                 # Planned
```

The backend follows a layered structure:

- `PersonalFinance.Api`: controllers, middleware, JWT configuration, and Swagger.
- `PersonalFinance.Application`: service interfaces and request/response contracts.
- `PersonalFinance.Domain`: entities and enums.
- `PersonalFinance.Infrastructure`: EF Core, PostgreSQL, and service implementations.

## Run the Backend Locally

Prerequisites:

- .NET 10 SDK
- Docker Desktop or Docker Engine with Compose
- EF Core CLI (`dotnet-ef`)

1. Start PostgreSQL from the repository root:

```bash
docker compose up -d postgres
```

2. Configure `ConnectionStrings:DefaultConnection` and the local `Jwt` settings. Use placeholders or local secret storage; do not commit credentials or signing keys.

3. Apply migrations:

```bash
cd src/backend
dotnet ef database update --project PersonalFinance.Infrastructure --startup-project PersonalFinance.Api
```

4. Run the API:

```bash
dotnet run --project PersonalFinance.Api
```

In Development, Swagger is available at:

```text
https://localhost:7240/swagger
```

## API Documentation

See [Backend API Documentation](src/backend/docs/backend-api.md) for local configuration, authentication, endpoints, and request/response examples.

## Security Notes

- Protected endpoints require a JWT Bearer token.
- User IDs are read from validated JWT claims, not accepted from request payloads.
- Authenticated users can access only their own categories, transactions, and summaries.
- Real database passwords and JWT signing keys must remain outside source control.

## Roadmap

- [x] Backend project architecture
- [x] PostgreSQL with Docker Compose
- [x] JWT authentication
- [x] Category and transaction management
- [x] Monthly and category summaries
- [x] Error handling and API documentation
- [ ] Implement the frontend application
- [ ] Add automated backend tests
- [ ] Add dashboard and data visualizations
- [ ] Prepare deployment and production configuration
