# Veridion Flow 🚀

Veridion Flow is a production-grade, enterprise compliance engine designed to ingest, version, and monitor complex regulatory frameworks (like the EU AI Act). It maps continuous regulatory revisions, archives historical records, matches chunks via hybrid parent-child vector routing, and features a real-time Human-in-the-Loop (HITL) manual validation stream.

---

## 🏗️ System Architecture & Stack

The monorepo workspace is explicitly separated into independent execution layers:

*   **`veridion-fastapi/` (Data Processing Engine):** Python 3.11+, FastAPI, SQLAlchemy, Vector Embeddings (`pgvector`), and automated evaluation matrices via Ragas.
*   **`veridion-node/` (Security & Gateway Orchestration):** Node.js, TypeScript, Express, WebSockets, and asynchronous task management via BullMQ/Redis.
*   **`veridion-frontend/` (Analytics Portal):** Next.js App Router (TypeScript), Material UI (MUI) components, Tailwind CSS styling tokens, TanStack Query data fetching, and Zustand client store management.
*   **Infrastructure (Docker Layer):** PostgreSQL (`pgvector` expansion enabled) and Redis instances.

---

## 📂 Project Repository Tree

```text
veridion-workspace/
├── docker-compose.yml              # Multi-container infrastructure orchestration
├── .gitignore                      # Monorepo system exclusion rules
├── README.md                       # Workspace initialization and operational guide
├── veridion-fastapi/               # Data processing & Parent-Child chunk engine
├── veridion-node/                  # State orchestration & real-time socket gateway
└── veridion-frontend/              # Next.js workspace & Material UI interface
```

## 🛠️ Rapid Local Initialization Setup

Prerequisites

Make sure your machine has Docker Desktop, Python 3.11+, and Node.js 18+ installed.

1. Boot up the Infrastructure Substrate
From the root workspace directory, spin up the background database and message brokers:

```Bash
docker compose up -d
```

2. Launch the FastAPI Processing Backend

```Bash
cd veridion-fastapi
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

1. Initialize the Node Security Gateway
   
Open a new terminal session and run:

```Bash
cd veridion-node
npm install
npm run dev
```
1. Open the Next.js Analytics Portal
   
Open a third terminal session and run:

```Bash
cd veridion-frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser to view the interface.
