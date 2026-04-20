# 🚀 Kratia Backend

**High-performance, type-safe API engine powered by Bun.**

---

## 🛠 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Query Builder**: [Kysely](https://kysely.dev/) (Type-safe SQL)
- **Validation**: [Valibot](https://valibot.io/)
- **Logging**: [Pino](https://github.com/pinojs/pino)
- **Database**: PostgreSQL

## 🏗 Architecture

The backend follows a strict **Modular Controller** pattern:

- **`src/routes/`**: File-system based routing for API endpoints.
- **`src/core/`**: Shared services, database configuration, and security middleware.
- **Integration**: Deeply coupled with `@kratia/sdk` for unified validation and types.

## 🔒 Key Features

- **Atomic Auditing**: Built-in middleware to log every mutation for compliance.
- **Session Management**: Secure, JWT-based authentication system.
- **SQL Safety**: 100% type-safe database interactions via Kysely codegen.

## 🚦 Getting Started

### Environment Setup

Create a `.env` file in the backend root:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/kratia
JWT_SECRET=your_super_secret_key
PORT=3000
```

### Run

```bash
# Development
bun dev

# Build
bun build
```

## 🔗 Links

- **Live API**: [api.kratia.org](https://api.kratia.org)
- **API Docs**: [api.kratia.org/docs](https://api.kratia.org/docs)
