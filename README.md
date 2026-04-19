# Kratia

![Kratia Banner](https://img.shields.io/badge/Architecture-Modular_Monorepo-blueviolet?style=for-the-badge)
![Built with Bun](https://img.shields.io/badge/Runtime-Bun-black?style=for-the-badge&logo=bun)
![Qwik](https://img.shields.io/badge/Frontend-Qwik-006AFF?style=for-the-badge&logo=qwik)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)

**Kratia** is a high-performance, modular ERP infrastructure designed for modern enterprise needs. Built with a "Type-First" philosophy, it leverages a unified SDK to ensure seamless consistency between its high-velocity backend and its ultra-fast, resumable frontend.

## 🏗 Architecture

Kratia is organized as a **Bun Monorepo**, ensuring atomic development and unified dependency management:

- **`frontend/`**: Powered by **Qwik City**, delivering zero-bundle-size initial loads and instant interactivity.
- **`backend/`**: A lightweight, ultra-fast API server running on **Bun**, utilizing **Kysely** for type-safe database interactions.
- **`sdk/`**: The heart of the system. Contains shared types, validation schemas (Valibot), and unified business logic used by both ends.

## 🚀 Key Features

- **Total Modularity**: Functional units are isolated, allowing for independent scaling and maintenance.
- **Universal Auditing**: Built-in atomic transaction logging for every system change.
- **Unified Validation**: Write your schemas once in the SDK; enforce them everywhere (API & UI).
- **Type-Safe SQL**: No more string-based queries. Every database interaction is validated at compile time.
- **Resumable UI**: Leveraging Qwik's unique serialization to eliminate hydration overhead.

## 🛠 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Frontend**: [Qwik](https://qwik.dev/)
- **ORM/Query Builder**: [Kysely](https://kysely.dev/)
- **Validation**: [Valibot](https://valibot.io/)
- **Database**: PostgreSQL
- **Language**: TypeScript (Strict Mode)

## 🚦 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.

### Installation

```bash
# Clone the repository
git clone https://github.com/kratia-org/kratia.git
cd kratia

# Install dependencies for all workspaces
bun install
```

### Development

Run all workspaces simultaneously:

```bash
bun dev
```

Or target a specific workspace:

```bash
bun --filter '@kratia/backend' dev
```

## 📜 License

This project is private and confidential. Created by [fromero2408](https://github.com/fromero2408).
