<div align="center">
  <img src="./assets/logo.png" alt="Kratia Logo" width="120" />
  <h1>Kratia ERP</h1>
  <p><strong>The High-Performance Modular ERP for Modern Governance</strong></p>

  [![Demo Frontend](https://img.shields.io/badge/Live_Demo-Frontend-006AFF?style=for-the-badge&logo=qwik)](https://erp.kratia.org)
  [![Demo Backend](https://img.shields.io/badge/Live_Demo-Backend-black?style=for-the-badge&logo=bun)](https://api.kratia.org)
  <br />
  ![Bun](https://img.shields.io/badge/Runtime-Bun-black?style=flat-square&logo=bun)
  ![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript)
  ![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)
</div>

---

## 🏛 Ecosystem Architecture

Kratia is built as a **Type-First Monorepo**, ensuring total synchronization between the core logic and the user interface.

- **[Frontend](./frontend)**: Powered by **Qwik City**. Ultra-fast, resumable UI with zero hydration overhead.
- **[Backend](./backend)**: High-velocity API built on **Bun** & **Kysely**. Designed for massive throughput and atomic auditing.
- **[SDK](./sdk)**: The single source of truth. Shared schemas, validation rules, and business logic.

## 🚀 Key Features

- **⚡ Zero-Latency UX**: Leveraging Qwik's resumability for instant-on applications.
- **🛡️ Type-Safe Everything**: SQL queries, API contracts, and form validations are all unified in the SDK.
- **📊 Universal Auditing**: Every system change is tracked and logged at the database level.
- **🧩 Atomic Modularity**: Plug-and-play modules for finance, inventory, and human resources.

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime** | [Bun](https://bun.sh/) |
| **Frontend** | [Qwik](https://qwik.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) + [Kysely](https://kysely.dev/) |
| **Validation** | [Valibot](https://valibot.io/) |
| **State/Forms** | [Modular Forms](https://modularforms.dev/) |

## 🏁 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.1+)

### Installation

```bash
# Clone & Enter
git clone https://github.com/kratia-org/kratia.git && cd kratia

# Install all workspace dependencies
bun install
```

### Development

```bash
# Start all services (Frontend, Backend, SDK)
bun dev
```

---

<div align="center">
  <p>Built with ❤️ by the Kratia Team</p>
  <a href="https://github.com/kratia-org">GitHub</a> • <a href="https://erp.kratia.org">Website</a> • <a href="https://api.kratia.org">API Documentation</a>
</div>
