# 📦 Kratia SDK

**The "Single Source of Truth" for the Kratia Ecosystem.**

---

## 🎯 Purpose

The SDK ensures that the **Frontend** and **Backend** are always in sync. It centralizes all the shared logic that defines the "rules" of the Kratia ERP.

## 🧬 Shared Core

- **Shared Types**: TypeScript definitions used across all workspaces.
- **Valibot Schemas**: Validation rules for forms (Frontend) and API requests (Backend).
- **Business Logic**: Unified calculations and utility functions.
- **API Client**: Standardized fetch wrappers for seamless backend communication.

## 🚀 Usage

The SDK is consumed as a workspace package:

```json
{
  "dependencies": {
    "@kratia/sdk": "workspace:*"
  }
}
```

## 🛠 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Validation**: [Valibot](https://valibot.io/)
- **Language**: TypeScript (Strict Mode)

---

<div align="center">
  <p><i>Maintain consistency, eliminate drift.</i></p>
</div>
