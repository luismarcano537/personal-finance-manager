# Personal Finance Manager

Personal Finance Manager is a personal portfolio project for managing income, expenses, categories, and monthly financial summaries.

The project is split into a layered ASP.NET Core backend and a React frontend. It is intended for local development and portfolio demonstration; it is not currently deployed to production.

## Current Status

Status: **In development**

| Area | Status |
| --- | --- |
| Backend MVP | Completed |
| Frontend MVP | In progress |
| Authentication | Completed |
| Categories | Completed |
| Transactions | Completed |
| Dashboard | In progress / polished |
| Deployment | Planned |

## Tech Stack

### Backend

- .NET / ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL 16
- Docker Compose
- JWT Bearer authentication
- Swagger / OpenAPI
- Global error handling

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS v4
- `@tailwindcss/vite`
- React Router
- Axios
- JWT stored in `localStorage`
- Protected routes
- Centralized design tokens in Tailwind using the Light Prosperity Finance visual identity

## Features

- User registration
- Login and logout
- JWT-based authentication
- Protected dashboard route
- Monthly dashboard summary
- Category-based dashboard summary
- Month and year selector on the dashboard
- Dashboard quick actions to create transactions and categories
- Category CRUD
- Transaction CRUD
- Transaction filters by month, year, type, and category
- Friendly frontend error handling
- Internal navigation with active states
- Swagger documentation for backend endpoints

## Backend Setup

Prerequisites:

- .NET SDK compatible with the backend project
- Docker Desktop or Docker Engine with Compose
- EF Core CLI, if database migrations need to be applied:

```bash
dotnet tool install --global dotnet-ef
```

From the repository root, start PostgreSQL:

```bash
docker compose up -d postgres
```

The local database is configured in `docker-compose.yml`:

```text
Host port: 5433
Container port: 5432
Database: personal_finance
User: postgres
Password: postgres
```

Apply migrations if the local database has not been created yet:

```bash
cd src/backend
dotnet ef database update --project PersonalFinance.Infrastructure --startup-project PersonalFinance.Api
```

Then run the API from `src/backend`:

```bash
dotnet run --project PersonalFinance.Api
```

The backend runs locally at:

```text
http://localhost:5174
https://localhost:7240
```

Swagger is available in development at:

```text
http://localhost:5174/swagger
https://localhost:7240/swagger
```

## Frontend Setup

Prerequisites:

- Node.js
- npm
- Backend API running locally

From the repository root:

```bash
cd src/frontend
npm install
```

Create a local environment file from the example:

```bash
cp .env.example .env
```

PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

Run the frontend:

```bash
npm run dev
```

Vite will print the local URL in the terminal. By default, it is usually:

```text
http://localhost:5173
```

## Environment Variables

The frontend uses `.env.example` as the documented local configuration template:

```env
VITE_API_BASE_URL=/api
```

`VITE_API_BASE_URL` defines the base URL used by the frontend Axios client. In local development, it should remain `/api` so browser requests go through the Vite proxy.

Do not commit local secrets or production credentials to `.env`.

## Vite Proxy

The frontend and backend run on different local ports during development:

- Frontend: Vite dev server, usually `http://localhost:5173`
- Backend: ASP.NET Core API, `http://localhost:5174`

The Vite proxy forwards frontend requests that start with `/api` to the backend:

```text
/api -> http://localhost:5174
```

This keeps frontend calls simple and avoids CORS issues while developing locally.

## Main Frontend Routes

| Route | Access | Description |
| --- | --- | --- |
| `/login` | Public | Login page. Authenticated users are redirected to the dashboard. |
| `/dashboard` | Protected | Monthly financial overview and category summary. |
| `/categories` | Protected | Category list and CRUD actions. |
| `/transactions` | Protected | Transaction list, filters, and CRUD actions. |

The root route `/` redirects to `/dashboard`, and unknown routes render a not found page.

## Screenshots

Screenshots have not been committed yet.

Expected paths:

```text
docs/screenshots/login.png
docs/screenshots/dashboard.png
```

After capturing the screens, add the files above and replace this note with image references:

```md
![Login screen](docs/screenshots/login.png)
![Dashboard screen](docs/screenshots/dashboard.png)
```

## Project Structure

```text
personal-finance-manager/
├── docker-compose.yml
├── README.md
└── src/
    ├── backend/
    │   ├── docs/
    │   │   └── backend-api.md
    │   ├── PersonalFinance.Api/
    │   ├── PersonalFinance.Application/
    │   ├── PersonalFinance.Domain/
    │   └── PersonalFinance.Infrastructure/
    └── frontend/
        ├── public/
        ├── src/
        │   ├── api/
        │   ├── assets/
        │   ├── components/
        │   ├── contexts/
        │   ├── hooks/
        │   ├── layouts/
        │   ├── pages/
        │   ├── routes/
        │   ├── services/
        │   ├── types/
        │   └── utils/
        ├── .env.example
        ├── package.json
        └── vite.config.ts
```

The backend follows a layered architecture:

- `PersonalFinance.Domain`: entities and domain enums.
- `PersonalFinance.Application`: service interfaces and request/response contracts.
- `PersonalFinance.Infrastructure`: EF Core, PostgreSQL persistence, and service implementations.
- `PersonalFinance.Api`: controllers, middleware, authentication configuration, and Swagger.

## Additional Documentation

See [Backend API Documentation](src/backend/docs/backend-api.md) for endpoint details and backend-specific notes.

## Roadmap

- Charts
- Recurring transactions
- Budget goals
- Export reports
- Deployment
- Tests
- CI/CD

## Author

Luis Marcano
